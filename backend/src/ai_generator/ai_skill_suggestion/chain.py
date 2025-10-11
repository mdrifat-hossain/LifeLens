from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from .schema import SkillSuggestions
from .prompts import career_skill_suggestion_prompt
from dotenv import load_dotenv

load_dotenv()

# Initialize Gemini
model = ChatGoogleGenerativeAI(model="gemini-2.0-flash-001")


parser = PydanticOutputParser(pydantic_object=SkillSuggestions)
prompt_template = ChatPromptTemplate.from_template(career_skill_suggestion_prompt)
skill_suggestion_chain = prompt_template | model | parser