from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from .schema import FinanceSuggestions
from .prompts import finance_suggestion_prompt
from dotenv import load_dotenv

load_dotenv()

# Initialize Gemini
model = ChatGoogleGenerativeAI(model="gemini-2.0-flash-001")


parser = PydanticOutputParser(pydantic_object=FinanceSuggestions)
prompt_template = ChatPromptTemplate.from_template(finance_suggestion_prompt)
finance_suggestion_chain = prompt_template | model | parser