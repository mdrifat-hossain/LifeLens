import requests
from datetime import datetime
import email.utils


GMAIL_API_BASE = "https://gmail.googleapis.com/gmail/v1"


def parse_header(headers, name):
    for h in headers:
        if h["name"].lower() == name.lower():
            return h["value"]
    return ""


def list_messages(access_token: str, label: str = "INBOX"):
    headers = {"Authorization": f"Bearer {access_token}"}

    r = requests.get(
        f"{GMAIL_API_BASE}/users/me/messages",
        headers=headers,
        params={"maxResults": 20, "labelIds": label},
    )

    if r.status_code != 200:
        return []

    messages = r.json().get("messages", [])
    email_list = []

    for msg in messages:
        msg_id = msg["id"]
        detail_res = requests.get(
            f"{GMAIL_API_BASE}/users/me/messages/{msg_id}",
            headers=headers,
            params={"format": "full"},
        )
        if detail_res.status_code != 200:
            continue

        payload = detail_res.json()
        headers_list = payload.get("payload", {}).get("headers", [])

        subject = parse_header(headers_list, "Subject")
        from_raw = parse_header(headers_list, "From")
        to = parse_header(headers_list, "To")
        date_raw = parse_header(headers_list, "Date")

        # Extract name + email separately
        from_name, from_email = email.utils.parseaddr(from_raw)

        # Convert timestamp
        try:
            timestamp = datetime.strptime(date_raw, "%a, %d %b %Y %H:%M:%S %z")
        except Exception:
            timestamp = datetime.utcnow()

        # Extract body (plain text fallback)
        body = extract_body(payload.get("payload", {})) or "(No Content)"

        email_obj = {
            "id": msg_id,
            "from": from_name or from_email,
            "fromEmail": from_email,
            "to": to,
            "subject": subject  or "(No Subject)",
            "body": body or "(No Content)",
            "timestamp": timestamp.isoformat(),
            "isRead": "UNREAD" not in payload.get("labelIds", []),
            "isImportant": "IMPORTANT" in payload.get("labelIds", []),
            "isStarred": "STARRED" in payload.get("labelIds", []),
        }

        email_list.append(email_obj)

    return email_list


import base64

def extract_body(payload):
    """Recursively extract plain text body from Gmail message payload."""
    if "parts" in payload:
        for part in payload["parts"]:
            # If nested parts, recurse
            if part.get("mimeType") == "multipart/alternative" or "parts" in part:
                body = extract_body(part)
                if body:
                    return body

            # If plain text, return decoded body
            if part.get("mimeType") == "text/plain":
                data = part.get("body", {}).get("data")
                if data:
                    return base64.urlsafe_b64decode(data).decode("utf-8", errors="ignore")
    else:
        # Fallback: body at top-level
        data = payload.get("body", {}).get("data")
        if data:
            return base64.urlsafe_b64decode(data).decode("utf-8", errors="ignore")

    return None
