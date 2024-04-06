import dotenv from "dotenv";
import OpenAI from "openai";
import express from "express";
import cors from "cors";
dotenv.config();
// Authenticated with api key
const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_SECRET_KEY,
});
const app = express();
//! passing incoming json data
app.use(express.json());
const PORT = process.env.PORT || 9090;

//! cors
const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174"],
};
app.use(cors(corsOptions));

//! global variable to hold the conservation history
let conservationHistory = [
    { role: "system", content: "You are a helpful assistant" },
];

//! routes
app.post("/ask", async (req, res) => {
    const userMessage = req.body.message;
    //! update the conservation history with the user's message
    conservationHistory.push({ role: "user", content: userMessage });
    try {
        const completion = await openai.chat.completions.create({
            messages: conservationHistory,
            model: "gpt-3.5-turbo",
        });
        //! extract the response
        const botResponse = completion.choices[0].message.content;
        //! send the response
        res.json({ message: botResponse });
    } catch (err) {
        res.status(500).send("error generating response from OpenAI");
    }
});

//! Run the server
app.listen(PORT, console.log(`server is ruunig on port ${PORT}...`));