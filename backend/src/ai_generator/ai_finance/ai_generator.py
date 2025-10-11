from .chain import *

async def suggestion_generator(user_records):

    result = await finance_suggestion_chain.ainvoke(
        {
            "user_transactions": user_records,
            "format_instructions": parser.get_format_instructions(),
        }
    )

    return result