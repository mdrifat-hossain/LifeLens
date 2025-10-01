
from .ai_answer import build_rag_chain_for_career
import json

import re
import json

def parse_ai_response(ai_text):
    # 1. Extract path title
    path_title_match = re.search(r"\*\*Learning Path: (.+?)\*\*", ai_text)
    path_title = path_title_match.group(1) if path_title_match else "Unnamed Path"

    # 2. Extract path description
    desc_match = re.search(r"\*Path Description:\* (.+?)\n", ai_text)
    path_description = desc_match.group(1) if desc_match else ""

    # 3. Extract levels
    level_pattern = r"\*   \*\*Level (\d+): (.+?)\*\*\n\s*\*   \*\*Focus:\*\* (.+?)\n\s*\*   \*\*Skills:\*\* (.+?)\n\s*\*   \*\*Duration:\*\* (.+?)\n\s*\*   \*\*Learning Sources:\*\*([\s\S]*?)(?=\*   \*\*Level|\*\*Weekly Routine|\Z)"
    levels = []

    for match in re.finditer(level_pattern, ai_text):
        level_num = int(match.group(1))
        level_title = match.group(2).strip()
        focus = match.group(3).strip()
        skills_text = match.group(4).strip()
        skills = [s.strip() for s in skills_text.split(",")]
        duration = match.group(5).strip()
        sources_text = match.group(6)

        # 🔹 Updated sources parsing to handle both plain text and optional URLs
        source_lines = re.findall(r"\*   (.+)", sources_text)
        sources = []
        for line in source_lines:
            # Check if line contains a URL (simple check)
            if "http" in line:
                parts = re.split(r"\s+(?=https?://)", line, maxsplit=1)
                if len(parts) == 2:
                    sources.append([parts[0].strip(), parts[1].strip()])
                else:
                    sources.append([line.strip(), ""])
            else:
                sources.append([line.strip(), ""])

        levels.append({
            "level_num": level_num,
            "title": level_title,
            "focus": focus,
            "skills": skills,
            "duration": duration,
            "sources": sources,
            "description": f"{focus}. Skills: {', '.join(skills)}"
        })

    # 4. Extract weekly routine
    routine_pattern = r"\*   \*\*(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday):\*\* (\d{2}:\d{2})-(\d{2}:\d{2})"
    routines = []
    for match in re.finditer(routine_pattern, ai_text):
        routines.append({
            "day_of_week": match.group(1),
            "start_time": match.group(2),
            "end_time": match.group(3),
            "description": "Learning session"
        })

    return path_title, path_description, levels, routines


# retrieved context maker
def retrieved_context_maker(top_domains, domains):
    retrieved_context = []
    for td in top_domains:
        for d in domains:
            if d["name"] == td:
                retrieved_context.append({
                    "name": d["name"],
                    "desc": d["desc"]
                })
    # Convert to string
    retrieved_context = "\n\n".join(
        f"{d['name']}:\n{json.dumps(d['desc'], indent=2)}"
        for d in retrieved_context
    )
    return retrieved_context


# Conversation context maker
def conversation_context_maker(message_context):
    conversation_context = "\n".join(
        f"{msg.role}: {msg.content}" for msg in message_context
    )
    return conversation_context

# AI answer generator
async def ai_answer_generator(query, retrieved_context, conversation_context):

    chain = build_rag_chain_for_career()
    ai_reply = await chain.ainvoke({
        "question": query,
        "context": retrieved_context,
        "conversation_context": conversation_context
    })
    return ai_reply

async def ai_chat_manager(domains, query, message_context):
    print("✅ message_context:", message_context)
    conversation_context = conversation_context_maker(message_context)
    print("✅ conversation_context:", conversation_context)
    
    # Get raw AI text
    ai_reply = await ai_answer_generator(query, domains, conversation_context)

    # Parse into structured format
    path_title, path_description, levels, routines = parse_ai_response(ai_reply)

    # 🔹 Return both raw text + structured data
    return {
        "raw_text": ai_reply,
        "path_title": path_title,
        "path_description": path_description,
        "levels": levels,
        "routines": routines
    }
