from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer

# Initialize chatbot
chatbot = ChatBot(
    'ECommerceBot',
    storage_adapter='chatterbot.storage.SQLStorageAdapter',
    logic_adapters=[
        'chatterbot.logic.BestMatch',
        'chatterbot.logic.MathematicalEvaluation',
        'chatterbot.logic.TimeLogicAdapter',
    ],
    database_uri='sqlite:///database.db'
)

# Train the bot with the ChatterBot corpus
trainer = ChatterBotCorpusTrainer(chatbot)
trainer.train('chatterbot.corpus.english')

def get_response(message):
    return chatbot.get_response(message)
