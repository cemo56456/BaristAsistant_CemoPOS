import { useState } from "react";
import "./App.css";

// Sabit ürün listesi (ileride veritabanından gelecek, şimdilik elle tanımlı)
const PRODUCTS = [
  { id: 1, name: "Americano", price: 90 },
  { id: 2, name: "Latte", price: 110 },
  { id: 3, name: "Matcha Latte", price: 130 },
  { id: 4, name: "Cold Brew", price: 120 },
  { id: 5, name: "Filtre Kahve", price: 80 },
];

const TABLES = [1, 2, 3, 4, 5];

// Sepetteki bir ürünü temsil eden tip
type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
};

function App() {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  // Her masanın kendi sepetini tutuyoruz: { 1: [...], 2: [...] } gibi
  const [tableCarts, setTableCarts] = useState<Record<number, CartItem[]>>({});

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);

  async function sendChatMessage() {
    if (!chatInput.trim()) return;

    const question = chatInput;
    setChatMessages((prev) => [...prev, { role: "user", text: question }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setChatMessages((prev) => [...prev, { role: "assistant", text: data.answer }]);
    } catch (err) {
      setChatMessages((prev) => [...prev, { role: "assistant", text: "Bağlantı hatası, asistan servisi çalışıyor mu kontrol et." }]);
    } finally {
      setChatLoading(false);
    }
  }

  function selectTable(table: number) {
    setSelectedTable(table);
  }

  function addProduct(productId: number) {
    if (selectedTable === null) return;

    const product = PRODUCTS.find((p) => p.id === productId)!;

    setTableCarts((prev) => {
      const currentCart = prev[selectedTable] || [];
      const existingItem = currentCart.find((item) => item.productId === productId);

      let newCart: CartItem[];
      if (existingItem) {
        // Ürün zaten sepette varsa, miktarını artır
        newCart = currentCart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Yeni ürün ekle
        newCart = [
          ...currentCart,
          { productId: product.id, name: product.name, price: product.price, quantity: 1 },
        ];
      }

      return { ...prev, [selectedTable]: newCart };
    });
  }

  const currentCart = selectedTable !== null ? tableCarts[selectedTable] || [] : [];
  const total = currentCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand">CEMO POS</div>
      </header>

      <div className="main">
        <aside className="sidebar">
          <h2>Masalar</h2>
          <div className="tables">
            {TABLES.map((table) => (
              <button
                key={table}
                onClick={() => selectTable(table)}
                className={`table-chip ${selectedTable === table ? "active" : ""}`}
              >
                Masa {table}
              </button>
            ))}
          </div>

          {selectedTable !== null && (
            <div className="products-section">
              <h3>Masa {selectedTable} - Ürün Ekle</h3>
              <div className="products-grid">
                {PRODUCTS.map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-info">
                      <div className="product-name">{product.name}</div>
                      <div className="product-price">{product.price}₺</div>
                    </div>
                    <button className="product-btn" onClick={() => addProduct(product.id)}>
                      Ekle
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        <section className="cart">
          <h2>Sepet</h2>
          {paymentMessage && <div className="toast">{paymentMessage}</div>}
          {currentCart.length === 0 ? (
            <div className="empty">Sepet boş.</div>
          ) : (
            <ul className="cart-list">
              {currentCart.map((item) => (
                <li key={item.productId} className="cart-item">
                  <div>
                    <div className="item-name">{item.name}</div>
                    <div className="item-qty">x{item.quantity}</div>
                  </div>
                  <div className="item-price">{item.price * item.quantity}₺</div>
                </li>
              ))}
            </ul>
          )}

          <div className="cart-footer">
            <div className="total">Toplam: <span className="total-amount">{total}₺</span></div>
            <div>
            <button className="button-secondary" onClick={() => {
              if (selectedTable === null) return;
              setTableCarts(prev => ({ ...prev, [selectedTable]: [] }));
              setSelectedTable(null);
              setPaymentMessage("İşlem iptal edildi.");
              setTimeout(() => setPaymentMessage(null), 2000);
            }}>İptal</button>
            <button className="button-primary" onClick={() => {
              if (selectedTable === null) return;
              // Simulate successful payment
              setTableCarts(prev => ({ ...prev, [selectedTable]: [] }));
              setSelectedTable(null);
              setPaymentMessage("Ödeme başarılı.");
              setTimeout(() => setPaymentMessage(null), 2000);
            }}>Öde</button>
          </div>
          </div>
        </section>
      </div>

      <button className="fab" onClick={() => setChatOpen(!chatOpen)}>☕</button>

      {chatOpen && (
        <div className="chat-panel">
          <div className="chat-header">BaristAssistant</div>

          <div className="chat-messages">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.role === "user" ? "user" : "assistant"}`}>
                {msg.text}
              </div>
            ))}
            {chatLoading && <div className="chat-loading">Bir düşüneyim...</div>}
          </div>

          <div className="chat-input-area">
            <input
              className="barista-chat-input"
              value={chatInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChatInput(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && sendChatMessage()}
              placeholder="Sor bakalım Barista..."
            />
            <button className="button-primary" onClick={sendChatMessage}>Gönder</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;