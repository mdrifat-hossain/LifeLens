from fastapi import APIRouter, Depends, HTTPException, Request
from ..database.database import get_db
from ..database import account_db
from ..utils import authenticate_and_get_user_details

router = APIRouter()

from pydantic import BaseModel
from typing import Optional

class TransactionCreate(BaseModel):
    accountId: int
    amount: float
    type: str       # "CREDIT" or "DEBIT"
    description: str

# Get accounts
@router.get("/get-accounts")
async def get_accounts(request_obj: Request, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]

        accounts = await account_db.get_all_accounts(cursor, user_id)
        return {"accounts": accounts}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error in get_accounts: {str(e)}")


# Add account
@router.post("/add-account")
async def add_account(request_obj: Request, body: dict, db_dep=Depends(get_db)):
    # print("Request body:", body)
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]

        account_name = body.get("accountName")
        balance = body.get("balance", 0.0)

        if not account_name:
            raise HTTPException(status_code=400, detail="Account name is required")

        account_id = await account_db.create_account(cursor, conn, user_id, account_name, balance)

        return {
            "account_id": account_id,
            "user_id": user_id,
            "account_name": account_name,
            "balance": balance
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error in add_account: {str(e)}")


# Get transactions
@router.get("/get-transactions")
async def get_transactions(request_obj: Request, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]

        transactions = await account_db.get_all_transactions(cursor, user_id)
        return {"transactions": transactions}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error in get_transactions: {str(e)}")


# Add transaction
@router.post("/add-transaction")
async def add_transaction(request_obj: Request, body: TransactionCreate, db_dep=Depends(get_db)):
    print("Received body:", body.dict())
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]

        if body.type not in ("CREDIT", "DEBIT"):
            raise HTTPException(status_code=400, detail="Type must be CREDIT or DEBIT")

        # Check account exists
        await cursor.execute(
            "SELECT account_ID FROM accounts WHERE account_ID=%s AND user_ID=%s",
            (body.accountId, user_id)
        )
        account = await cursor.fetchone()
        if not account:
            raise HTTPException(status_code=400, detail="Account not found for user")

        transaction_ID = await account_db.create_transaction(
            cursor, conn, body.accountId, body.amount, body.type, body.description
        )

        return {
            "transaction_ID": transaction_ID,
            "account_ID": body.accountId,
            "amount": body.amount,
            "type": body.type,
            "description": body.description,
        }

    except Exception as e:
        print("Route Exception:", e)
        raise HTTPException(status_code=500, detail=f"Internal error in add_transaction: {str(e)}")
