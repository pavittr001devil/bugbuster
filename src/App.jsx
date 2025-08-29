import { useState, useEffect } from "react"; 
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import "./App.css"; // Optional if you still need custom CSS

function HomePage() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [fixedCode, setFixedCode] = useState("");
  const [language, setLanguage] = useState("javascript");

  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  const reviewCode = async () => {
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", { code });
      setReview(response.data);
      setFixedCode("");
    } catch (err) {
      console.error(err);
      alert("Review failed. Check backend logs.");
    }
  };

  const handleAutoFix = async () => {
    try {
      const res = await axios.post("http://localhost:3000/ai/autofix", { code });
      const fixed = res.data.fixedcode;
      const cleanCode = fixed.replace(/```[a-z]*\n?/g, "").replace(/```/g, "");
      setFixedCode(cleanCode);
    } catch (err) {
      console.error(err);
      alert("Auto-fix failed. Check backend logs.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {/* Left Section - Editor */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label className="font-semibold">Select Language:</label>
          <select
            className="border rounded px-2 py-1"
            onChange={(e) => setLanguage(e.target.value)}
            value={language}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>

        <Editor
          value={code}
          onValueChange={setCode}
          highlight={(code) => {
            const grammar = Prism.languages[language] || Prism.languages.javascript;
            return Prism.highlight(code, grammar, language);
          }}
          padding={10}
          style={{
            fontFamily: '"Fira Code", monospace',
            fontSize: 16,
            border: "1px solid #ddd",
            borderRadius: "8px",
            height: "300px",
            width: "100%",
            background: "#1e1e1e",
            color: "#fff",
            overflow: "auto",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
        />

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleAutoFix}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Auto Fix
          </button>
          <button
            onClick={reviewCode}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Review Code
          </button>
        </div>
      </div>

      {/* Right Section - Suggestions */}
      <div className="flex-1 flex flex-col gap-4">
        <h2 className="text-lg font-bold">AI Suggestions</h2>

        {review && (
          <div className="p-2 border rounded bg-gray-900 text-white overflow-auto max-h-64">
            <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
          </div>
        )}

        {fixedCode && (
          <div className="p-2 border rounded bg-gray-900 text-white overflow-auto max-h-64">
            <h3 className="font-semibold mb-2">Auto Fixed Code</h3>
            <pre><code>{fixedCode}</code></pre>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-gray-800 text-white px-4 py-2">
        <div className="font-bold text-xl">BugBuster</div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>

      {/* Footer */}
      <footer className="mt-auto bg-gray-800 text-white text-center py-2">
        © {new Date().getFullYear()} BugBuster | Built with ❤️ by Pavittr
      </footer>
    </main>
  );
}

export default App;
