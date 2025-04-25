import os
from gigachat import GigaChat
from dotenv import load_dotenv
load_dotenv()

API_TOKEN = os.getenv("API_TOKEN")

def get_adv(token: str) -> str:
    giga = GigaChat(
    credentials=API_TOKEN, #получить тут https://developers.sber.ru/studio/workspaces/
    verify_ssl_certs=False,
    )
    response = giga.chat(f"Составь одно рекламное предложение про криптовалютный токен {token.upper()} без лишней эмоциональности")
    return response.choices[0].message.content


### example
print(get_adv('bnb'))