# 🛡️ CodeGuard — AI-Powered Code Review System

**CodeGuard** is a web-based application that analyzes source code using Artificial Intelligence and static analysis to help developers identify potential bugs, security vulnerabilities, code quality issues, and design improvements.

The system combines the Gemini API with JavaScript static analysis to provide developers with understandable feedback and actionable suggestions for improving their code.

## ✨ Features

- 🤖 **AI-Powered Code Review:** Uses Google's Gemini API to analyze submitted code.
- 🐛 **Bug Detection:** Identifies potential errors and problematic coding patterns.
- 🔐 **Security Analysis:** Highlights potential security risks.
- 🧹 **Code Quality Checks:** Helps identify readability and maintainability issues.
- 📊 **Severity Classification:** Organizes findings by severity, such as Critical, High, Medium, Low, and Info.
- 🔍 **Search and Filters:** Filter review findings by severity, category, and search keywords.
- ⚡ **Static Analysis:** Uses ESLint rules to detect selected JavaScript issues.
- 💡 **Improvement Suggestions:** Provides explanations, recommendations, and suggested code where available.
- 📱 **Responsive Interface:** Built with React for an interactive user experience.

## 🧰 Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Vite | Frontend development and build tool |
| JavaScript | Application logic |
| CSS | Styling and responsive design |
| Node.js | Backend runtime |
| Express.js | REST API |
| Google Gemini API | AI-based code analysis |
| ESLint | JavaScript static analysis |
| Zod | Data validation |
| Git and GitHub | Version control and project hosting |

## 🏗️ Project Architecture

```text
ai-code-review-system/
│
├── backend/
│   ├── server.js
│   ├── .env
│   ├── package.json
│   └── src/
│       ├── controllers/
│       │   └── reviewController.js
│       ├── prompts/
│       │   └── codeReviewPrompt.js
│       ├── routes/
│       │   └── reviewRoutes.js
│       └── services/
│           ├── llmService.js
│           ├── reviewSchema.js
│           └── staticAnalysisService.js
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## ⚙️ Getting Started

### 1. Prerequisites

Install the following:

- Node.js and npm
- Git
- A Google Gemini API key

### 2. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-code-review-system.git
cd ai-code-review-system
```

Replace `YOUR_USERNAME` with your GitHub username.

### 3. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_supported_gemini_model
FRONTEND_URL=http://localhost:5173
```

Replace the placeholder values with your actual API key and a Gemini model supported by your API account. **Never upload your API key to GitHub.**

Start the backend:

```bash
npm run dev
```

If your project does not have a `dev` script, check `backend/package.json` and use the script defined there.

### 4. Set Up the Frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually:

`http://localhost:5173`

### 5. Verify the Backend

The backend health endpoint is:

```text
http://localhost:5000/api/health
```

The code review endpoint is:

```text
POST http://localhost:5000/api/reviews
```

## 🔄 How It Works

1. The developer enters or submits source code through the frontend.
2. The frontend sends the code, programming language, and selected review categories to the backend.
3. The backend validates the request.
4. JavaScript static analysis checks selected coding issues using ESLint.
5. The Gemini API analyzes the code and generates review findings.
6. The backend combines the available findings.
7. The frontend displays the review summary, severity levels, explanations, recommendations, and suggested code.
8. Developers can search and filter findings to focus on specific issues.

## 🔌 API Overview

### Health Check

`GET /api/health`

Checks whether the backend server is running.

### Submit a Code Review

`POST /api/reviews`

Example request:

```json
{
  "code": "function add(a, b) { return a == b; }",
  "language": "javascript",
  "categories": ["bugs", "clean", "security", "design"]
}
```

The API returns a structured review response containing a summary, findings, and positive observations, depending on the analysis results.

## 🎯 Project Objectives

- Reduce the effort required for manual code review.
- Help developers discover potential coding mistakes earlier.
- Improve code readability and maintainability.
- Raise awareness of common security issues.
- Provide actionable feedback in a simple interface.
- Demonstrate the integration of AI with traditional static analysis.

## 🔮 Future Enhancements

- GitHub repository and pull-request integration.
- Automated code review through GitHub Actions.
- Support for additional programming languages.
- Upload and review complete source-code files.
- Review history and downloadable reports.
- User authentication and saved reviews.
- Improved security rules and configurable review settings.

## ⚠️ Limitations

- AI-generated findings can be inaccurate or incomplete.
- Static analysis currently focuses on JavaScript.
- AI-based review depends on API availability, model support, and usage limits.
- A successful review does not guarantee that code is bug-free or secure.
- Suggested code should be reviewed and tested before use.

## 🔒 Security Notes

- Keep API keys in backend environment variables.
- Never commit `.env` files or expose secrets in frontend code.
- Do not execute untrusted submitted code as part of the review process.
- Treat AI recommendations as suggestions that require developer verification.

## 👨‍💻 Author

**Bhavesh Dahake**

Computer Engineering Student

GitHub: [Add your GitHub profile link](https://github.com/)

## 📄 License

This project is intended for educational and development purposes. Add a license file if you plan to distribute the project under a specific open-source license.
