from pydantic import BaseModel
from typing import List, Dict, Literal

class FinanceSuggestion(BaseModel):
    title: str
    description: str
    react_icon: str
    color: str

class FinanceSuggestions(BaseModel):
    suggestions: List[FinanceSuggestion]