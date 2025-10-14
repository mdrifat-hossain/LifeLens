from pydantic import BaseModel
from typing import List, Literal, Union

class SkillSuggestion(BaseModel):
    title: str
    description: str
    youtube_course_link: str
    react_icon: str
    color: str

class SkillSuggestions(BaseModel):
    suggestions: List[SkillSuggestion]

class ProjectIdeaValidator(BaseModel):
    status: Literal["valid", "invalid"]
    reason: str

class ProjectGeneration(BaseModel):
    project_name: str
    sector: str
    short_description: str
    requirements: List
    duration: str
    complexity: Union[str, int]
    why_this_project: str
    tags: List