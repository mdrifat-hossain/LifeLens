career_insights_prompt = """
You are a career-focused AI system.
Your task is to generate detailed industry and role insights for the given user.
For each career field the user is interested in, generate a full structured dataset with the following:

1. Industry Growth (percentage growth, e.g., +23%)
2. Demand Level (High, Medium, Low)
3. Top Skills (list of key skills relevant now)
4. Salary Insights (entry, mid, senior, lead; min, median, max values in $k/year)
5. Company Hiring Trends (short description + rough %% hiring rate)
6. Seasonal Hiring Trends (quarterly hiring numbers, Q1–Q4)
7. Emerging Trends & Future Skills (3–5 new trends, each with maturity, growth %% and confidence level)
8. Future-proof Skills (skills that will be valuable in 3–5 years with projected growth)
9. Declining Skills (skills losing demand, with %% decline and alternatives)

Rules:
- Always generate data relevant to the specific industry/role.
- Keep the numbers realistic but varied.
- Return only raw JSON, no explanations.

User Information:
{user_info}

{format_instructions}

JSON Schema:
{{
  "career_insights": {{
    "Software Engineer": {{
      "industry_growth": "+23%",
      "demand_level": "High",
      "top_skills": ["React", "Python", "AWS"],
      "salary_data": {{
        "labels": ["Entry Level", "Mid Level", "Senior Level", "Lead Level"],
        "datasets": [
          {{
            "label": "Minimum",
            "data": [70, 90, 115, 175]
          }},
          {{
            "label": "Median",
            "data": [85, 115, 150, 220]
          }},
          {{
            "label": "Maximum",
            "data": [100, 140, 190, 290]
          }}
        ]
      }},
      "company_hiring_trends": [
            {{
                "company": "Google",
                "hiring_rate": "+18%"
            }},
            {{
                "company": "Microsoft",
                "hiring_rate": "+12%"
            }},
            {{
                "company": "Amazon",
                "hiring_rate": "-15%"
            }}
        ],
      "seasonal_hiring_trends": {{
        "labels": ["Q1", "Q2", "Q3", "Q4"],
        "datasets": [
          {{
            "label": "Software Engineering",
            "data": [500, 700, 650, 550]
          }}
        ]
      }},
      "emerging_trends": [
        {{
          "name": "AI-assisted coding",
          "description": "Widespread adoption of code copilots",
          "time_to_maturity": "1-2 years",
          "growth": "+67%",
          "confidence": "High"
        }},
        {{
          "name": "Low-code/No-code platforms",
          "description": "Simplified development platforms",
          "time_to_maturity": "2-3 years",
          "growth": "+45%",
          "confidence": "Medium"
        }}
      ],
      "future_proof_skills": [
        {{
          "category": "AI/ML",
          "skill": "LangChain",
          "growth": "+45%"
        }},
        {{
          "category": "Cloud",
          "skill": "Serverless Architecture",
          "growth": "+38%"
        }}
      ],
      "declining_skills": [
        {{
          "skill": "jQuery",
          "decline": "-35%",
          "alternatives": ["React", "Vue.js"]
        }},
        {{
          "skill": "Flash",
          "decline": "-88%",
          "alternatives": ["HTML5", "WebAssembly"]
        }}
      ]
    }},
    "Machine Learning Engineer": {{ ... }},
    "Cybersecurity Specialist": {{ ... }}
  }}
}}
"""
