from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from .schema import Email, EmailValidator
from .prompts import email_generator_prompt, email_validator_prompt
from dotenv import load_dotenv

load_dotenv()

# Initialize Gemini
model = ChatGoogleGenerativeAI(model="gemini-2.0-flash-001")

# Email validation
email_validator_parser = PydanticOutputParser(pydantic_object=EmailValidator)
email_validator_prompt_temp = ChatPromptTemplate.from_template(email_validator_prompt)
email_validator_chain = email_validator_prompt_temp | model | email_validator_parser

# Email generation
email_parser = PydanticOutputParser(pydantic_object=Email)
email_generator_prompt_temp = ChatPromptTemplate.from_template(email_generator_prompt)
email_generator_chain = email_generator_prompt_temp | model | email_parser
