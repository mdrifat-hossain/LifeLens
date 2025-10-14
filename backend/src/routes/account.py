from fastapi import APIRouter, Depends, HTTPException, Request
from ..database.database import get_db
from ..database import account_db
from ..utils import authenticate_and_get_user_details
from ..ai_generator.ai_finance import ai_generator
from zoneinfo import ZoneInfo
from datetime import datetime, timedelta
import traceback

router = APIRouter()

from pydantic import BaseModel
from typing import Optional

class TransactionCreate(BaseModel):
    accountId: int
    amount: float
    type: str       # "CREDIT" or "DEBIT"
    description: str
    categoryId: int
    
class BudgetRequest(BaseModel):
    category_id: int
    limit_amount: float

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
    
@router.get("/get-single-account")
async def get_account(request_obj: Request, account_id: int, db_dep=Depends(get_db)):
    """
    Get details of a specific account by account_id
    """
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]

        account = await account_db.get_account_by_id(cursor, user_id, account_id)
        if not account:
            raise HTTPException(status_code=404, detail="Account not found")

        return {"account": account}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error in get_account: {str(e)}")
    
@router.get("/all-account-details")
async def get_account(request_obj: Request, db_dep=Depends(get_db)):
    """
    Get the 'All Accounts' summary (total balance of all user accounts)
    """
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]

        # print("Fetching summary of all accounts")
        account = await account_db.get_all_account_details(cursor, user_id)

        if not account or account["balance"] is None:
            raise HTTPException(status_code=404, detail="No accounts found")

        # print("Account details:", account)
        return {"account": account}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error in get_account: {str(e)}")




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
# @router.get("/get-transactions")
# async def get_transactions(
#     request_obj: Request,
#     account_id: int | None = None,   # optional query param
#     db_dep=Depends(get_db)
# ):
#     try:
#         cursor, conn = db_dep
#         user_details = authenticate_and_get_user_details(request_obj)
#         user_id = user_details["user_id"]

#         if account_id:
#             transactions = await account_db.get_transactions_by_account(cursor, user_id, account_id)
#         else:
#             transactions = await account_db.get_all_transactions(cursor, user_id)

#         return {"transactions": transactions}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Internal error in get_transactions: {str(e)}")


# Get categories
@router.get("/get-categories")
async def get_categories(request_obj: Request, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]

        categories = await account_db.get_categories(cursor, user_id)
        return {"categories": categories}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error in get_transactions: {str(e)}")

# Add transaction
@router.post("/add-transaction")
async def add_transaction(request_obj: Request, body: TransactionCreate, db_dep=Depends(get_db)):
    # print("Received body:", body.dict())
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
            cursor, conn, body.accountId, body.amount, body.type, body.description, body.categoryId
        )

        return {
            "transaction_ID": transaction_ID,
            "account_ID": body.accountId,
            "amount": body.amount,
            "type": body.type,
            "description": body.description,
            "category_id": body.categoryId,
        }

    except Exception as e:
        print("Route Exception:", e)
        raise HTTPException(status_code=500, detail=f"Internal error in add_transaction: {str(e)}")


# @router.get("/get-spending-by-category")
# async def get_spending_by_category_route(request_obj: Request, db_dep=Depends(get_db)):
#     try:
#         cursor, conn = db_dep
#         user_details = authenticate_and_get_user_details(request_obj)
#         user_id = user_details["user_id"]

#         spending = await account_db.get_spending_by_category(cursor, user_id)
#         return {"spending": spending}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Internal error in get_spending_by_category: {str(e)}")
@router.get("/get-spending-by-category")
async def get_spending_by_category_route(
    request_obj: Request,
    period: str = "this_month",
    db_dep=Depends(get_db)
):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]

        # Calculate date filter based on period
        today = datetime.today()
        start_date = None
        end_date = today

        if period == "this_month":
            start_date = today.replace(day=1)
        elif period == "last_month":
            first_day_this_month = today.replace(day=1)
            end_date = first_day_this_month - timedelta(days=1)
            start_date = end_date.replace(day=1)
        else:  # 'all'
            start_date = None  # no date filter

        spending = await account_db.get_spending_by_category(cursor, user_id, start_date, end_date)
        return {"spending": spending}

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error in get_spending_by_category: {str(e)}")

@router.get("/get-budgets")
async def get_budgets(request_obj: Request, db_dep=Depends(get_db)):
    cursor, conn = db_dep
    user_details = authenticate_and_get_user_details(request_obj)
    user_id = user_details["user_id"]
    budgets = await account_db.get_user_budgets(cursor, user_id)
    return {"budgets": budgets}


@router.post("/set-budget")
async def set_budget(
    request_obj: Request,
    budget: BudgetRequest, 
    db_dep=Depends(get_db)
):
    try:
        # print("Setting budget:", budget)
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]

        category_id = budget.category_id
        limit_amount = budget.limit_amount

        # print("✅Setting budget:step2", category_id, limit_amount, user_id)

        await account_db.upsert_budget(cursor, user_id, category_id, limit_amount)
        # await conn.commit()

        return {"message": "Budget set successfully"}
    except Exception as e:
        print("Route Exception:", e)
        raise HTTPException(status_code=500, detail=f"Internal error in add_transaction: {str(e)}")


@router.get("/dashboard-metrics")
async def get_dashboard_metrics(request_obj: Request, db_dep=Depends(get_db)):
    try:
        # print("✅step 1")
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]
        
        #✅ Ensure user exists in DB
        await account_db.ensure_user_exists(cursor, conn, user_id)

        # Call DB functions
        total_balance = await account_db.get_total_balance(cursor, user_id)
        monthly_income = await account_db.get_monthly_income(cursor, user_id)
        monthly_expenses = await account_db.get_monthly_expenses(cursor, user_id)
        # print("Total balance:", total_balance)

        # Auto-savings (default calculation)
        savings_rate = 0
        if monthly_income > 0:
            savings_rate = ((monthly_income - monthly_expenses) / monthly_income) * 100
            
        # print("✅step 2")
        return {
            "total_balance": total_balance,
            "monthly_income": monthly_income,
            "monthly_expenses": monthly_expenses,
            "savings_rate": savings_rate
        }
    except Exception as e:
        print("Route Exception:", e)
        raise HTTPException(status_code=500, detail=f"Internal error in add_transaction: {str(e)}")
    


@router.put("/update-transaction/{transaction_id}")
async def update_transaction(transaction_id: int, data: dict, request_obj: Request, db_dep=Depends(get_db)):
    cursor, conn = db_dep
    user_details = authenticate_and_get_user_details(request_obj)
    user_id = user_details["user_id"]

    # Verify transaction ownership
    try:
        await cursor.execute("SELECT account_ID FROM transactions WHERE transaction_ID=%s", (transaction_id,))
        txn = await cursor.fetchone()
        if not txn:
            raise HTTPException(status_code=404, detail="Transaction not found")

        account_id = txn["account_ID"]
        await cursor.execute("SELECT user_id FROM accounts WHERE account_ID=%s", (account_id,))
        account = await cursor.fetchone()
        if account["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized")

        print("Updating transaction with data:", data, transaction_id)
        await account_db.update_transaction_db(cursor, conn, transaction_id, data)
        return {"message": "Transaction updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Route error in update_transaction: {e}")


@router.delete("/delete-transaction/{transaction_id}")
async def delete_transaction(transaction_id: int, request_obj: Request, db_dep=Depends(get_db)):
    cursor, conn = db_dep
    user_details = authenticate_and_get_user_details(request_obj)
    user_id = user_details["user_id"]

    try:
        await cursor.execute("SELECT account_ID FROM transactions WHERE transaction_ID=%s", (transaction_id,))
        txn = await cursor.fetchone()
        if not txn:
            raise HTTPException(status_code=404, detail="Transaction not found")

        account_id = txn["account_ID"]
        await cursor.execute("SELECT user_id FROM accounts WHERE account_ID=%s", (account_id,))
        account = await cursor.fetchone()
        if account["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized")

        print("Deleting transaction:", transaction_id)
        await account_db.delete_transaction_db(cursor, conn, transaction_id,account_id,user_id)
        return {"message": "Transaction deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Route error in delete_transaction: {e}")


@router.get("/get-transactions")
async def get_transactions(request_obj: Request, account_id: int = None, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]

        if account_id:
            transactions = await account_db.get_transactions_by_account(cursor, user_id, account_id)
        else:
            transactions = await account_db.get_all_transactions(cursor, user_id)

        return {"transactions": transactions}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error in get_transactions: {str(e)}")



@router.put("/update-transaction/{transaction_id}")
async def update_transaction_route(transaction_id: int, data: dict, request_obj: Request, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]

        result = await account_db.update_transaction(cursor, conn, user_id, transaction_id, data)
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error in update_transaction: {str(e)}")


@router.delete("/delete-transaction/{transaction_id}")
async def delete_transaction_route(transaction_id: int, request_obj: Request, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]

        result = await account_db.delete_transaction(cursor, conn, user_id, transaction_id)
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error in delete_transaction: {str(e)}")
    

@router.get("/finance-suggestion")
async def finance_suggestion(request: Request = None, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request)
        user_id = user_details.get("user_id")
        user_tz_name = user_details.get("timezone", "UTC")

        # Handle timezone safely
        try:
            user_tz = ZoneInfo(user_tz_name)
        except Exception:
            user_tz = ZoneInfo("UTC")

        today_user = datetime.now(user_tz).date()

        # ✅ 1. Check if monthly suggestion already exists
        existing_record = await account_db.get_finance_suggestion(cursor, user_id, today_user)

        if existing_record:
            return {
                "status": "success",
                "message": "Returned existing monthly suggestion",
                "suggestion": existing_record["suggestion"],
            }

        # ✅ 2. Fetch last 60 days of transactions
        user_transactions = await account_db.get_all_transactions_by_month(cursor, user_id)

        # ✅ 3. Generate AI-based suggestion
        result = await ai_generator.suggestion_generator(user_transactions)
        suggestion_dict = result.dict()

        # ✅ 4. Delete old ones and insert new
        await account_db.delete_all_finance_suggestion(cursor, conn, user_id)
        await account_db.insert_finance_suggestion(cursor, conn, user_id, suggestion_dict, today_user)

        return {
            "status": "success",
            "message": f"Generated new monthly suggestion for {today_user} ({user_tz_name})",
            "suggestion": suggestion_dict,
        }

    except Exception as e:
        print(traceback.format_exc())
        await conn.rollback()
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")