from fastapi import HTTPException, status
from datetime import datetime, timedelta
from ..database import user_db

async def apply_rate_limit(user_id: str, cursor, conn):

    account_type = await user_db.get_user_account_type(cursor, user_id)
    if account_type == "premium":
        return  # unlimited requests

    # Check requests in the last hour
    one_hour_ago = datetime.utcnow() - timedelta(hours=1)
    count = await user_db.count_user_request_log(cursor, user_id, one_hour_ago)

    if count >= 3:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Basic users are limited to 3 requests per hour."
        )

    # Log new request
    time = datetime.utcnow()
    await user_db.insert_user_request_log(cursor, conn, user_id, time)

