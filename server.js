//import express
const express = require("express")

//import cors
const cors = require("cors")

//create app
const app = express()

// fetch PORT details
const PORT = 8000

//to read data from json
app.use(express.urlencoded())
app.use(express.json())
app.use(
  cors({
    origin: "",
    credentials: true,
  })
)

const {
  compileCpp,
  compilePy,
  compileJava,
} = require("./controllers/compiledCodes")
const {
  executeCpp,
  executePy,
  executeJava,
} = require("./controllers/executeCode")

app.post("/compileCpp", compileCpp)
app.post("/compileJava", compileJava)
app.post("/compilePy", compilePy)

app.post("/executeCpp", executeCpp)
app.post("/executeJava", executeJava)
app.post("/executePy", executePy)

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
