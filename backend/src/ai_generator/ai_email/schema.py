from pydantic import BaseModel
from typing import List, Dict, Literal

class EmailValidator(BaseModel):
    status: Literal["valid", "invalid"]
    reason: str

class Email(BaseModel):
    to_email: str
    subject: str
    body: str
