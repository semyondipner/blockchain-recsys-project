from gigachat import GigaChat

def get_adv(token: str) -> str:
    giga = GigaChat(
    credentials=f".", #получить тут https://developers.sber.ru/studio/workspaces/
    verify_ssl_certs=False,
    )

    response = giga.chat(f"Составь одно рекламное предложение про криптовалютный токен {token.upper()} без лишней эмоциональности")
    return response.choices[0].message.content


### example
# print(get_adv('bnb'))