from fastapi import HTTPException
import json
from datetime import datetime, date, timedelta
from .redis_db.redis_cache_clear import clear_user_cache
from .redis_db import redis_db_services
from ..database import routine_db


# Insert new report
async def create_report(cursor, conn, user_id, subject, section, description):
    try:
        print("✅Db>>>",subject,section, description)
        sql = """
            INSERT INTO report (user_id, subject, section, description)
            VALUES (%s, %s, %s, %s)
        """
        await cursor.execute(sql, (user_id, subject, section, description))
        report_id = cursor.lastrowid
        await conn.commit()
        return report_id
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in create_report: {e}")

# Insert admin reply
async def add_admin_reply(cursor, conn, report_id, admin_id, reply_text):
    try:
        sql = """
            INSERT INTO report_reply (report_id, admin_id, reply_text)
            VALUES (%s, %s, %s)
        """
        await cursor.execute(sql, (report_id, admin_id, reply_text))
        reply_id = cursor.lastrowid
        await conn.commit()
        return reply_id
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in add_admin_reply: {e}")

# Fetch reports with replies
async def get_user_reports(cursor, user_id):
    try:
        sql = """
            SELECT r.report_id, r.subject, r.section, r.description, r.status, r.submitted_at,
                   rr.reply_id, rr.admin_id, rr.reply_text, rr.replied_at
            FROM report r
            LEFT JOIN report_reply rr ON r.report_id = rr.report_id
            WHERE r.user_id = %s
            ORDER BY r.submitted_at DESC, rr.replied_at ASC
        """
        await cursor.execute(sql, (user_id,))
        result = await cursor.fetchall()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in get_user_reports: {e}")
    
async def delete_report(cursor, conn, report_id: int, user_id: int):
    try:
        # Delete the report (replies will auto-delete if you set ON DELETE CASCADE on report_reply)
        sql = "DELETE FROM report WHERE report_id = %s AND user_id = %s"
        await cursor.execute(sql, (report_id, user_id))
        await conn.commit()
        return cursor.rowcount > 0  # True if deleted, False if not found
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in delete_report: {e}")
