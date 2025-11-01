async function abhiAi(message) {
  if (typeof message !== "string" || !message.trim()) {
    throw new Error("Invalid message: must be a non-empty string");
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000", // Full URL; update for production
          "X-Title": "Your Next.js App", // Optional
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o",
          messages: [
            {
              role: "user",
              content: message, // Always a string here
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API request failed: ${response.status} ${response.statusText} - ${
          errorData.error?.message || "Unknown error"
        }`
      );
    }

    const data = await response.json();
    // Extract just the assistant's reply string (handles the structure)
    const assistantContent = data.choices?.[0]?.message?.content;
    if (!assistantContent) {
      throw new Error("Invalid response from OpenRouter: no content found");
    }
    return assistantContent; // Return string for easy DB storage
  } catch (error) {
    console.error("Error calling OpenRouter:", error);
    throw new Error(`AI response failed: ${error.message}`);
  }
}

export default abhiAi;

// import OpenAI from "openai";
// const abhiAi = async (message) => {
//   const openai = new OpenAI({
//     headers: {
//       Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//     },
//     baseURL: "https://openrouter.ai/api/v1",
//     apiKey: process.env.OPENROUTER_API_KEY,
//   });

//   try {
//     const result = await openai.chat.completions.create({
//       model: "openai/gpt-4o",
//       messages: [
//         {
//           role: "user",
//           content: message,
//         },
//       ],
//     });

//     return result.text();
//   } catch (err) {
//     console.error("API Error:", err);
//     throw new Error("Failed to get AI response");
//   }
// };

// export default abhiAi;
