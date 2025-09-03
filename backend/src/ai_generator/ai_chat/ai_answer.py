# ai_answer.py
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from dotenv import load_dotenv

load_dotenv()



def build_rag_chain():
    """
    Modern LangChain approach using RunnableSequence (prompt | llm | parser)
    """
    prompt = PromptTemplate(
        input_variables=["question", "context", "conversation_context"],
        template="""
            You are a helpful AI assistant. 
            Answer the user's question using the provided context and conversation history.

            Guidelines:
            - Answer as if you are chatting with the user directly.
            - Do NOT include any internal data like user IDs or system info.
            - You may use plain text, bullet points, or numbering for readability.
            - Keep the response concise, clear, and friendly.
            - Include relevant information from the context if needed, but avoid unnecessary explanations.

            Context:
            {context}

            Conversation Context:
            {conversation_context}

            User Question:
            {question}

            Answer:"""
        )


    # LLM
    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-001")
    
    # Output parser
    output_parser = StrOutputParser()
    
    # Create the chain using the new RunnableSequence approach
    chain = prompt | llm | output_parser
    
    return chain