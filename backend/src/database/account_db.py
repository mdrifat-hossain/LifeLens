from fastapi import HTTPException
from datetime import datetime

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
        raise HTTPException(status_code=500, detail=f"DB error in get_all_accounts: {e}")


from fastapi import HTTPException

# Fetch all transactions for a user
async def get_all_transactions(cursor, user_id):
    try:
        sql = """
            SELECT t.transaction_ID, t.amount, t.type, t.description, t.created_at,
                   a.account_name, t.account_ID
            FROM transactions t
            JOIN accounts a ON t.account_ID = a.account_ID
            WHERE a.user_ID = %s
            ORDER BY t.created_at DESC
        """
        await cursor.execute(sql, (user_id,))
        transactions = await cursor.fetchall()
        return transactions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in get_all_transactions: {e}")


# Create a transaction and update account balance
async def create_transaction(cursor, conn, account_ID, amount, type_, description):
    try:
        # Insert transaction
        await cursor.execute(
            "INSERT INTO transactions (account_ID, amount, type, description) VALUES (%s,%s,%s,%s)",
            (account_ID, amount, type_, description)
        )
        transaction_ID = cursor.lastrowid

        # Update account balance
        if type_ == "CREDIT":
            await cursor.execute(
                "UPDATE accounts SET balance = balance + %s WHERE account_ID = %s",
                (amount, account_ID)
            )
        else:  # DEBIT
            await cursor.execute(
                "UPDATE accounts SET balance = balance - %s WHERE account_ID = %s",
                (amount, account_ID)
            )

        await conn.commit()
        return transaction_ID

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in create_transaction: {e}")
