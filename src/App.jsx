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
import { Routes, Route, Link } from "react-router-dom"; // ✅ removed extra BrowserRouter import
import axios from "axios";
import "./App.css";

function HomePage() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [fixedCode, setFixedCode] = useState("");
  const [language, setLanguage] = useState("javascript");

  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  // --- Review Code ---
  async function reviewCode() {
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", { code });
      setReview(response.data);
      setFixedCode("");
    } catch (err) {
      console.error(err);
      alert("Review failed. Check backend logs.");
    }
  }

  // --- Auto Fix Code ---
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
    <div className="content">
      {/* Left Section - Editor */}
      <div className="left-section">
        <div className="language-select">
          <label>Select Language: </label>
          <select onChange={(e) => setLanguage(e.target.value)} value={language}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>

        <div className="code-editor">
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
              height: "400px",
              width: "100%",
              background: "#1e1e1e",
              color: "#fff",
              overflow: "auto",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              maxWidth: "100%",
            }}
          />
        </div>

        <div className="buttons">
          
          <button onClick={handleAutoFix} className="autofix-btn">Auto Fix</button>
        </div>
      </div>

      {/* Right Section - Suggestions */}
      <div className="right-section">
        <h2>AI Suggestions</h2>
        {review && (
          <div className="review-box">
            
            <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
          </div>
        )}
        {fixedCode && (
          <div className="autofix-box">
            <h3>Auto Fixed Code</h3>
            <pre><code>{fixedCode}</code></pre>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <main className="container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-left">BugBuster</div>
        <div className="nav-right">
          

        </div>
      </nav>

      {/* Define Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Add more routes here */}
      </Routes>

      <footer className="footer">
        <p>© {new Date().getFullYear()} BugBuster | Built with ❤️ by Pavittr</p>
      </footer>
    </main>
  );
}

export default App;

