const reviewSchema = {
    type: "OBJECT",
    properties: {
        summary: {
            type: "STRING",
            description: "A concise summary of the review",
        },
        findings: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    category: {
                        type: "STRING",
                        enum: ["bugs", "design", "clean", "security"],
                    },
                    title: {
                        type: "STRING",
                    },
                    severity: {
                        type: "STRING",
                        enum: ["critical", "high", "medium", "low", "info"],
                    },
                    line: {
                        type: "INTEGER",
                        nullable: true,
                        description: "1-based source line, or null if unknown",
                    },
                    evidence: {
                        type: "STRING",
                    },
                    explanation: {
                        type: "STRING",
                    },
                    recommendation: {
                        type: "STRING",
                    },
                    suggestedCode: {
                        type: "STRING",
                    },
                    confidence: {
                        type: "NUMBER",
                    },
                },
                required: [
                    "category",
                    "title",
                    "severity",
                    "line",
                    "evidence",
                    "explanation",
                    "recommendation",
                    "suggestedCode",
                    "confidence",
                ],
            },
        },
        positiveObservations: {
            type: "ARRAY",
            items: { type: "STRING" },
        },
    },
    required: ["summary", "findings", "positiveObservations"],
};

module.exports = { reviewSchema };