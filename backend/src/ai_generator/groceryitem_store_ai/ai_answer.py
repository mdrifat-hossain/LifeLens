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

    Your task:
    - Identify which existing grocery item each new grocery refers to (or choose a generic grocery word like "Rice", "Flour", "Oil", "Eggs", etc.).
    - Accurately extract **unit quantity** (e.g., 1, 2, 500) and **unit type** (e.g., kg, g, L, ml, pcs) from each item's text.
    - If there is no clear unit, assume `1 unit`.
    - Do not guess randomly — infer from item text like "1kg", "2 kg", "500ml", "5 pcs", etc.
    - Return the result in **exactly this format**:

    <new_item_name> = <matched_or_generic_name> | unit_quantity=<number> | unit_unit=<unit>

    ---

    ### Example

    Available groceries:
    Rice, Oil, Atta, Milk

    New grocery items:
    Aci Nutrilife High Fibre Atta 2kg  
    Fresh Milk 1 Litre  
    Fortune Rice Bran Oil - 5 L  
    Loose Onion 500g

    Your output:
    Aci Nutrilife High Fibre Atta 2kg = Atta | unit_quantity=2 | unit_unit=kg  
    Fresh Milk 1 Litre = Milk | unit_quantity=1 | unit_unit=L  
    Fortune Rice Bran Oil - 5 L = Oil | unit_quantity=5 | unit_unit=L  
    Loose Onion 500g = Vegetable | unit_quantity=500 | unit_unit=g

    ---

    Available groceries:
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