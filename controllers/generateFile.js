//Constructs file paths for storing and accessing code files in a platform-independent manner
const path = require("path")

//for file related stuff like writing,storing and removing files
const fs = require("fs")

//for generating unique ids for naming files
const { v4: uuid } = require("uuid")

const dirCodes = path.join(__dirname, "codes")

// if codes directory does not exist
if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true })
}

const getMainClassName = (javaCodeString) => {
  // Regular expression to find the public class definition
  const classNameMatch = javaCodeString.match(/public\s+class\s+(\w+)/)
  if (classNameMatch && classNameMatch[1]) {
    return classNameMatch[1]
  }
  throw new Error("No public class found in the Java code")
}

const generateFile = (format, code) => {
  if (format === "java") {
    try {
      const mainClassName = getMainClassName(code)

      const fileName = `${mainClassName}.${format}`

      // generate file path
      const filePath = path.join(dirCodes, fileName)

      //write the code into the file
      fs.writeFileSync(filePath, code)

      return filePath
    } catch (error) {
      console.log(`could not get the main class name`)
    }
  }

  //generate unique id for the file name
  const jobId = uuid()

  //generate unique file name
  const fileName = `${jobId}.${format}`

  // generate file path
  const filePath = path.join(dirCodes, fileName)

  //write the code into the file
  fs.writeFileSync(filePath, code)

  return filePath
}

module.exports = generateFile
