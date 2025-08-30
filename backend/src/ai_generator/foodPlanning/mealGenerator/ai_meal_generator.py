from .chain import *
from .info_pre_processing_for_llm import InfoPreProcessing


async def all_meal_generator(user_records, available_groceries_of_user):
    pre = InfoPreProcessing()
    user_info_json = pre.format_user_records_for_llm_json(user_records)
    groceries_json = pre.format_groceries_for_llm_json(available_groceries_of_user)

    result = await meal_plan_chain.ainvoke(
        {
            "user_info": user_info_json,
            "available_groceries": groceries_json,
            "format_instructions": parser.get_format_instructions(),
        }
    )

    print("Meal generation completed!")

    return result.dict()



async def change_meal_plan_query_validator(query):

    result = await meal_change_validator_chain.ainvoke(
        {
            "user_request": query,
            "format_instructions": meal_change_validator_parser.get_format_instructions(),
        }
    )

    return result


async def change_meal_plan(user_records, available_groceries_of_user, query):

    pre = InfoPreProcessing()
    user_info_json = pre.format_user_records_for_llm_json(user_records)
    groceries_json = pre.format_groceries_for_llm_json(available_groceries_of_user)

    result = await meal_change_chain.ainvoke(
        {
            "user_info": user_info_json,
            "available_groceries": groceries_json,
            "user_request": query,
            "format_instructions": meal_change_parser.get_format_instructions(),
        }
    )

    return result


async def health_habit_alert(user_records):
    pre = InfoPreProcessing()
    user_info_json = pre.format_user_records_for_llm_json(user_records)

    result = await health_alert_chain.ainvoke(
        {
            "user_info": user_info_json,
            "format_instructions": health_alert_parser.get_format_instructions(),
        }
    )

    return result


async def grocery_product_validation(query):

    result = await grocery_product_validator_chain.ainvoke(
        {
            "user_request": query,
            "format_instructions": grocery_product_validator_parser.get_format_instructions(),
        }
    )

    return result


async def grocery_product_generation(query):

    result = await grocery_product_generator_chain.ainvoke(
        {
            "user_request": query,
            "format_instructions": grocery_product_parser.get_format_instructions(),
        }
    )

    return result
