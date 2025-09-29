from .chain import *

async def email_query_validator(query: str):
    result = await email_validator_chain.ainvoke(
        {
            "user_request": query,
            "format_instructions": email_validator_parser.get_format_instructions(),
        }
    )
    return result


async def generate_email(query: str):
    result = await email_generator_chain.ainvoke(
        {
            "user_request": query,
            "format_instructions": email_parser.get_format_instructions(),
        }
    )
    return result
