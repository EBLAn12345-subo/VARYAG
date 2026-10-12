import os
import asyncio
import logging
from google import genai
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command

logging.basicConfig(level=logging.INFO)

# Инициализация Gemini API клиента с использованием Secrets
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

# Инициализация бота через переменные окружения (безопасно)
TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")
if not TELEGRAM_BOT_TOKEN:
    raise ValueError("Не найден TELEGRAM_BOT_TOKEN в переменных окружения (Secrets)!")

bot = Bot(token=TELEGRAM_BOT_TOKEN)
dp = Dispatcher()

@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    """Приветственное сообщение при старте бота от VARYAG"""
    welcome_text = (
        "Привет! Я **VARYAG** — твой личный ИИ-ассистент.\n\n"
        "Мой потенциал:\n"
        "• **Память на удаленки:** перехвачу и сохраню то, что собеседник стер из чата.\n"
        "• **Адаптивный автоответчик:** подстроюсь под твой стиль общения.\n"
        "• **Музыкальный центр:** найду треки, распознаю аудио и помогу с плейлистами.\n"
        "• **Умный консьерж:** подскажу погоду с человеческим советом и выжму суть из ссылок.\n"
        "• **Mini App управление:** вся панель настроек прямо в Telegram!\n\n"
        "Напиши мне что-нибудь, и мы начнём!"
    )

    await message.answer(welcome_text, parse_mode="Markdown")

@dp.message()
async def handle_all_messages(message: types.Message):
    """Обработка входящих сообщений с помощью асинхронного вызова Gemini"""
    user_text = message.text
    if not user_text:
        return

    try:
        # Используем асинхронный вызов client.aio, чтобы не блокировать бота
        response = await client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"Ответь кратко и дружелюбно на сообщение: {user_text}",
        )
        answer_text = response.text if response and response.text else "Не удалось получить ответ."
        await message.answer(answer_text)
    except Exception:
        logging.exception("Ошибка при запросе к Gemini")
        await message.answer("Ой, у меня небольшая заминка с ИИ-мозгами. Попробуй еще раз!")

async def main():
    logging.info("VARYAG запущен и готов к работе...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
