from pydantic import BaseModel
from typing import List, Dict, Literal

class SkillSuggestion(BaseModel):
    title: str
    description: str
    youtube_course_link: str
    react_icon: str
    color: str

class SkillSuggestions(BaseModel):
    suggestions: List[SkillSuggestion]