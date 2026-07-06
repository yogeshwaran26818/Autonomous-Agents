from groq import Groq
from config import settings

client = None
if settings.groq_api_key:
    client = Groq(api_key=settings.groq_api_key)

def generate_completion(prompt: str, system_prompt: str = "You are a helpful AI assistant.") -> str:
    if not client:
        raise Exception("Groq API key not configured")
    
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model=settings.groq_model,
        temperature=0.7,
        max_tokens=4000
    )
    return chat_completion.choices[0].message.content
