from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from .schema import CareerInsights
from .prompts import career_insights_prompt

from dotenv import load_dotenv

load_dotenv()

model = ChatGoogleGenerativeAI(model="gemini-2.0-flash-001")

parser = PydanticOutputParser(pydantic_object=CareerInsights)
prompt_template = ChatPromptTemplate.from_template(career_insights_prompt)
career_chain = prompt_template | model | parser

async def generate_career_insights(user_info):
    result = await career_chain.ainvoke(
        {
            "user_info": user_info,
            "format_instructions": parser.get_format_instructions(),
        }
    )
    print("Career insights generated!")
    return result.dict()
