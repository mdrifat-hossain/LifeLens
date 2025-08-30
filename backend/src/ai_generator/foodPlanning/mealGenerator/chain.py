from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from .schema import WeeklyMealPlan, MealChangeValidator, OneTimeMeal, HealthAlerts, GroceryProductValidator, GroceryList
from .prompts import all_meal_generator_prompt, meal_change_validator_prompt, meal_change_generator_prompt, health_habit_alerts_prompt, grocery_product_validator_prompt, grocery_product_generator_prompt
from dotenv import load_dotenv

load_dotenv()

# Initialize Gemini
model = ChatGoogleGenerativeAI(model="gemini-2.0-flash-001")


parser = PydanticOutputParser(pydantic_object=WeeklyMealPlan)
prompt_template = ChatPromptTemplate.from_template(all_meal_generator_prompt)
meal_plan_chain = prompt_template | model | parser


### Changing Meal validation
meal_change_validator_parser = PydanticOutputParser(pydantic_object=MealChangeValidator)
meal_change_validator_prompt_temp = ChatPromptTemplate.from_template(meal_change_validator_prompt)
meal_change_validator_chain = meal_change_validator_prompt_temp | model | meal_change_validator_parser


### Changing Meal
meal_change_parser = PydanticOutputParser(pydantic_object=OneTimeMeal)
meal_change_prompt_temp = ChatPromptTemplate.from_template(meal_change_generator_prompt)
meal_change_chain = meal_change_prompt_temp | model | meal_change_parser


### Health Alerts
health_alert_parser = PydanticOutputParser(pydantic_object=HealthAlerts)
health_alert_prompt = ChatPromptTemplate.from_template(health_habit_alerts_prompt)
health_alert_chain = health_alert_prompt | model | health_alert_parser


### Grocery product validation
grocery_product_validator_parser = PydanticOutputParser(pydantic_object=GroceryProductValidator)
grocery_product_validator_prompt_temp = ChatPromptTemplate.from_template(grocery_product_validator_prompt)
grocery_product_validator_chain = grocery_product_validator_prompt_temp | model | grocery_product_validator_parser


### Grocery PRoduct Generator
grocery_product_parser = PydanticOutputParser(pydantic_object=GroceryList)
grocery_product_generator_prompt = ChatPromptTemplate.from_template(grocery_product_generator_prompt)
grocery_product_generator_chain = grocery_product_generator_prompt | model | grocery_product_parser