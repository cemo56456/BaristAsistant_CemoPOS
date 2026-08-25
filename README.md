# BaristAssistant & CemoPOS ☕🤖

BaristAssistant & CemoPOS, kahve dükkanı operasyonları ve sipariş yönetimini kolaylaştırmak amacıyla geliştirilmiş modern bir Satış Noktası (POS) arayüzü ile yerel yapay zeka tabanlı baristalık asistanı modülünü bir araya getiren entegre bir sistemdir.

---

## 🚀 Temel Özellikler

- **POS Yönetimi (CemoPOS):** Hızlı ürün seçimi, sipariş oluşturma, adisyon takibi ve operasyonel iş akışı.
- **BaristAssistant (AI Modülü):** Kahve demleme reçeteleri, çekirdek profilleri, operasyonel sorular ve parametreler için yerel yapay zeka destekli akıllı sohbet/destek asistanı.
- **Modüler Mimari:** Kullanıcı arayüzü (`app`) ile arka planda çalışan zeka/servis katmanının (`agent`) bağımsız ve entegre çalışabilirliği.

---

## 🏗️ Proje Mimarisi

```text
BaristAsistant_CemoPOS/
├── app/                    # POS Arayüzü ve Ön Yüz Uygulaması
│   ├── src/
│   └── package.json
├── agent/                  # BaristAssistant AI / Backend Servisi
│   ├── config/
│   └── main.py / app.py
├── .gitignore
└── README.md
```

---

## 🛠️ Teknolojiler ve Gereksinimler

- **Ön Yüz / POS:** React / TypeScript, Modern UI kütüphaneleri
- **Asistan / Backend:** Python / Yerel LLM Entegrasyonu (Ollama, ChromaDB / RAG altyapısı)
- **Paket Yöneticileri:** Node.js (npm / yarn), Python (pip / venv)

---

## ⚙️ Kurulum ve Çalıştırma

### 1. Depoyu Klonlayın
```bash
git clone [https://github.com/cemo56456/BaristAsistant_CemoPOS.git](https://github.com/cemo56456/BaristAsistant_CemoPOS.git)
cd BaristAsistant_CemoPOS
```

### 2. AI Asistanı / Backend Servisini Başlatma
```bash
cd agent

# Sanal ortam oluşturma ve aktif etme
python -m venv venv

# Windows:
.\venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# Gerekli bağımlılıkları yükleyin
pip install -r requirements.txt

# Servisi başlatın
python main.py
```

### 3. POS Uygulamasını Başlatma
Yeni bir terminal sekmesinde:
```bash
cd app
npm install
npm run dev
```

---

## 📌 Kullanım Senaryoları

1. **Sipariş Girişi:** POS ekranı üzerinden ürünleri sepete ekleyin ve sipariş akışını tamamlayın.
2. **Asistan Danışma:** Entegre BaristAssistant paneli üzerinden demleme oranları, çekirdek kavurma profilleri ve ekipman kalibrasyonları hakkında anlık bilgi alın.

---

## 🔒 Lisans ve Gizlilik
Bu proje özel mülkiyete tabidir. İzinsiz kopyalanamaz veya dağıtılamaz.
