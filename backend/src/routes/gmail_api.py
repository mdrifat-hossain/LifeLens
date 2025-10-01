from fastapi import Depends, HTTPException, Request, APIRouter, Body
from fastapi.responses import RedirectResponse, JSONResponse
from typing import List
from pydantic import BaseModel
import traceback
from ..utils import authenticate_and_get_user_details
from ..database.database import get_db
import time, json, os, requests
from dotenv import load_dotenv
from urllib.parse import urlencode
from datetime import datetime, timezone
import email.utils
from ..external_apis import gmail_api
from . import throttling
from ..ai_generator.ai_email import ai_email_generator

load_dotenv()
router = APIRouter()


GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URL")

AUTH_URI = os.getenv("AUTH_URL")
TOKEN_URI = os.getenv("TOKEN_URL")

SCOPES = [
    "https://www.googleapis.com/auth/gmail.send",   # needed for sending
    "https://www.googleapis.com/auth/gmail.readonly",  # keep this if you still want read access
    "https://www.googleapis.com/auth/gmail.modify"
]

# STEP 1: Redirect user to Google login
@router.get("/auth/google/login")
def google_login():
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "response_type": "code",
        "scope": " ".join(SCOPES),
        "access_type": "offline",
        "prompt": "consent",
    }
    url = f"{AUTH_URI}?{urlencode(params)}"
    return {"auth_url": url}


# temporary in-memory token store
USER_TOKENS = {}


@router.get("/auth/google/callback")
def google_callback(request: Request):
    try:
        user_details = authenticate_and_get_user_details(request)

        user_id = user_details.get("user_id") if user_details else None
        if not user_id:
            return JSONResponse({"error": "No user_id found"}, status_code=400)

        code = request.query_params.get("code")
        if not code:
            return JSONResponse({"error": "No code provided"}, status_code=400)

        token_data = {
            "code": code,
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": REDIRECT_URI,
            "grant_type": "authorization_code",
        }
        r = requests.post(TOKEN_URI, data=token_data)
        print("Token response:", r.text)

        tokens = r.json()
        access_token = tokens.get("access_token")
        if not access_token:
            return JSONResponse({"error": tokens}, status_code=400)

        USER_TOKENS[user_id] = tokens

        return RedirectResponse(url="http://localhost:5173/email")

    except Exception as e:
        import traceback
        print("Error in callback:", traceback.format_exc())
        return JSONResponse({"error": str(e)}, status_code=500)



@router.get("/auth/status")
def auth_status(request: Request):

    user_details = authenticate_and_get_user_details(request)
    user_id = user_details.get("user_id")

    tokens = USER_TOKENS.get(user_id)
    if not tokens:
        return {"logged_in": False}
    return {"logged_in": True}


@router.post("/auth/logout")
def logout(request: Request):
    try:
        user_details = authenticate_and_get_user_details(request)
        user_id = user_details.get("user_id")

        if user_id in USER_TOKENS:
            del USER_TOKENS[user_id]  # remove tokens from memory/DB

        return {"status": "success", "message": "Logged out"}
    except Exception as e:
        print("Caught exception:", type(e), e)
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@router.get("/gmail/inbox")
def get_inbox(request: Request):

    user_details = authenticate_and_get_user_details(request)
    user_id = user_details.get("user_id")

    tokens = USER_TOKENS.get(user_id)
    if not tokens:
        return JSONResponse({"error": "Not logged in"}, status_code=401)
    return {"messages": gmail_api.list_messages(tokens["access_token"], "INBOX")}


@router.get("/gmail/sent")
def get_sent(request: Request):

    user_details = authenticate_and_get_user_details(request)
    user_id = user_details.get("user_id")

    tokens = USER_TOKENS.get(user_id)
    if not tokens:
        return JSONResponse({"error": "Not logged in"}, status_code=401)
    return {"messages": gmail_api.list_messages(tokens["access_token"], "SENT")}


@router.get("/gmail/spam")
def get_spam(request: Request):

    user_details = authenticate_and_get_user_details(request)
    user_id = user_details.get("user_id")

    tokens = USER_TOKENS.get(user_id)
    if not tokens:
        return JSONResponse({"error": "Not logged in"}, status_code=401)
    return {"messages": gmail_api.list_messages(tokens["access_token"], "SPAM")}



@router.post("/generate-email")
async def generate_email_route(
    query: str = Body(..., embed=False),
    request: Request = None,
    db_dep=Depends(get_db)
):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request)
        user_id = user_details.get("user_id")


        await throttling.apply_rate_limit(user_id, cursor, conn)

        validation_result = await ai_email_generator.email_query_validator(query)
        validation_dict = validation_result.dict()

        status = validation_dict["status"]
        reason = validation_dict["reason"]

        if status == "valid":
            new_email = await ai_email_generator.generate_email(query)
            new_email = new_email.dict()

            return {"status": "success", "message": "Email request is valid.", "data": new_email}
        else:
            return {"status": "error", "message": "Email request is invalid.", "reason": reason}

    except HTTPException as e:
        raise e
    except Exception as e:
        print("Caught exception:", type(e), e)
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")



import base64
from email import message_from_string
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from email.mime.text import MIMEText

@router.post("/send-email")
async def send_email(
    email: str = Body(..., embed=False),
    request: Request = None,
):
    try:
        user_details = authenticate_and_get_user_details(request)
        user_id = user_details.get("user_id")

        tokens = USER_TOKENS.get(user_id)
        if not tokens:
            raise HTTPException(status_code=401, detail="User not logged in")

        access_token = tokens["access_token"]

        # Parse the raw email
        msg = message_from_string(email)
        to_header = msg["To"]
        subject = msg["Subject"]
        body = msg.get_payload()

        # Handle multiple recipients
        recipients = [addr.strip() for addr in to_header.split(",") if addr.strip()]

        # Build Gmail API client
        creds = Credentials(token=access_token)
        service = build("gmail", "v1", credentials=creds)

        # Construct MIME message
        mime_message = MIMEText(body)

        # Multiple recipients (To)
        mime_message["to"] = ", ".join(recipients)

        # Support BCC if present in raw email
        if msg["Bcc"]:
            bcc_recipients = [addr.strip() for addr in msg["Bcc"].split(",") if addr.strip()]
            mime_message["bcc"] = ", ".join(bcc_recipients)

        mime_message["subject"] = subject

        # Encode and send
        raw = base64.urlsafe_b64encode(mime_message.as_bytes()).decode()
        message = {"raw": raw}
        sent_message = service.users().messages().send(userId="me", body=message).execute()

        return {
            "status": "success",
            "message_id": sent_message["id"],
            "recipients": recipients,
            "bcc": msg["Bcc"] if msg["Bcc"] else None
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        import traceback
        print("Caught exception:", type(e), e)
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


GMAIL_API_BASE = "https://gmail.googleapis.com/gmail/v1"
@router.post("/gmail/mark-read/{msg_id}")
def mark_as_read(msg_id: str, request: Request):
    user_details = authenticate_and_get_user_details(request)
    user_id = user_details.get("user_id")

    tokens = USER_TOKENS.get(user_id)
    if not tokens:
        return JSONResponse({"error": "Not logged in"}, status_code=401)

    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    url = f"{GMAIL_API_BASE}/users/me/messages/{msg_id}/modify"

    res = requests.post(
        url,
        headers=headers,
        json={"removeLabelIds": ["UNREAD"]},
    )

    if res.status_code == 200:
        return {"status": "success", "message": "Email marked as read"}
    else:
        return JSONResponse(res.json(), status_code=res.status_code)
