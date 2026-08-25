import os
import ollama
import chromadb

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RECIPIES = os.path.join(BASE_DIR, "Recipies")
RECIPIES_DB = os.path.join(BASE_DIR, "RecipiesDB")

client = chromadb.PersistentClient(path=RECIPIES_DB)
collection = client.get_or_create_collection("Recipies")

def ingest():
    files = [f for f in os.listdir(RECIPIES) if f.endswith(".txt")]
    print(f"{len(files)} files found, processing...")

    for file in files:
        path = os.path.join(RECIPIES, file)
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()

        embedding = ollama.embed(model="nomic-embed-text", input="search_document: " + content)["embeddings"][0]

        collection.upsert(
            ids=[file],
            embeddings=[embedding],
            documents=[content],
            metadatas=[{"source": file}]
        )
        print(f"  ✓ {file} added")

    print("DONE.")

if __name__ == "__main__":
    ingest()