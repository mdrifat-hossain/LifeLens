from pydantic import BaseModel
from typing import List, Dict, Literal

class Ingredient(BaseModel):
    name: str
    amount_used: str
    remaining: str  

class Meal(BaseModel):
    name: str
    ingredients_used: List[Ingredient]  # changed from Dict
    steps: List[str]                     # ordered cooking steps
    nutrition: Dict[str, str]            # {"calories": "300", "protein": "10g", ...}

class DayPlan(BaseModel):
    breakfast: Meal
    lunch: Meal
    dinner: Meal

class WeeklyMealPlan(BaseModel):
    user_id: str
    meal_plan: Dict[str, DayPlan]  # {"Day 1": {...}, "Day 2": {...}}


class MealChangeValidator(BaseModel):
    status: Literal["valid", "invalid"]
    reason: str

class OneTimeMeal(BaseModel):
    day: str
    meal_type: str
    name: str
    ingredients_used: List[Ingredient] 
    nutrition: Dict[str, str] 
    recipe: List[str] 

class Alert(BaseModel):
    title: str
    issue: str
    action: str
    risk_color: Literal["red", "orange", "yellow", "green"]


class HealthAlerts(BaseModel):
    alerts: List[Alert]

class GroceryProductValidator(BaseModel):
    status: Literal["valid", "invalid"]
    reason: str

class GroceryList(BaseModel):
    items: List[str]