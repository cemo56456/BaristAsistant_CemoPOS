# BaristAssistant & CemoPOS ☕🤖

BaristAssistant & CemoPOS is an integrated coffee shop management platform combining a modern Point of Sale (POS) interface with a local AI-powered barista assistant module to streamline order taking and cafe workflows.

---

## 🚀 Key Features

- **POS Operations (CemoPOS):** Fast item selection, order processing, ticket management, and operational workflow tracking.
- **BaristAssistant (AI Module):** Local AI conversational agent for brewing recipes, bean roast profiles, operational parameters, and equipment troubleshooting.
- **Modular Monorepo Architecture:** Clean separation between the frontend interface (`app`) and the backend intelligence layer (`agent`).

---

## 🏗️ Project Structure

```text
BaristAsistant_CemoPOS/
├── app/                    # POS Frontend UI (React / TypeScript)
│   ├── src/
│   └── package.json
├── agent/                  # BaristAssistant AI / Backend Service (Python / Local LLM)
│   ├── config/
│   └── main.py
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack & Prerequisites

- **Frontend / POS:** React, TypeScript, Vite / Modern UI Kit
- **Agent / Backend:** Python 3.10+, Local LLM Integration (Ollama / ChromaDB RAG pipeline)
- **Package Managers:** Node.js (`npm` or `yarn`), Python (`pip` / `venv`)

---

## ⚙️ Getting Started

### 1. Clone the Repository
```bash
git clone [https://github.com/cemo56456/BaristAsistant_CemoPOS.git](https://github.com/cemo56456/BaristAsistant_CemoPOS.git)
cd BaristAsistant_CemoPOS
```

### 2. Start the AI Assistant / Backend Service
```bash
cd agent

# Create and activate virtual environment
python -m venv venv

# Windows:
.\venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the agent service
python main.py
```

### 3. Start the POS Application
Open a new terminal session:
```bash
cd app
npm install
npm run dev
```

---

## 📌 Use Cases

1. **Order Processing:** Use the POS interface to add items, customize options, and complete customer orders.
2. **AI Barista Guidance:** Consult the embedded BaristAssistant for real-time extraction ratios, grind adjustments, and bean origin details.

---

## 🔒 License
Proprietary and confidential. Unauthorized copying, distribution, or modification is strictly prohibited.
