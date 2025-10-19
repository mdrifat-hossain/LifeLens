from .vector_reranker import VectorReranker
from .ai_answer import build_rag_chain
import json

# Rerank domains
def vector_ranker(domains, query):

    vector_ranker = VectorReranker()
    relevant_domains = vector_ranker.rerank(query, domains)

    print(relevant_domains)
    top_domains = relevant_domains[:]
    print("✅ top_domains>> ",top_domains)

    return top_domains

# retrieved context maker
def retrieved_context_maker(top_domains, domains):

    retrieved_context = []
    for td in top_domains:
        for d in domains:
            if d["name"] == td["name"]:
                retrieved_context.append({
                    "name": d["name"],
                    "desc": d["desc"]
                })

    retrieved_context = "\n\n".join(
        # f"{d['name']}:\n{json.dumps(d['desc'], indent=2)}"
        f"{d['name']}:\n{json.dumps(d['desc'], indent=2, default=str)}"
        for d in retrieved_context
    )

    return retrieved_context

# Conversation context maker
def conversation_context_maker(message_context):

    conversation_context = "\n".join(
        f"{msg.sender}: {msg.message_content}" for msg in message_context
    )
    return conversation_context


# AI answer generator
async def ai_answer_generator(query, retrieved_context, conversation_context):

    chain = build_rag_chain()
    ai_reply = await chain.ainvoke({
        "question": query,
        "context": retrieved_context,
        "conversation_context": conversation_context
    })
    return ai_reply

async def ai_chat_manager(domains, query, message_context):
    
    top_domains = vector_ranker(domains=domains, query=query)
    retrieved_context = retrieved_context_maker(top_domains=top_domains, domains=domains)
    conversation_context = conversation_context_maker(message_context=message_context)
    
    ai_reply = await ai_answer_generator(query, retrieved_context, conversation_context)
    return ai_reply