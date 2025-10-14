from fastapi import HTTPException
from datetime import datetime
import json

# ✅ create new account
async def create_account(cursor, conn, user_id, account_name, balance):
    try:
        sql = """
            INSERT INTO accounts (user_id, account_name, balance, created_at)
            VALUES (%s, %s, %s, %s)
        """
        await cursor.execute(sql, (user_id, account_name, balance, datetime.now()))
        account_id = cursor.lastrowid
        await conn.commit()
        return account_id
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in create_account: {e}")


# ✅ get all accounts for a user
async def get_all_accounts(cursor, user_id):
    try:
        sql = """
            SELECT account_id, account_name, balance, created_at
            FROM accounts
            WHERE user_id = %s
            ORDER BY created_at DESC
        """
        await cursor.execute(sql, (user_id,))
        accounts = await cursor.fetchall()
        return accounts
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in get_all_accounts: {e}"
        )


async def get_account_by_id(cursor, user_id: int, account_id: int):
    """
    Fetch a specific account by account_id for the given user
    """
    try:
        sql = """
            SELECT account_id, account_name, balance, created_at
            FROM accounts
            WHERE user_id = %s AND account_id = %s
        """
        await cursor.execute(sql, (user_id, account_id))
        account = await cursor.fetchone()
        return account

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in get_account_by_id: {e}"
        )


async def get_all_account_details(cursor, user_id: str):
    """
    Fetch only the 'All Accounts' summary row for the given user
    """
    try:
        sql = """
            SELECT 
                'all' AS account_id, 
                'All Accounts' AS account_name, 
                SUM(balance) AS balance, 
                NULL AS created_at
            FROM accounts
            WHERE user_id = %s
        """
        await cursor.execute(sql, (user_id,))
        account = await cursor.fetchone()  # single row instead of fetchall()
        return account
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in get_all_account_details: {e}"
        )


# Fetch all transactions for a user
async def get_all_transactions(cursor, user_id):
    try:
        sql = """
            SELECT t.transaction_ID, t.amount, t.type, t.description, t.created_at, t.category_ID, c.category_name,
                   a.account_name, t.account_ID
            FROM transactions t
            JOIN accounts a ON t.account_ID = a.account_ID
            JOIN categories c ON t.category_ID = c.category_id
            WHERE a.user_ID = %s
            ORDER BY t.created_at DESC
        """
        await cursor.execute(sql, (user_id,))
        transactions = await cursor.fetchall()
        return transactions
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in get_all_transactions: {e}"
        )


async def get_transactions_by_account(cursor, user_id, account_id):
    try:
        sql = """
            SELECT t.transaction_ID, t.amount, t.type, t.description, t.created_at, t.category_ID, c.category_name,
                   a.account_name, t.account_ID
            FROM transactions t
            JOIN accounts a ON t.account_ID = a.account_ID
            JOIN categories c ON t.category_ID = c.category_id
            WHERE a.user_id = %s AND t.account_ID = %s
            ORDER BY t.created_at DESC
        """
        await cursor.execute(sql, (user_id, account_id))
        return await cursor.fetchall()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in get_transactions_by_account: {e}"
        )


# Fetch transactions by account
# async def get_transactions_by_account(cursor, user_id, account_id):
#     try:
#         sql = """
#             SELECT t.transaction_ID, t.amount, t.type, t.description, t.created_at,
#                    a.account_name, t.account_ID
#             FROM transactions t
#             JOIN accounts a ON t.account_ID = a.account_ID
#             WHERE a.user_ID = %s AND t.account_ID = %s
#             ORDER BY t.created_at DESC
#         """
#         await cursor.execute(sql, (user_id, account_id))
#         transactions = await cursor.fetchall()
#         return transactions
#     except Exception as e:
#         raise HTTPException(
#             status_code=500, detail=f"DB error in get_transactions_by_account: {e}"
#         )


# Fetch all transactions for a user
async def get_categories(cursor, user_id):
    try:
        sql = """
            SELECT * FROM `categories` WHERE 1
        """
        await cursor.execute(sql)
        categories = await cursor.fetchall()
        return categories
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in get_categories: {e}")


# Create a transaction and update account balance
async def create_transaction(
    cursor, conn, account_ID, amount, type_, description, category_id
):
    try:
        # Insert transaction
        await cursor.execute(
            "INSERT INTO transactions (account_ID, amount, type, description, category_ID) VALUES (%s,%s,%s,%s,%s)",
            (account_ID, amount, type_, description, category_id),
        )
        transaction_ID = cursor.lastrowid

        # Update account balance
        if type_ == "CREDIT":
            await cursor.execute(
                "UPDATE accounts SET balance = balance + %s WHERE account_ID = %s",
                (amount, account_ID),
            )
        else:  # DEBIT
            await cursor.execute(
                "UPDATE accounts SET balance = balance - %s WHERE account_ID = %s",
                (amount, account_ID),
            )

        await conn.commit()
        return transaction_ID

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in create_transaction: {e}"
        )


# Fetch aggregated spending by category
# async def get_spending_by_category(cursor, user_id):
#     try:
#         sql = """
#             SELECT c.category_name, SUM(t.amount) AS total
#             FROM transactions t
#             JOIN accounts a ON t.account_ID = a.account_ID
#             JOIN categories c ON t.category_ID = c.category_ID
#             WHERE a.user_ID = %s AND t.type = 'DEBIT'
#             GROUP BY c.category_name
#             ORDER BY total DESC
#         """
#         await cursor.execute(sql, (user_id,))
#         results = await cursor.fetchall()
#         return results
#     except Exception as e:
#         raise HTTPException(
#             status_code=500, detail=f"DB error in get_spending_by_category: {e}"
#         )

async def get_spending_by_category(cursor, user_id, start_date=None, end_date=None):
    try:
        base_sql = """
            SELECT c.category_name, SUM(t.amount) AS total
            FROM transactions t
            JOIN accounts a ON t.account_ID = a.account_ID
            JOIN categories c ON t.category_ID = c.category_ID
            WHERE a.user_ID = %s AND t.type = 'DEBIT'
        """
        params = [user_id]

        # ✅ Use created_at instead of date
        if start_date:
            base_sql += " AND t.created_at >= %s"
            params.append(start_date)
        if end_date:
            base_sql += " AND t.created_at <= %s"
            params.append(end_date)

        base_sql += " GROUP BY c.category_name ORDER BY total DESC"

        await cursor.execute(base_sql, tuple(params))
        results = await cursor.fetchall()
        return results

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in get_spending_by_category: {e}")



# Get all budgets for a user with actual spending
async def get_user_budgets(cursor, user_id):
    try:
        sql = """
            SELECT b.budget_id, b.category_id, c.category_name, b.limit_amount,
                   COALESCE(SUM(t.amount), 0) AS spent
            FROM budgets b
            JOIN categories c ON b.category_id = c.category_id
            LEFT JOIN transactions t ON t.category_ID = b.category_id
                AND t.type = 'DEBIT'
                AND t.account_ID IN (SELECT account_id FROM accounts WHERE user_id = %s)
            WHERE b.user_id = %s
            GROUP BY b.budget_id, b.category_id, c.category_name, b.limit_amount
            ORDER BY c.category_name
        """
        await cursor.execute(sql, (user_id, user_id))
        return await cursor.fetchall()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in get_user_budgets: {e}"
        )


# Insert or update a budget
async def upsert_budget(cursor, user_id, category_id, limit_amount):
    print("Upserting budget:", user_id, category_id, limit_amount)
    try:
        sql = """
        INSERT INTO budgets (user_id, category_id, limit_amount)
        VALUES (%s, %s, %s)
        ON DUPLICATE KEY UPDATE limit_amount = VALUES(limit_amount)
        """
        await cursor.execute(sql, (user_id, category_id, limit_amount))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in upsert_budget: {e}")


# account_db.py
async def ensure_user_exists(cursor, conn, user_id: str, full_name: str = "Unknown", email: str = "unknown@example.com"):
    """
    Check if the user exists in the user table.
    If not, insert a new user.
    """
    try:
        # Check if user exists
        await cursor.execute("SELECT user_ID FROM user WHERE user_ID = %s", (user_id,))
        user_exists = await cursor.fetchone()

        if not user_exists:
            # Insert new user
            insert_sql = """
                INSERT INTO user (user_id)
                VALUES (%s)
            """
            await cursor.execute(insert_sql, (user_id))
            await conn.commit()
            print(f"✅ New user added: {user_id}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in ensure_user_exists: {e}")


async def get_total_balance(cursor, user_id):
    try:
        sql = """
            SELECT COALESCE(SUM(balance),0) AS total_balance FROM accounts WHERE user_id = %s
        """
        await cursor.execute(sql, (user_id,))
        row = await cursor.fetchone()
        print("Total balance row:", row)
        value = row["total_balance"] if row and row["total_balance"] is not None else 0
        return float(value)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in get_total_balance: {e}"
        )

    # await cursor.execute(
    #     "SELECT COALESCE(SUM(balance),0) FROM accounts WHERE user_id = %s",
    #     (user_id,)
    # )
    # return (await cursor.fetchone())[0]


async def get_monthly_income(cursor, user_id: str):
    try:
        sql = """
            SELECT COALESCE(SUM(amount),0) AS monthly_income FROM transactions
            WHERE type='CREDIT'
              AND account_ID IN (SELECT account_ID FROM accounts WHERE user_id = %s)
              AND MONTH(created_at) = MONTH(CURRENT_DATE())
              AND YEAR(created_at) = YEAR(CURRENT_DATE())
        """
        await cursor.execute(sql, (user_id,))
        row = await cursor.fetchone()
        value = (
            row["monthly_income"] if row and row["monthly_income"] is not None else 0
        )
        return float(value)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in get_monthly_income: {e}"
        )

    # await cursor.execute("""
    #     SELECT COALESCE(SUM(amount),0) FROM transactions
    #     WHERE type='CREDIT'
    #       AND account_ID IN (SELECT account_ID FROM accounts WHERE user_id = %s)
    #       AND MONTH(created_at) = MONTH(CURRENT_DATE())
    #       AND YEAR(created_at) = YEAR(CURRENT_DATE())
    # """, (user_id,))
    # return (await cursor.fetchone())[0]


async def get_monthly_expenses(cursor, user_id: str):
    try:
        sql = """
            SELECT COALESCE(SUM(amount),0) AS monthly_expenses FROM transactions
            WHERE type='DEBIT'
              AND account_ID IN (SELECT account_ID FROM accounts WHERE user_id = %s)
              AND MONTH(created_at) = MONTH(CURRENT_DATE())
              AND YEAR(created_at) = YEAR(CURRENT_DATE())
        """
        await cursor.execute(sql, (user_id,))
        row = await cursor.fetchone()
        value = (
            row["monthly_expenses"]
            if row and row["monthly_expenses"] is not None
            else 0
        )
        return float(value)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in get_monthly_expenses: {e}"
        )


async def fetch_transactions(cursor, user_id: str, account_id: int = None):
    try:
        sql = """
            SELECT t.transaction_ID, t.amount, t.type, t.description, t.created_at,
                   c.category_name, t.category_ID
            FROM transactions t
            LEFT JOIN categories c ON t.category_ID = c.category_id
            WHERE t.account_ID IN (SELECT account_ID FROM accounts WHERE user_id = %s)
        """
        params = [user_id]
        if account_id:
            sql += " AND t.account_ID = %s"
            params.append(account_id)
        sql += " ORDER BY t.created_at DESC"

        await cursor.execute(sql, tuple(params))
        return await cursor.fetchall()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in fetch_transactions: {e}"
        )


async def update_transaction_db(cursor, conn, transaction_id: int, data: dict):
    try:
        await cursor.execute(
            """
            UPDATE transactions SET amount=%s, type=%s, description=%s, category_ID=%s
            WHERE transaction_ID=%s
        """,
            (
                data["amount"],
                data["type"],
                data["description"],
                data["category_ID"],
                transaction_id,
            ),
        )
        await conn.commit()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in update_transaction_db: {e}"
        )


async def delete_transaction_db(
    cursor, conn, transaction_id: int, account_ID: int, user_id: str
):
    try:
        # 1. Get transaction details by account_ID
        await cursor.execute(
            "SELECT amount, type FROM transactions WHERE transaction_ID=%s AND account_ID=%s",
            (transaction_id, account_ID),
        )
        transaction = await cursor.fetchone()

        if not transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")

        amount, txn_type = transaction["amount"], transaction["type"]

        # 2. Adjust account balance
        if txn_type == "DEBIT":
            await cursor.execute(
                "UPDATE accounts SET balance = balance + %s WHERE account_ID=%s AND user_id=%s",
                (amount, account_ID, user_id),
            )
        elif txn_type == "CREDIT":
            await cursor.execute(
                "UPDATE accounts SET balance = balance - %s WHERE account_ID=%s AND user_id=%s",
                (amount, account_ID, user_id),
            )

        # 3. Delete transaction
        await cursor.execute(
            "DELETE FROM transactions WHERE transaction_ID=%s AND account_ID=%s",
            (transaction_id, account_ID),
        )

        # 4. Commit
        await conn.commit()

    except Exception as e:
        await conn.rollback()
        raise HTTPException(
            status_code=500, detail=f"DB error in delete_transaction_db: {e}"
        )


async def get_transactions(cursor, user_id: int, account_id: int = None):
    try:
        sql = """
            SELECT t.transaction_ID, t.amount, t.type, t.description, t.created_at,
                   c.category_name, t.category_ID
            FROM transactions t
            LEFT JOIN categories c ON t.category_ID = c.category_id
            WHERE t.account_ID IN (SELECT account_ID FROM accounts WHERE user_id = %s)
        """
        params = [user_id]
        if account_id:
            sql += " AND t.account_ID = %s"
            params.append(account_id)
        sql += " ORDER BY t.created_at DESC"

        await cursor.execute(sql, tuple(params))
        return await cursor.fetchall()

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in get_transactions: {e}"
        )


async def update_transaction(
    cursor, conn, user_id: int, transaction_id: int, data: dict
):
    try:
        # Check transaction ownership
        await cursor.execute(
            "SELECT account_ID FROM transactions WHERE transaction_ID=%s",
            (transaction_id,),
        )
        txn = await cursor.fetchone()
        if not txn:
            raise HTTPException(status_code=404, detail="Transaction not found")

        account_id = txn["account_ID"]
        await cursor.execute(
            "SELECT user_id FROM accounts WHERE account_ID=%s", (account_id,)
        )
        account = await cursor.fetchone()
        if account["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized")

        # Update transaction
        await cursor.execute(
            """
            UPDATE transactions SET amount=%s, type=%s, description=%s, category_ID=%s
            WHERE transaction_ID=%s
        """,
            (
                data["amount"],
                data["type"],
                data["description"],
                data["category_ID"],
                transaction_id,
            ),
        )
        await conn.commit()
        return {"message": "Transaction updated successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in update_transaction: {e}"
        )


async def delete_transaction(cursor, conn, user_id: int, transaction_id: int):
    try:
        await cursor.execute(
            "SELECT account_ID FROM transactions WHERE transaction_ID=%s",
            (transaction_id,),
        )
        txn = await cursor.fetchone()
        if not txn:
            raise HTTPException(status_code=404, detail="Transaction not found")

        account_id = txn["account_ID"]
        await cursor.execute(
            "SELECT user_id FROM accounts WHERE account_ID=%s", (account_id,)
        )
        account = await cursor.fetchone()
        if account["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized")

        await cursor.execute(
            "DELETE FROM transactions WHERE transaction_ID=%s", (transaction_id,)
        )
        await conn.commit()
        return {"message": "Transaction deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in delete_transaction: {e}"
        )


# ✅ Fetch last 60 days of transactions
async def get_all_transactions_by_month(cursor, user_id):
    try:
        sql = """
            SELECT 
                t.amount, 
                t.type, 
                t.description, 
                t.created_at, 
                c.category_name
            FROM transactions t
            JOIN accounts a ON t.account_ID = a.account_ID
            JOIN categories c ON t.category_ID = c.category_id
            WHERE a.user_ID = %s
            AND t.created_at >= DATE_SUB(NOW(), INTERVAL 60 DAY)
            ORDER BY t.created_at DESC;
        """
        await cursor.execute(sql, (user_id,))
        rows = await cursor.fetchall()

        transactions = []
        for row in rows:
            transactions.append({
                "transaction_amount": row["amount"],
                "transaction_type": row["type"],
                "description": row["description"],
                "date": row["created_at"].isoformat() if row["created_at"] else None,
                "transaction_category": row["category_name"]
            })

        return transactions

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in get_all_transactions_by_month: {e}")


# ✅ Delete all old finance suggestions for the user
async def delete_all_finance_suggestion(cursor, conn, user_id: str):
    try:
        await cursor.execute(
            "DELETE FROM finance_suggestion WHERE user_id = %s", (user_id,)
        )
        await conn.commit()
        return {"deleted": cursor.rowcount}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ✅ Insert a new finance suggestion
async def insert_finance_suggestion(cursor, conn, user_id: str, suggestion: dict, generated_date):
    try:
        suggestion_json = json.dumps(suggestion)
        await cursor.execute(
            """
            INSERT INTO finance_suggestion (user_id, suggestion, generated_date)
            VALUES (%s, %s, %s)
            """,
            (user_id, suggestion_json, generated_date),
        )
        await conn.commit()
        return {"id": cursor.lastrowid}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ✅ Retrieve suggestion for the current month
async def get_finance_suggestion(cursor, user_id: str, today_user):
    first_of_month = today_user.replace(day=1)
    await cursor.execute(
        """
        SELECT suggestion
        FROM finance_suggestion
        WHERE user_id = %s
        AND generated_date >= %s
        """,
        (user_id, first_of_month),
    )
    return await cursor.fetchone()