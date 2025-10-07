
from .ai_answer import build_rag_chain_for_groceryItem
import json

import re
import json

def parse_ai_response(ai_text: str):
    """
    Convert AI response like:
      Chinigura Rice Premium = Rice
      Chicken Eggs (Layer) = Eggs
      Milk = no match
    into a Python dictionary.
    """
    mapping = {}
    for line in ai_text.strip().splitlines():
        if "=" in line:
            key, value = line.split("=", 1)
            mapping[key.strip()] = value.strip().strip('"')
    return mapping


# retrieved context maker (can be extended later)
def retrieved_context_maker(top_domains, domains):
    return []


async def ai_answer_generator(query, retrieved_context, conversation_context):
    chain = build_rag_chain_for_groceryItem()

    ai_reply = await chain.ainvoke({
        "question": query,
        "context": retrieved_context,
        "conversation_context": conversation_context
    })
    return ai_reply


async def ai_chat_manager(domains, query):
    """
    domains example:
    [
        {"name": "users_available_grocery_item", "desc": [{'grocery_name': 'Rice', 'available_amount': '5 kg'}, ...]},
        {"name": "new_grocery_item_name", "desc": ['Chinigura Rice Premium', 'Chicken Eggs (Layer)', 'Milk']}
    ]
    """

    available_items = ""
    new_items = ""

    # Format the domain data for AI
    for d in domains:
        if d["name"] == "users_available_grocery_item":
            formatted = [f"{g['grocery_name']} ({g['available_amount']})" for g in d["desc"]]
            available_items = ", ".join(formatted)
        elif d["name"] == "new_grocery_item_name":
            new_items = ", ".join(d["desc"])

    ai_reply = await ai_answer_generator(
        query,
        retrieved_context=available_items,
        conversation_context=new_items
    )

    # Parse the AI output into a usable dictionary
    parsed_output = parse_ai_response(ai_reply)

    return {
        "ai_text": ai_reply,
        "parsed": parsed_output
    }