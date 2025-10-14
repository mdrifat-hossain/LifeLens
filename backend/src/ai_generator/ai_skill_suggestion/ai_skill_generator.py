from .chain import *

async def suggestion_generator(user_records):

    result = await skill_suggestion_chain.ainvoke(
        {
            "user_info": user_records,
            "format_instructions": parser.get_format_instructions(),
        }
    )

    return result


async def project_idea_query_validator(query):

    result = await project_validator_chain.ainvoke(
        {
            "format_instructions": project_validator_parser.get_format_instructions(),
            "user_request": query
        }
    )

    return result


async def project_idea_generator(query):

    result = await project_generation_chain.ainvoke(
        {
            "format_instructions": project_validator_parser.get_format_instructions(),
            "user_request": query
        }
    )

    return result