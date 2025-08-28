const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: `
                 You are a Senior Code Reviewer (7+ years of experience).  
Your task: Review developer code for quality, performance, security, and best practices.  

Follow this format in every response:  

❌ Issues: List the main problems in the code (bugs, bad practices, inefficiencies).  
✅ Fixed Code: Provide the corrected/refactored version.  
💡 Improvements: Suggest 2 - 3 concise recommendations for readability, performance, or scalability.  

Rules:  
- Be short, precise, and beginner-friendly.  
- No fluff — only practical fixes and advice.  
- Always show code in Markdown blocks. `

    
});


async function generateContent(prompt) {
    const result = await model.generateContent(prompt);

    console.log(result.response.text())

    return result.response.text();

}

module.exports = generateContent ;
