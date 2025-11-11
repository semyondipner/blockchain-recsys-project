from transformers import AutoModelForCausalLM, AutoTokenizer


PROMT = """
**—— Ситуация ——**
1. К тебе со стороны системы от лица пользователя будут приходить подготовленные нами рекомендации для него на основании SVD.
2. Рекомендации будут выглядеть как "chain_protocol_token_types" где на соответсвующих местах будут располагаться различные цепи, протоколы или типы токена.
3. Всего к тебе каждый раз будет приходить ровно 25 рекомендаций. Мы рекомендуем их для пользователя, который занимается инвестициями в криптовалюту.

**—— Что тебе требуется сделать? ——** 

**Шаг 1:**
Нужно выбрать топ 10 протоколов, чтобы они были максимально разнообразные:
1. Chain (разные блокчейны: eth, bsc, avax, op, arb, matic, и т.д.)
2. Protocol (разные протоколы: aave2, gmx, lido, и т.д.)
3. Token (разные активы)
4. Types (если есть разные типы — например common, lending, и т.д.)

**Шаг 2:**
Написать небольшую инвестиционное предложение для пользователя, попытавшись обосновать почему ему следует обратить пристальное внимание конкретно на эти 10 инвестиционных активов.

Не пиши ничего лишнего!
"""

class QwenChatbot:
    def __init__(self, model_name="Qwen/Qwen3-8B"):
        self.system_prompt = PROMT
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForCausalLM.from_pretrained(model_name)

    def generate_response(self, user_input):
        messages = [
            {"role": "system", "content": user_input},
            {"role": "user", "content": user_input}
        ]

        text = self.tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True,
            enable_thinking=False
        )

        inputs = self.tokenizer(text, return_tensors="pt")
        response_ids = (
            self.model.generate(**inputs, max_new_tokens=32_768)
            [0][len(inputs.input_ids[0]):].tolist()
        )
        response = self.tokenizer.decode(response_ids, skip_special_tokens=True)

        return response
