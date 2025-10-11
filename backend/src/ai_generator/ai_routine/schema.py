from pydantic import BaseModel
from typing import List, Dict, Literal

class TimeSuggestion(BaseModel):
    title: str
    description: str
    react_icon: str

class FreeTimeSuggestions(BaseModel):
    suggestions: List[TimeSuggestion]