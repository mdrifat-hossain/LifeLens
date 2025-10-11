from .chain import *

async def suggestion_generator(user_records):

    result = await skill_suggestion_chain.ainvoke(
        {
            "user_info": user_records,
            "format_instructions": parser.get_format_instructions(),
        }
    )

    return result