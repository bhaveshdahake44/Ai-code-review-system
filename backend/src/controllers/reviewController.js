const { z } = require("zod");
const { reviewCode } = require("../services/llmService");
const { analyzeJavaScript } = require("../services/staticAnalysisService");

const RequestSchema = z.object({
  code: z.string().min(1).max(20000),
  language: z.enum([
    "javascript",
    "typescript",
    "python",
    "java",
    "cpp",
    "csharp",
    "php",
    "go",
  ]),
  categories: z
    .array(z.enum(["bugs", "design", "clean", "security"]))
    .min(1)
    .max(4),
});

async function createReview(req, res) {
  const validation = RequestSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid review input. Check the code, language, and categories.",
    });
  }

  const { code, language, categories } = validation.data;

  if (!code.trim()) {
    return res.status(400).json({
      success: false,
      message: "Source code cannot be empty.",
    });
  }

  try {
    const review = await reviewCode({
      code,
      language,
      categories: [...new Set(categories)],
    });
    // Run static analysis for JavaScript source code.
    if (language === "javascript") {
      try {
        const staticFindings = await analyzeJavaScript(code);

        // Include only static findings from selected categories.
        const filteredStaticFindings = staticFindings.filter(
          (finding) => categories.includes(finding.category)
        );

        // Combine static findings with Gemini findings.
        review.findings = [
          ...filteredStaticFindings,
          ...review.findings,
        ];
      } catch (error) {
        console.error("Static analysis failed:", error.message);
        // Gemini results can still be returned if ESLint fails.
      }
    }

    return res.json({
      success: true,
      review,
    });
  } catch (error) {
    // Log the technical error only on the server.
    console.error("Code review failed:", error.message);

    const message = String(error.message || "").toLowerCase();

    if (
      message.includes("429") ||
      message.includes("resource_exhausted") ||
      message.includes("rate limit")
    ) {
      return res.status(429).json({
        success: false,
        message: "AI request limit reached. Please try again later.",
      });
    }

    if (
      message.includes("api key") ||
      message.includes("unauthenticated") ||
      message.includes("permission denied")
    ) {
      return res.status(502).json({
        success: false,
        message: "The AI service configuration needs to be checked.",
      });
    }

    return res.status(502).json({
      success: false,
      message: "The AI review failed. Check your backend configuration and try again.",
    });
  }
}

module.exports = { createReview };