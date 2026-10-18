import { useState } from "react";
import "./App.css";

const categories = [
  {
    id: "bugs",
    icon: "⌘",
    title: "Bug Detection",
    description: "Logic errors, edge cases and runtime issues",
    color: "red",
  },
  {
    id: "design",
    icon: "◇",
    title: "Design Weaknesses",
    description: "Poor structure, coupling and maintainability",
    color: "yellow",
  },
  {
    id: "clean",
    icon: "✳",
    title: "Clean Code",
    description: "Readability, duplication and code quality",
    color: "green",
  },
  {
    id: "security",
    icon: "⬡",
    title: "Security Review",
    description: "Vulnerabilities and unsafe code patterns",
    color: "blue",
  },
];

const starterCode = `function divide(a, b) {
  return a / b;
}

console.log(divide(10, 0));`;

function App() {
  const [severityFilter, setSeverityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [reviewResult, setReviewResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(starterCode);
  const [selectedCategories, setSelectedCategories] = useState([
    "bugs",
    "design",
    "clean",
    "security",
  ]);
  const [status, setStatus] = useState("");
  const [isReady, setIsReady] = useState(false);

  function toggleCategory(id) {
    setSelectedCategories((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  }

  async function handleReview() {
    if (!code.trim()) {
      setStatus("Please enter some source code first.");
      setReviewResult(null);
      return;
    }

    if (selectedCategories.length === 0) {
      setStatus("Select at least one review category.");
      setReviewResult(null);
      return;
    }

    setIsLoading(true);
    setStatus("");
    setReviewResult(null);
    setIsReady(false);

    try {
      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
          categories: selectedCategories,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "The review request failed.");
      }

      setReviewResult(data.review);
      setIsReady(true);
      setStatus("AI review completed successfully.");
    } catch (error) {
      setStatus(
        error.message === "Failed to fetch"
          ? "Cannot reach the backend. Check that Express is running on port 5000."
          : error.message || "Unable to complete the review.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("Source code copied to clipboard.");
    } catch {
      setStatus("Clipboard access failed. Please copy manually.");
    }

    const findings = reviewResult?.findings ?? [];

    const filteredFindings = findings.filter((finding) => {
      const matchesSeverity =
        severityFilter === "all" || finding.severity === severityFilter;

      const matchesCategory =
        categoryFilter === "all" || finding.category === categoryFilter;

      const searchText = [
        finding.title,
        finding.explanation,
        finding.recommendation,
        finding.evidence,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.includes(
        searchTerm.trim().toLowerCase(),
      );

      return matchesSeverity && matchesCategory && matchesSearch;
    });

    const severityCounts = {
      critical: findings.filter((f) => f.severity === "critical").length,
      high: findings.filter((f) => f.severity === "high").length,
      medium: findings.filter((f) => f.severity === "medium").length,
      low: findings.filter((f) => f.severity === "low").length,
      info: findings.filter((f) => f.severity === "info").length,
    };
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home">
          <span className="brand-icon">C</span>
          <span>
            <strong>CodeGuard</strong>
            <small>AI CODE REVIEW</small>
          </span>
        </a>

        <div className="nav-label">WORKSPACE</div>

        <a className="nav-item active" href="#review">
          <span>⌘</span> Code Review
        </a>
        <a className="nav-item" href="#categories">
          <span>◈</span> Analysis Modules
        </a>
        <a className="nav-item" href="#history">
          <span>◷</span> Review History
        </a>

        <div className="sidebar-bottom">
          <div className="status-dot" />
          <span>Frontend development</span>
          <small>Step 2 of project setup</small>
        </div>
      </aside>

      <main className="main-content" id="home">
        <header className="topbar">
          <div>
            <div className="breadcrumb">Workspace / Code Review</div>
            <div className="page-label">AI-powered developer tools</div>
          </div>

          <div className="user-chip">
            <span className="avatar">D</span>
            <span>Developer</span>
          </div>
        </header>

        <section className="welcome-section" id="review">
          <div>
            <div className="eyebrow">
              <span className="live-dot" />
              INTELLIGENT CODE ANALYSIS
            </div>

            <h1>Review your code.</h1>
            <p className="welcome-description">
              Find bugs, improve design, write cleaner code, and identify
              security risks — all in one place.
            </p>
          </div>

          <div className="model-chip">
            <span className="model-star">✦</span>
            Gemini AI <span className="model-divider">/</span> LLM
          </div>
        </section>

        <section className="category-section" id="categories">
          <div className="section-heading">
            <div>
              <h2>Review modules</h2>
              <p>Choose what you want your code reviewed for.</p>
            </div>

            <span className="selection-count">
              {selectedCategories.length} of 4 selected
            </span>
          </div>

          <div className="category-grid">
            {categories.map((category) => {
              const selected = selectedCategories.includes(category.id);

              return (
                <button
                  type="button"
                  key={category.id}
                  className={`category-card ${category.color} ${
                    selected ? "selected" : ""
                  }`}
                  onClick={() => toggleCategory(category.id)}
                  aria-pressed={selected}
                >
                  <div className="category-top">
                    <span className="category-icon">{category.icon}</span>
                    <span className="check-mark">{selected ? "✓" : "+"}</span>
                  </div>

                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="editor-panel">
          <div className="editor-heading">
            <div>
              <h2>Source code</h2>
              <p>Paste your code or edit the sample below.</p>
            </div>

            <label className="language-control">
              <span>LANGUAGE</span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="csharp">C#</option>
                <option value="php">PHP</option>
                <option value="go">Go</option>
              </select>
            </label>
          </div>

          <div className="editor-toolbar">
            <div className="window-dots">
              <span />
              <span />
              <span />
              <span className="filename">
                main.
                {language === "cpp"
                  ? "cpp"
                  : language === "csharp"
                    ? "cs"
                    : language === "typescript"
                      ? "ts"
                      : language === "python"
                        ? "py"
                        : language === "java"
                          ? "java"
                          : language === "php"
                            ? "php"
                            : language === "go"
                              ? "go"
                              : "js"}
              </span>
            </div>

            <button type="button" className="copy-button" onClick={copyCode}>
              Copy code
            </button>
          </div>

          <div className="code-editor">
            <div className="line-numbers" aria-hidden="true">
              {Array.from(
                { length: Math.max(1, code.split("\n").length) },
                (_, index) => (
                  <span key={index}>{index + 1}</span>
                ),
              )}
            </div>

            <textarea
              aria-label="Source code input"
              spellCheck="false"
              autoCapitalize="off"
              autoCorrect="off"
              value={code}
              onChange={(event) => {
                setCode(event.target.value);
                setIsReady(false);
                setStatus("");
              }}
              placeholder="Paste your source code here..."
            />
          </div>

          <div className="editor-footer">
            <span>{code.length} characters</span>
            <span>{code.split("\n").length} lines</span>
            <span>Language: {language}</span>
          </div>

          <div className="review-actions">
            <div className="review-note">
              <span className="info-icon">i</span>
              AI findings require verification.
            </div>

            <button
              type="button"
              className="review-button"
              onClick={handleReview}
              disabled={isLoading}
            >
              {isLoading ? "Analyzing code..." : "✧ Review Code →"}
            </button>
          </div>

          {status && (
            <div
              className={`status-message ${isReady ? "ready" : "notice"}`}
              role="status"
            >
              <span>{isReady ? "✓" : "i"}</span>
              {status}
            </div>
          )}
        </section>

        {reviewResult && (
          <section className="results-panel" aria-live="polite">
            <div className="results-heading">
              <div>
                <div className="eyebrow">AI ANALYSIS COMPLETE</div>
                <h2>Code review results</h2>
                <p>{reviewResult.summary}</p>
              </div>

              <span className="results-count">
                {reviewResult.findings.length} findings
              </span>
            </div>

            <div className="results-stats">
              {[
                { id: "bugs", label: "Bugs" },
                { id: "design", label: "Design" },
                { id: "clean", label: "Clean Code" },
                { id: "security", label: "Security" },
              ].map((category) => (
                <div className="result-stat" key={category.id}>
                  <span>{category.label}</span>
                  <strong>
                    {
                      reviewResult.findings.filter(
                        (item) => item.category === category.id,
                      ).length
                    }
                  </strong>
                </div>
              ))}
            </div>

            {reviewResult.findings.length === 0 ? (
              <div className="empty-results">
                <h3>No issues reported</h3>
                <p>
                  The AI did not identify actionable issues in the selected
                  categories. This does not guarantee that the code is bug-free
                  or secure.
                </p>
              </div>
            ) : (
              <div className="findings-list">
                {reviewResult.findings.map((finding, index) => (
                  <article
                    className="finding-card"
                    key={`${finding.category}-${index}`}
                  >
                    <div className="finding-top">
                      <span className={`severity ${finding.severity}`}>
                        {finding.severity.toUpperCase()}
                      </span>

                      <span className="finding-category">
                        {finding.category}
                      </span>

                      <span className="finding-line">
                        {finding.line === null
                          ? "Line not confirmed"
                          : `Line ${finding.line}`}
                      </span>
                    </div>

                    <h3>{finding.title}</h3>
                    <p>{finding.explanation}</p>

                    <div className="finding-detail">
                      <strong>Evidence</strong>
                      <pre>{finding.evidence}</pre>
                    </div>

                    <div className="finding-detail">
                      <strong>Recommended fix</strong>
                      <p>{finding.recommendation}</p>
                    </div>

                    {finding.suggestedCode && (
                      <div className="finding-detail">
                        <strong>Suggested code</strong>
                        <pre className="suggested-code">
                          {finding.suggestedCode}
                        </pre>

                        <button
                          type="button"
                          className="copy-button"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(
                                finding.suggestedCode,
                              );
                              setStatus("Suggested code copied.");
                            } catch {
                              setStatus("Could not copy suggested code.");
                            }
                          }}
                        >
                          Copy suggested code
                        </button>
                      </div>
                    )}

                    <div className="confidence">
                      AI-reported confidence:{" "}
                      {Math.round(finding.confidence * 100)}%
                    </div>
                  </article>
                ))}
              </div>
            )}

            {reviewResult.positiveObservations.length > 0 && (
              <div className="positive-observations">
                <h3>Good practices identified</h3>
                <ul>
                  {reviewResult.positiveObservations.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="review-disclaimer">
              AI findings may be incorrect or incomplete. Verify suggestions
              before changing or deploying your code.
            </p>
          </section>
        )}

        <footer className="page-footer" id="history">
          <span>CodeGuard AI · Developer workspace</span>
          <span>Built for better, safer code.</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
