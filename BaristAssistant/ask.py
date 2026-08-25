import ollama
import chromadb
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RECIPIES_DB = os.path.join(BASE_DIR, "RecipiesDB")
DISTANCE_THRESHOLD = 0.78

client = chromadb.PersistentClient(path=RECIPIES_DB)
collection = client.get_or_create_collection("Recipies")

def ask(question):
    question_embedding = ollama.embed(model="nomic-embed-text", input=question)["embeddings"][0]

    result = collection.query(query_embeddings=[question_embedding], n_results=2)
    documents = result["documents"][0]
    distances = result["distances"][0]

    print(f"[DEBUG] Distances: {distances}")

    relevant_docs = [doc for doc, dist in zip(documents,distances) if dist < DISTANCE_THRESHOLD]

    if not relevant_docs:
        print("I don't have information on this, you might want to ask the barista in charge.")
        return

    context = "\n\n".join(relevant_docs)

    response = ollama.chat(model="qwen2.5:1.5b", messages=[
        {"role": "system", "content": f"You are an assistant helping baristas who works at a cafe.Only answer based on the recipes below, do not make anything up:\n\n{context}"},
        {"role": "user", "content": question}],
        options={"temperature": 0.3}
        )

    print(response["message"]["content"])

if __name__ == "__main__":
    while True:
        question = input("\n*BaristAssistant*\n What do you want to know, Barista?: ")
        if question.lower() == "q":
            break
        ask(question)