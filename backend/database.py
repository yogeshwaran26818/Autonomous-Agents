from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.database import Database
from config import settings

client: MongoClient = None
db: Database = None

def connect_to_mongo():
    global client, db
    if settings.mongodb_uri:
        client = MongoClient(settings.mongodb_uri)
        db = client[settings.database_name]
        print("Connected to MongoDB")
    else:
        print("Warning: MONGODB_URI not found.")

def close_mongo_connection():
    global client
    if client:
        client.close()
        print("MongoDB connection closed")

def get_collection(collection_name: str) -> Collection:
    global client, db
    if db is None:
        connect_to_mongo()
    if db is not None:
        return db[collection_name]
    raise Exception("Database not initialized")
