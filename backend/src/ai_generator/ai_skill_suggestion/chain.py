from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from .schema import SkillSuggestions, ProjectIdeaValidator, ProjectGeneration
from .prompts import career_skill_suggestion_prompt, project_idea_validator_prompt, project_idea_generator_prompt
from dotenv import load_dotenv

load_dotenv()

# Initialize Gemini
model = ChatGoogleGenerativeAI(model="gemini-2.0-flash-001")


parser = PydanticOutputParser(pydantic_object=SkillSuggestions)
prompt_template = ChatPromptTemplate.from_template(career_skill_suggestion_prompt)
skill_suggestion_chain = prompt_template | model | parser


project_validator_parser = PydanticOutputParser(pydantic_object=ProjectIdeaValidator)
project_validator_prompt_temp = ChatPromptTemplate.from_template(project_idea_validator_prompt)
project_validator_chain = project_validator_prompt_temp | model | project_validator_parser


project_generation_parser = PydanticOutputParser(pydantic_object=ProjectGeneration)
project_generation_prompt_template = ChatPromptTemplate.from_template(project_idea_generator_prompt)
project_generation_chain = project_generation_prompt_template | model | project_generation_parser