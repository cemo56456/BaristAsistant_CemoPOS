import os
import re
import ollama
import chromadb
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RECIPIES = os.path.join(BASE_DIR, "Recipies")
RECIPIES_DB = os.path.join(BASE_DIR, "RecipiesDB")

client = chromadb.PersistentClient(path=RECIPIES_DB)
collection = client.get_or_create_collection("Recipies")

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

class Question(BaseModel):
    question: str

OFF_TOPIC_KEYWORDS = ["araba", "lastik", "hava durumu", "din", "siyaset", "futbol", "telefon", "bilgisayar"]

def is_off_topic(question: str) -> bool:
    question_lower = question.lower()
    return any(keyword in question_lower for keyword in OFF_TOPIC_KEYWORDS)

def get_product_tokens():
    tokens = set()
    for file in os.listdir(RECIPIES):
        if file.endswith(".txt"):
            key = file.replace("_hazirlama_tarifi.txt", "").replace("_demleme_tarifi.txt", "")
            tokens.add(key.split("_")[0].lower())  # ilk kelime: "americano", "v60", "matcha" vs.
    return tokens

PRODUCT_TOKENS = get_product_tokens()

def count_product_mentions(question: str) -> int:
    question_lower = question.lower()
    return sum(1 for token in PRODUCT_TOKENS if re.search(r'\b' + re.escape(token) + r'\b', question_lower))

HARD_CUTOFF = 0.80

def ask(question: str) -> str:
    if is_off_topic(question):
        print(f"[DEBUG] Off-topic keyword blocked: {question}")
        return "Bu konuda bilgim yok, lütfen sorumlu baristaya danışın."

    question_embedding = ollama.embed(model="nomic-embed-text", input="search_query: " + question)["embeddings"][0]
    result = collection.query(query_embeddings=[question_embedding], n_results=3)
    documents = result["documents"][0]
    distances = result["distances"][0]

    mentions = count_product_mentions(question)
    print(f"[DEBUG] Question: {question} | Distances: {distances} | Product mentions: {mentions}")

    # Sadece tek bir ürün adı geçiyorsa, mesafeye çok takılma - modele sor
    # Sıfır ya da birden fazla ürün adı geçiyorsa, mesafe kontrolünü uygula
    if mentions != 1 and distances[0] > HARD_CUTOFF:
        print(f"[DEBUG] Ambiguous/ no clear single product + distance too high, refusing without calling LLM")
        return "Bu konuda elimde bilgi yok, lütfen sorumlu baristaya danışın."

    context = "\n\n---\n\n".join(documents)

    response = ollama.chat(model="llama3.2:3b", messages=[
        {"role": "system", "content": f"""Sen bir kafe tarif asistanısın. Aşağıda aday tarifler var.

Kullanıcının sorusu bu tariflerden biriyle TAM olarak eşleşmiyorsa (farklı bir içecek/varyasyon soruyorsa), şunu söyle: "Bu konuda elimde bilgi yok, lütfen sorumlu baristaya danışın."

Aday tarifler:
{context}"""},
        {"role": "user", "content": question}],
        options={"temperature": 0.2}
    )

    return response["message"]["content"]

@app.post("/ask")
def ask_endpoint(q: Question):
    return {"answer": ask(q.question)}