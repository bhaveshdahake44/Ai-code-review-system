
const { ESLint } = require("eslint");

async function analyzeJavaScript(code) {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [
      {
        languageOptions: {
          ecmaVersion: "latest",
          sourceType: "module",
          globals: {
            console: "readonly",
            require: "readonly",
            module: "readonly",
            exports: "readonly",
            process: "readonly",
            window: "readonly",
            document: "readonly",
            fetch: "readonly",
            navigator: "readonly",
            alert: "readonly",
            localStorage: "readonly",
            setTimeout: "readonly",
            clearTimeout: "readonly",
          },
        },
        rules: {
          "no-undef": "error",
          "no-unreachable": "error",
          "no-constant-condition": "warn",
          "no-unused-vars": "warn",
          "no-var": "warn",
          "prefer-const": "warn",
          eqeqeq: "warn",
          curly: "warn",
        },
      },
    ],
  });

  const results = await eslint.lintText(code, {
    filePath: "reviewed-code.js",
  });

  const findings = [];

  for (const result of results) {
    for (const message of result.messages) {
      const rule = message.ruleId || "syntax-error";
      const isBug = [
        "no-undef",
        "no-unreachable",
        "no-constant-condition",
        "syntax-error",
      ].includes(rule);

      const sourceLines = code.split("\n");
      const line = message.line || null;

      findings.push({
        category: isBug ? "bugs" : "clean",
        title: message.message,
        severity:
          message.severity === 2 || message.fatal
            ? "high"
            : "low",
        line,
        evidence:
          line && sourceLines[line - 1]
            ? sourceLines[line - 1].trim()
            : "",
        explanation: `Static analysis rule: ${rule}. ${message.message}`,
        recommendation: message.fatal
          ? "Correct the syntax error before relying on further analysis."
          : `Review and fix the issue reported by the ${rule} rule.`,
        suggestedCode: "",
        confidence: 0.98,
      });
    }
  }

  return findings;
}

module.exports = { analyzeJavaScript };
