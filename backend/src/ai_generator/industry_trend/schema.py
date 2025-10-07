from pydantic import BaseModel
from typing import List, Dict

class SalaryDataset(BaseModel):
    label: str
    data: List[int]

class SalaryData(BaseModel):
    labels: List[str]
    datasets: List[SalaryDataset]

class SeasonalDataset(BaseModel):
    label: str
    data: List[int]

class SeasonalHiringTrends(BaseModel):
    labels: List[str]
    datasets: List[SeasonalDataset]

class EmergingTrend(BaseModel):
    name: str
    description: str
    time_to_maturity: str
    growth: str
    confidence: str

class FutureProofSkill(BaseModel):
    category: str
    skill: str
    growth: str

class DecliningSkill(BaseModel):
    skill: str
    decline: str
    alternatives: List[str]

class CompanyHiringTrend(BaseModel):
    company: str
    hiring_rate: str  # e.g. "+18%"

class CareerInfo(BaseModel):
    industry_growth: str
    demand_level: str
    top_skills: List[str]
    salary_data: SalaryData
    company_hiring_trends: List[CompanyHiringTrend]   # <-- changed here
    seasonal_hiring_trends: SeasonalHiringTrends
    emerging_trends: List[EmergingTrend]
    future_proof_skills: List[FutureProofSkill]
    declining_skills: List[DecliningSkill]


class CareerInsights(BaseModel):
    career_insights: Dict[str, CareerInfo]  # e.g. {"Software Engineer": {...}, "Cybersecurity Specialist": {...}}
