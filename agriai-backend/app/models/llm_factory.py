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
    elif provider == "openai":
        return ChatOpenAI(
            model=settings.OPENAI_MODEL,
            api_key=settings.OPENAI_API_KEY
        )
    else:
        raise ValueError(f"Unsupported LLM provider: {provider}")
