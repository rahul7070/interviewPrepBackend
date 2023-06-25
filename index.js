const express = require("express");
const {connection} = require("./db");
const cors = require("cors")
const { userRouter } = require("./routes/user.route");
const cookieParser = require("cookie-parser");
// const { questionRouter } = require("./routes/question.route");
require("dotenv").config();
require('isomorphic-fetch');

const app = express();
app.use(cors());

app.get("/", (req, res)=>{
    res.send("hello world")
})

app.use(cors())
app.use(express.json());
app.use(cookieParser())
app.use("/users", userRouter)
// app.use("/question", questionRouter)

app.post("/completions",async (req, res)=>{
    try {
        const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
            method: "POST",
            headers:{
                "Authorization": `Bearer ${process.env.API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content:req.body.message}],
                max_tokens:100,
                temperature: 0
            })
        })
        const data = await response.json()
        res.send(data)
    } catch (error) {
        console.log(error)
    }
})

app.listen(process.env.PORT, async ()=>{
    try {
        await connection;
        console.log(`connection established with ${process.env.PORT}`)
    } catch (error) {
        console.log(error)
    }
})