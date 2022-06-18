<<<<<<< HEAD
var template_code_script = template`import re
import os

import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton, InputMediaPhoto

from config import *
from func import *
from flask import Flask, jsonify, request

app = Flask(__name__)
bot = telebot.TeleBot(TOKEN)

@app.route('/'+TOKEN, methods=['POST'])
def getMessage():
	bot.enable_save_next_step_handlers(delay=2)
	bot.load_next_step_handlers()
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
												   url=button.url.format(*vals[i]['urls']))
			buttons.append(inlineValue)
			i = i + 1
		keyboard.row(*buttons)
	return keyboard

${0}

def calc(query):
	value = -1
	if '?' in query:
		value = re.search(r'\\?.+', query)[0][1:].split(',')
		query = re.search(r'^[^\\?]+', query)[0]
	return [query, value]

@bot.callback_query_handler(func=lambda call: True)
def callback_query(call):
	bot.delete_message(call.message.chat.id, call.message.message_id) # Optional

	[query, value] = calc(call.data)

	possibles = globals().copy()
	possibles.update(locals())
	method = possibles.get(query)
	if value == -1:
		method(call.message)
	else:
		method(call.message, value)

if __name__ == "__main__":
	app.run(host="0.0.0.0", port=int(os.environ.get('PORT', 5000)))`;

var message = template`${2}
def ${0}(message):
	clid = message.chat.id
	${3}
	${1}
`;

var keyboard = template`
	inlineState = [
		${0}	
	]
	keyboard = create_keyboard(tree.${1}.buttons, inlineState)
	bot.send_message(clid, tree.${1}.text${2}, reply_markup=keyboard)
`;
var keyboardPhoto = template`
	inlineState = [
		${0}	
	]
	keyboard = create_keyboard(tree.${1}.buttons, inlineState)
	bot.send_photo(chat_id=clid,
				   photo=tree.${1}.image,
				   caption=tree.${1}.text${2},
				   reply_markup=keyboard)
`
var sMessage = template`
	${2}bot.send_message(clid, tree.${0}.text${3})
	${1}
`;

var sPhotoMessage = template`
	${2}bot.send_photo(chat_id=clid,
			   photo=tree.${0}.image${3},
			   caption=tree.${0}.text)
	${1}
`
var next_step_handlers = template`bot.register_next_step_handler(msg, ${0})`

var keyformat = template`{'type': '${0}', 'texts': [''], 'callbacks': [''], 'urls': ['']}`;

var command = template`@bot.message_handler(commands=['${0}'])`;

var var_text = template`${0} = message.text`;



var template_code_config = template`from func import Map 
from PIL import Image
TOKEN = '1272925344:AAGArvS0kwYUB8W0wL3EufrsGn8kNRGar9w'
URL = 'https://consimo.herokuapp.com/'

${1}

tree = Map({
${0}
})
`;
var textformat = template`	'${0}': {
		'text': "${1}",
${3}
		'buttons': [
${2}
		]
	},
`
var buttonformat = template`\t\t\t\t{
\t\t\t\t	'text': "${0}",
\t\t\t\t	'callback': "${1}",
\t\t\t\t	'url': "${2}",
\t\t\t\t}`;

var photoformat = template`\t\t'image': Image.open('./${0}.png'),`;




var template_code_func = `import re
import string

class Map(dict):
    def __init__(self, *args, **kwargs):
        super(Map, self).__init__(*args, **kwargs)
        for arg in args:
            if isinstance(arg, dict):
                for k, v in arg.items():
                    if isinstance(v, dict):
                        v = Map(v)
                    if isinstance(v, list):
                        self.__convert(v)
                    self[k] = v

        if kwargs:
            for k, v in kwargs.items():
                if isinstance(v, dict):
                    v = Map(v)
                elif isinstance(v, list):
                    self.__convert(v)
                self[k] = v

    def __convert(self, v):
        for elem in range(0, len(v)):
            if isinstance(v[elem], dict):
                v[elem] = Map(v[elem])
            elif isinstance(v[elem], list):
                self.__convert(v[elem])

    def __getattr__(self, attr):
        return self.get(attr)

    def __setattr__(self, key, value):
        self.__setitem__(key, value)

    def __setitem__(self, key, value):
        super(Map, self).__setitem__(key, value)
        self.__dict__.update({key: value})

    def __delattr__(self, item):
        self.__delitem__(item)

    def __delitem__(self, key):
        super(Map, self).__delitem__(key)
        del self.__dict__[key]

def previous(path):
    return re.search(r'(.+\/)+', path)[0][:-1]
=======
var template_code_script = template`import re
import os

import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton, InputMediaPhoto

from config import *
from func import *
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
												   url=button.url.format(*vals[i]['urls']))
			buttons.append(inlineValue)
			i = i + 1
		keyboard.row(*buttons)
	return keyboard

def buffer_step(message):
	return

def check_new_user(clid):
	global users
	if not clid in users:
		users[clid] = new_user

${0}

@bot.message_handler(content_types = ['text', 'photo'])
def receiver(message):
	clid = message.chat.id
	global users
	if users[clid]['next_step'] != "":
		possibles = globals().copy()
		possibles.update(locals())
		method = possibles.get(users[clid]['next_step'])

		users[clid]['next_step'] = ""
		users[clid][users[clid]['update_var']] = message.text
		users[clid]['update_var'] = ""

		method(message)

def calc(query):
	value = -1
	if '?' in query:
		value = re.search(r'\\?.+', query)[0][1:].split(',')
		query = re.search(r'^[^\\?]+', query)[0]
	return [query, value]

@bot.callback_query_handler(func=lambda call: True)
def callback_query(call):
	bot.delete_message(call.message.chat.id, call.message.message_id) # Optional

	[query, value] = calc(call.data)

	possibles = globals().copy()
	possibles.update(locals())
	method = possibles.get(query)
	if value == -1:
		method(call.message)
	else:
		method(call.message, value)

if __name__ == "__main__":
	app.run(host="0.0.0.0", port=int(os.environ.get('PORT', 5000)))`;

var message = template`${2}
def ${0}(message):
	clid = message.chat.id
	check_new_user(clid)
	${4}
	${3}
	${1}
`;

var keyboard = template`
	inlineState = [
		${0}	
	]
	keyboard = create_keyboard(tree.${1}.buttons, inlineState)
	bot.send_message(clid, tree.${1}.text${2}, reply_markup=keyboard)
`;
var keyboardPhoto = template`
	inlineState = [
		${0}	
	]
	keyboard = create_keyboard(tree.${1}.buttons, inlineState)
	bot.send_photo(chat_id=clid,
				   photo=tree.${1}.image,
				   caption=tree.${1}.text${2},
				   reply_markup=keyboard)
`

var sMessage = template`
	bot.send_message(clid, tree.${0}.text${1})
`;

var sPhotoMessage = template`
	bot.send_photo(chat_id=clid,
			   photo=tree.${0}.image,
			   caption=tree.${0}.text${1})
`;

var keyformat = template`{'type': '${0}', 'texts': [''], 'callbacks': [''], 'urls': ['']}`;

var command = template`@bot.message_handler(commands=['${0}'])`;

var var_text = template`global users
	users[clid]['next_step'] = '${0}'
	users[clid]['update_var'] = '${1}'`;



var template_code_config = template`from func import Map 
from PIL import Image
TOKEN = '1272925344:AAGArvS0kwYUB8W0wL3EufrsGn8kNRGar9w'
URL = 'https://consimo.herokuapp.com/'

users = {}
new_user = {	
${1}
	'next_step': "",
	'update_var': "",
}

tree = Map({
${0}
})
`;
var textformat = template`	'${0}': {
		'text': "${1}",
${3}
		'buttons': [
${2}
		]
	},
`
var buttonformat = template`\t\t\t\t{
\t\t\t\t	'text': "${0}",
\t\t\t\t	'callback': "${1}",
\t\t\t\t	'url': "${2}",
\t\t\t\t}`;

var photoformat = template`\t\t'image': Image.open('./${0}.png'),`;




var template_code_func = `import re
import string

class Map(dict):
    def __init__(self, *args, **kwargs):
        super(Map, self).__init__(*args, **kwargs)
        for arg in args:
            if isinstance(arg, dict):
                for k, v in arg.items():
                    if isinstance(v, dict):
                        v = Map(v)
                    if isinstance(v, list):
                        self.__convert(v)
                    self[k] = v

        if kwargs:
            for k, v in kwargs.items():
                if isinstance(v, dict):
                    v = Map(v)
                elif isinstance(v, list):
                    self.__convert(v)
                self[k] = v

    def __convert(self, v):
        for elem in range(0, len(v)):
            if isinstance(v[elem], dict):
                v[elem] = Map(v[elem])
            elif isinstance(v[elem], list):
                self.__convert(v[elem])

    def __getattr__(self, attr):
        return self.get(attr)

    def __setattr__(self, key, value):
        self.__setitem__(key, value)

    def __setitem__(self, key, value):
        super(Map, self).__setitem__(key, value)
        self.__dict__.update({key: value})

    def __delattr__(self, item):
        self.__delitem__(item)

    def __delitem__(self, key):
        super(Map, self).__delitem__(key)
        del self.__dict__[key]

def previous(path):
    return re.search(r'(.+\/)+', path)[0][:-1]
>>>>>>> ee60f0100bbd59abe3b7132d12b8dd1ebc1daead
`;