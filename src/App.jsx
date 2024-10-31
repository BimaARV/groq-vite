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
  const [darkMode, setDarkMode] = useState(false);
  const inputRef = useRef(null);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        event.preventDefault();
        const inputValue = inputRef.current.value;
        inputRef.current.value = inputValue + "\n";
      } else {
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
    setData(ai);
    setLoading(false);
    setTyping(true);
    inputRef.current.value = "";
    setRequestCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    if (typing) {
      const timer = setTimeout(() => {
        setTyping(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [typing]);

  useEffect(() => {
    if (requestCount === 10) {
      setDelay(true);
      const delayTimer = setTimeout(() => {
        setDelay(false);
        setRequestCount(0);
      }, 300000);
      return () => clearTimeout(delayTimer);
    }
  }, [requestCount]);

  // Mengupdate body class berdasarkan mode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("bg-gray-900", "text-white");
      document.body.classList.remove("bg-gray-100", "text-gray-900");
    } else {
      document.body.classList.add("bg-gray-100", "text-gray-900");
      document.body.classList.remove("bg-gray-900", "text-white");
    }
  }, [darkMode]);

  return (
    <main className={`flex flex-col min-h-screen justify-center items-center p-6`}>
      <h1 className="text-4xl font-bold mb-6">REACT | GROQ AI</h1>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`mb-4 px-4 py-2 rounded-md transition duration-300 ${darkMode ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
      >
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      <form className="flex flex-col gap-4 w-full max-w-xl" onSubmit={handleSubmit}>
        <textarea
          placeholder="Ketik pertanyaan..."
          className={`py-3 px-4 text-md rounded-md shadow-lg border ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
          id="content"
          ref={inputRef}
          onKeyDown={handleKeyDown}
          rows="4"
        />
        <button
          type="submit"
          className={`bg-indigo-600 py-2 px-4 font-bold rounded-md shadow transition duration-300 ${darkMode ? 'hover:bg-indigo-700' : 'hover:bg-indigo-600'}`}
          disabled={delay}
        >
          Kirim!
        </button>
      </form>
      <div className="max-w-xl w-full mx-auto mt-4">
        {loading && <div className="loading animate-pulse">Memuat...</div>}
        {typing && <div className="typing animate-pulse">Mengetik...</div>}
        {data && !loading && !typing && (
          <div className={`w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-md`}>
            <SyntaxHighlight language="swift" style={darcula} wrapLongLines={true}>
              {data}
            </SyntaxHighlight>
          </div>
        )}
      </div>
      <a href="https://instagram.com/bimaaxt/" target="_blank" className={`text-indigo-500 text-xl py-2 px-2 font-bold mt-4 ${darkMode ? 'text-indigo-300' : 'text-indigo-500'}`}>@bimaaxt</a>
    </main>
  );
}

export default App;
