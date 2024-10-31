import { useState, useEffect, useRef } from "react";
import { requestToGroqAI } from "./utils/groq";
import { Light as SyntaxHighlight } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import "./App.css";

function App() {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [delay, setDelay] = useState(false);
  const inputRef = useRef(null);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        event.preventDefault(); // Mencegah pengiriman form dengan tombol Enter
        const inputValue = inputRef.current.value;
        inputRef.current.value = inputValue + "\n"; // Tambahkan baris baru
      } else {
        // Jika hanya Enter, kirim permintaan
        handleSubmit(event);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (delay) {
      alert("Tunggu 2 menit sebelum membuat permintaan lagi.");
      return;
    }

    setLoading(true);
    setTyping(false);
    const ai = await requestToGroqAI(inputRef.current.value);
    console.log({ ai });
    setData(ai);
    setLoading(false);
    setTyping(true);
    inputRef.current.value = ""; // mengosongkan input
    setRequestCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    if (typing) {
      const timer = setTimeout(() => {
        setTyping(false);
      }, 2000); // durasi simulasi animasi mengetik

      return () => clearTimeout(timer);
    }
  }, [typing]);

  useEffect(() => {
    if (requestCount === 10) {
      setDelay(true);
      const delayTimer = setTimeout(() => {
        setDelay(false);
        setRequestCount(0);
      }, 300000); // 5 menit dalam milidetik

      return () => clearTimeout(delayTimer);
    }
  }, [requestCount]);

  return (
    <main className="flex flex-col min-h-[80vh] justify-center items-center max-w-xl w-full mx-auto">
      <h1 className="text-4xl text-indigo-500 font-bold">REACT | GROQ AI</h1>
      <form className="flex flex-col gap-4 py-4 w-full" onSubmit={handleSubmit}>
        <textarea
          placeholder="Ketik pertanyaan..."
          className="py-2 px-4 text-md rounded-md"
          id="content"
          ref={inputRef}
          onKeyDown={handleKeyDown} // Tambahkan event handler di sini
        />
        <button
          type="submit"
          className="bg-indigo-500 py-2 px-4 font-bold text-white rounded-md"
          disabled={delay}
        >
          Kirim!
        </button>
      </form>
      <div className="max-w-xl w-full mx-auto">
        {loading && <div className="loading">Memuat...</div>}
        {typing && <div className="typing">Mengetik...</div>}
        {data && !loading && !typing && (
          <SyntaxHighlight language="swift" style={darcula} wrapLongLines={true}>
            {data}
          </SyntaxHighlight>
        )}
      </div>
      <a href="https://instagram.com/bimaaxt/" target="_blank" className="text-indigo-500 text-1xl py-2 px-2 font-bold">@bimaaxt</a>
    </main>
  );
}

export default App;
