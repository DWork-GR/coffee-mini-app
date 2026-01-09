import json
from aiogram import Bot, Dispatcher
from aiogram.types import (
    Message,
    ReplyKeyboardMarkup,
    KeyboardButton,
    WebAppInfo
)
from aiogram.filters import CommandStart
import asyncio

from config import BOT_TOKEN, WEBAPP_URL

bot = Bot(BOT_TOKEN)
dp = Dispatcher()


@dp.message(CommandStart())
async def start(message: Message):
    keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [
                KeyboardButton(
                    text="☕ Open Coffee Shop",
                    web_app=WebAppInfo(url=WEBAPP_URL)
                )
            ]
        ],
        resize_keyboard=True
    )

    await message.answer(
        "👋 Welcome to *Coffee Shop Demo*!\n\n"
        "Tap the button below to open the menu and place an order.",
        reply_markup=keyboard,
        parse_mode="Markdown"
    )


@dp.message(lambda m: m.web_app_data is not None)
async def handle_webapp(message: Message):
    if message.web_app_data is None:
        return

    data = json.loads(message.web_app_data.data)

    if not data:
        await message.answer("🛒 Your cart is empty.")
        return

    text = "✅ *Order received!*\n\n"
    total = 0

    for item in data:
        text += f"• {item['name']} — ${item['price']}\n"
        total += item['price']

    text += f"\n💰 *Total:* ${total}"

    await message.answer(text, parse_mode="Markdown")


async def main():
    print("🤖 Bot started and polling...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())

