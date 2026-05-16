from langchain_openai import ChatOpenAI
from langchain_community.chat_models import ChatOllama
from app.config import settings

def get_llm():
    if settings.LLM_PROVIDER == "openai":
        return ChatOpenAI(
            model=settings.OPENAI_MODEL,
            openai_api_key=settings.OPENAI_API_KEY
        )
    elif settings.LLM_PROVIDER == "ollama":
from langchain_community.chat_models import ChatOllama
from langchain_openai import ChatOpenAI
from app.config import settings

def get_llm(provider=None):
    """
    Factory function to get the LLM based on the provider.
    """
    provider = provider or settings.LLM_PROVIDER
    
    if provider == "ollama":
        return ChatOllama(
            model=settings.OLLAMA_MODEL,
            base_url=settings.OLLAMA_BASE_URL
        )
    else:
        # Default or fallback
        return ChatOllama(
            model="llama3",
            base_url="http://localhost:11434"
        )
    elif provider == "openai":
        return ChatOpenAI(
            model=settings.OPENAI_MODEL,
            api_key=settings.OPENAI_API_KEY
        )
    else:
        raise ValueError(f"Unsupported LLM provider: {provider}")
