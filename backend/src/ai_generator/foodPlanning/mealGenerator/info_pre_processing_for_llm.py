import json

class InfoPreProcessing:

    def format_groceries_for_llm_json(self, grocery_list: list) -> str:
        if not grocery_list:
            return json.dumps({"message": "No groceries found for this user"}, indent=2)

        user_id = grocery_list[0]['user_id']
        formatted = {
            "user_id": user_id,
            "groceries": [
                {
                    "name": item['grocery_name'],
                    "amount": item['available_amount'],
                }
                for item in grocery_list
            ]
        }
        return json.dumps(formatted, indent=2)
    
    
    def format_groceries_for_llm_text(self, grocery_list: list) -> str:
        if not grocery_list:
            return "No groceries found for this user."

        user_id = grocery_list[0]['user_id']
        formatted = [f"User ID: {user_id}\n\nAvailable Groceries:"]
        
        for idx, item in enumerate(grocery_list, start=1):
            line = f"{idx}. {item['grocery_name']} — {item['available_amount']} (Category: {item['category']})"
            formatted.append(line)

        return "\n".join(formatted)
    

    def format_user_records_for_llm_json(self, user_records: list) -> str:
        if not user_records:
            return json.dumps({"message": "No user records found"}, indent=2)

        record = user_records[0]  # assuming only one record per user_id

        formatted = {
            "user_id": record["user_id"],
            "profile": {
                "age": record["age"],
                "gender": record["gender"],
                "height_cm": record["height"],
                "weight_kg": record["weight"],
                "activity_level": record["activity_level"],
                "dietary_pattern": record["dietary_pattern"],
                "specific_diets": record["specific_diets"],
                "medical_conditions": record["medical_conditions"],
                "food_allergies": record["food_allergies"]
            },
            "nutrition": {
                "meal_plan": record["meal_plan"],
                "meals_per_day": record["meals_per_day"],
                "snacks_per_day": record["snacks_per_day"],
                "cuisines_preference": record["cuisines"],
                "water_intake_liters": record["water_intake"],
                "caffeine_consumption": record["caffeine_consumption"],
                "breakfast_time": record["breakfast_time"]
            },
            "lifestyle": {
                "sleep_duration_hours": record["sleep_duration"],
                "exercises": record["exercises"]
            }
        }

        return json.dumps(formatted, indent=2)
