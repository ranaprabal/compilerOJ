const { exec } = require("child_process")
const generateFile = require("./generateFile")
const fs = require("fs")
const path = require("path")

const compileCpp = async (req, res) => {
  //fetch code from req body
  const { code } = req.body

  //generate program file
  const filePath = generateFile("cpp", code)

  // create a output folder
  const outputPath = path.join(__dirname, "outputs")

  // check if output folder exists
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true })
  }

  // take the uuid name
  const jobId = path.basename(filePath).split(".")[0]

  //create output path
  const outPath = path.join(outputPath, `${jobId}.out`)

  // new promise

  try {
    await new Promise((resolve, reject) => {
      exec(`g++ ${filePath} -o ${outPath}`, (error, stdout, stderr) => {
        error && reject({ error, stderr })
        stderr && reject(stderr)
        resolve(stdout)
      })
    })

    return res.status(200).json({
      success: true,
      message: "File Compiled successfully",
      outputPath: outPath,
    })
  } catch (err) {
    return res.status(406).json({
      success: false,
      message: "File failed to be compiled",
      error: err.error || err,
      stderr: err.stderr,
    })
  } finally {
    // Clean up: remove the generated source file
    fs.unlink(filePath, (err) => {
      if (err) console.error(`Error deleting file: ${filePath}`, err)
    })
  }
}

const compilePy = async (req, res) => {
  //no need to compile just return the file path here
  //fetch code from req body
  const { code } = req.body

  //generate program file
  const filePath = generateFile("py", code)

  return res.status(200).json({
    success: true,
    message: "File created successfully",
    outputPath: filePath,
  })
}

const compileJava = async (req, res) => {
  //fetch code from req body
  const { code } = req.body

  //generate program file
  const filePath = generateFile("java", code)

  // create a output folder
  const outputPath = path.join(__dirname, "outputs")

  // check if output folder exists
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true })
  }

  // take the uuid name
  const jobId = path.basename(filePath).split(".")[0]

  //create output path
  const outPath = path.join(outputPath, `${jobId}`)

  try {
    //return promise based on the output
    await new Promise((resolve, reject) => {
      exec(`javac ${filePath} -d ${outputPath}`, (error, stdout, stderr) => {
        error && reject({ error, stderr })
        stderr && reject(stderr)
        resolve(stdout)
      })
    })
    const compiledFileName = path.join(outputPath, `${jobId}.class`)
    return res.status(200).json({
      success: true,
      message: "File Compiled successfully",
      outputPath: compiledFileName,
    })
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "File failed to be compiled",
      error: err.error || err,
      stderr: err.stderr,
    })
  } finally {
    //remove the generated source file
    fs.unlink(filePath, (err) => {
      if (err) console.error(`Error deleting file: ${filePath}`, err)
    })
  }
}

module.exports = { compileCpp, compilePy, compileJava }
