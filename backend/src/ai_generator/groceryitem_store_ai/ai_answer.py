# ai_answer.py
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from dotenv import load_dotenv

load_dotenv()



def build_rag_chain_for_groceryItem():
    """
    Build a reasoning chain for comparing new grocery items
    with available groceries in the user's database.
    """

    prompt = PromptTemplate(
        input_variables=["question", "context", "conversation_context"],
        template="""
    You are an AI grocery assistant. 
    Compare the **new grocery items** with the **available grocery items** in the user's database.

    For each new grocery item:
    - If it clearly refers to or matches an existing grocery name (even partially), 
      return that match (e.g., "Chinigura Rice Premium" ≈ "Rice").
    - If it doesn't match any existing grocery item, 
      guess a **generic one-word grocery type** (e.g., "Atta", "Yeast", "Oil", "Salt", "Sugar", "Cheese", "Meat", "Sauce", "Spice", "Vegetable", etc.)
      that best describes the product.
    - Do NOT return "no match".
    - If you're uncertain, choose the closest possible grocery-related word.

    Use the following exact format (no extra text):
    <new_item_name> = <matched_item_name OR generic_one_word_guess>

    ---

    Available groceries (with amount info):
    {context}

    New grocery items:
    {conversation_context}

    User query:
    {question}
    """
    )


    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-001")
    output_parser = StrOutputParser()
    chain = prompt | llm | output_parser

    return chain