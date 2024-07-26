const { exec } = require("child_process")
const path = require("path")
const fs = require("fs")

const executeCpp = async (req, res) => {
  const { input, outputFilePath } = req.body

  try {
    const result = await new Promise((resolve, reject) => {
      exec(
        input ? `echo ${input} | ${outputFilePath}` : `${outputFilePath}`,
        { timeout: 2000 },
        (error, stdout, stderr) => {
          if (error) {
            if (error.killed) {
              reject({
                error: "Execution timed out",
                timedOut: true,
                stderr: "",
              })
            } else {
              reject({ error: error.toString(), stderr: stderr.toString() })
            }
          } else if (stderr) {
            reject(stderr.toString())
          } else {
            resolve(stdout)
          }
        }
      )
    })
    return res.status(200).json({
      success: true,
      message: "code executed successfully",
      output: result,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.timedOut
        ? "Execution stopped due to time limit"
        : "could not execute code look for runtime errors if possible",
      error: err.error || err,
      stderr: err.stderr,
    })
  }
}

const executePy = async (req, res) => {
  const { input, outputFilePath } = req.body

  try {
    const result = await new Promise((resolve, reject) => {
      exec(
        input ? `echo ${input} | ${outputFilePath}` : `${outputFilePath}`,
        { timeout: 2000 },
        (error, stdout, stderr) => {
          if (error) {
            if (error.killed) {
              reject({
                error: "Execution timed out",
                timedOut: true,
                stderr: "",
              })
            } else {
              reject({ error: error.toString(), stderr: stderr.toString() })
            }
          } else if (stderr) {
            reject(stderr.toString())
          } else {
            resolve(stdout)
          }
        }
      )
    })
    return res.status(200).json({
      success: true,
      message: "code executed successfully",
      output: result,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.timedOut
        ? "Execution stopped due to time limit"
        : "code execute nhi kr paaye",
      error: err.error || err,
      stderr: err.stderr,
    })
  }
}

const executeJava = async (req, res) => {
  const { input, outputFilePath } = req.body

  // Extract directory and class name
  const outputDir = path.dirname(outputFilePath)
  const className = path.basename(outputFilePath, ".class")

  try {
    const result = await new Promise((resolve, reject) => {
      exec(
        input
          ? `echo ${input} | java -cp "${outputDir}" "${className}"`
          : `java -cp "${outputDir}" "${className}"`,
        { timeout: 2000 },
        (error, stdout, stderr) => {
          if (error) {
            if (error.killed) {
              reject({
                error: "Execution timed out",
                timedOut: true,
                stderr: "",
              })
            } else {
              reject({ error: error.toString(), stderr: stderr.toString() })
            }
          } else if (stderr) {
            reject(stderr.toString())
          } else {
            resolve(stdout)
          }
        }
      )
    })
    return res.status(200).json({
      success: true,
      message: "code executed successfully",
      output: result,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.timedOut
        ? "Execution stopped due to time limit"
        : "code execute nhi kr paaye",
      errorMessage: err.message,
      error: err.error || err,
      stderr: err.stderr,
    })
  }
}

module.exports = { executeCpp, executePy, executeJava }
