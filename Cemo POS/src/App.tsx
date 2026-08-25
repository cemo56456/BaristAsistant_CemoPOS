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
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>*CEMOPOS*</h1>

      <h2>Masalar</h2>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {TABLES.map((table) => (
          <button
            key={table}
            onClick={() => selectTable(table)}
            style={{
              padding: "10px 20px",
              backgroundColor: selectedTable === table ? "#4CAF50" : "#ddd",
              color: selectedTable === table ? "white" : "black",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Masa {table}
          </button>
        ))}
      </div>

      {selectedTable !== null && (
        <>
          <h2>Masa {selectedTable} - Ürün Ekle</h2>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
            {PRODUCTS.map((product) => (
              <button
                key={product.id}
                onClick={() => addProduct(product.id)}
                style={{
                  padding: "10px 15px",
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {product.name} - {product.price}₺
              </button>
            ))}
          </div>

          <h2>Sepet</h2>
          {currentCart.length === 0 ? (
            <p>Sepet boş.</p>
          ) : (
            <ul>
              {currentCart.map((item) => (
                <li key={item.productId}>
                  {item.name} x{item.quantity} - {item.price * item.quantity}₺
                </li>
              ))}
            </ul>
          )}

          <h3>Toplam: {total}₺</h3>
        </>
      )}
      {/* Barista Asistanı - sağ alt köşede sabit buton */}
  <button
    onClick={() => setChatOpen(!chatOpen)}
    style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      backgroundColor: "#FF6F00",
      color: "white",
      border: "none",
      fontSize: "24px",
      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    }}
  >
    ☕
  </button>

  {chatOpen && (
    <div
      style={{
        position: "fixed",
        bottom: "90px",
        right: "20px",
        width: "320px",
        height: "400px",
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div style={{ backgroundColor: "#FF6F00", color: "white", padding: "10px", fontWeight: "bold" }}>
        BaristAssistant
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
        {chatMessages.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: "8px",
              textAlign: msg.role === "user" ? "right" : "left",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "6px 10px",
                borderRadius: "8px",
                backgroundColor: msg.role === "user" ? "#2196F3" : "#eee",
                color: msg.role === "user" ? "white" : "black",
                maxWidth: "80%",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {chatLoading && <p style={{ fontStyle: "italic", color: "#888" }}>Bir düşüneyim...</p>}
      </div>

      <div style={{ display: "flex", borderTop: "1px solid #ccc" }}>
              <style>{`
                .barista-chat-input::placeholder {
                  color: #555 !important;
                  opacity: 1 !important;
                  font-weight: 500;
                }
              `}</style>
              <input
                className="barista-chat-input"
                value={chatInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChatInput(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && sendChatMessage()}
                placeholder="Sor bakalım Barista..."
                style={{ flex: 1, border: "none", padding: "10px", color: "#222" }}
              />
        <button onClick={sendChatMessage} style={{ border: "none", backgroundColor: "#FF6F00", color: "white", padding: "0 15px" }}>
          Gönder
        </button>
      </div>
    </div>
  )}
    </div>
  );
}

export default App;