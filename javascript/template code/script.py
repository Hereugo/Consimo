import re
import os

import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton, InputMediaPhoto

from config import *
from functions import *
from flask import Flask, jsonify, request

app = Flask(__name__)
bot = telebot.TeleBot(TOKEN)



@app.route('/'+TOKEN, methods=['POST'])
def getMessage():
	bot.process_new_updates([telebot.types.Update.de_json(request.stream.read().decode("utf-8"))])
	return "!", 200

@app.route('/')
def webhook():
	bot.remove_webhook()
	bot.set_webhook(url=URL + TOKEN)
	return '!', 200

def create_keyboard(arr, vals):
	keyboard = InlineKeyboardMarkup()
	i = 0
	for lst in arr:
		buttons = []
		for button in lst:
			if vals[i]['type'] == 'callback':
				inlineValue = InlineKeyboardButton(button.text.format(*vals[i]['texts']),
												   callback_data=button.callback.format(*vals[i]['callbacks']))
			elif vals[i]['type'] == 'url':
				inlineValue = InlineKeyboardButton(button.text.format(*vals[i]['texts']),
												   url=button.url.format(vals[i]['url']))
			buttons.append(inlineValue)
			i = i + 1
		keyboard.row(*buttons)
	return keyboard



# this line of if a message can be activated be a command
# @bot.message_handler(commands=['COMMAND'])
def wid(message):
	clid = message.chat.id

	#  these lines of code allows a bot to send keyboard messages
	# inlineState = [
	# 	{'type': '', 'texts': [''], 'callbacks': [''], 'urls': ''},
	# 	.
	# 	.
	# 	.
	# 	{'type': '', 'texts': [''], 'callbacks': [''], 'urls': ''},		
	# ]
	# keyboard = create_keyboard(tree.wid.buttons, inlineState)
	bot.send_message(clid, tree.wid.text) #, reply_markup=keyboard)


def calc(query):
	value = -1
	if '?' in query:
		value = re.search(r'\?.+', query)[0][1:].split(',')
		query = re.search(r'^[^\?]+', query)[0]
	return [query, value]

@bot.callback_query_handler(func=lambda call: True)
def callback_query(call):
	bot.delete_message(call.message.chat.id, call.message.message_id)

	[query, value] = calc(call.data)

	possibles = globals().copy()
	possibles.update(locals())
	method = possibles.get(query)
	if value == -1:
		method(call.message)
	else:
		method(call.message, value)


if __name__ == "__main__":
	app.run(host="0.0.0.0", port=int(os.environ.get('PORT', 5000)))