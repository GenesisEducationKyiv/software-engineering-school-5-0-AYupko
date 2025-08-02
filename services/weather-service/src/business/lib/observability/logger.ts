import * as fs from "fs";
import * as path from "path";

export function logToFile(message: string, fileName = "weather.log") {
  const logFilePath = path.resolve(__dirname, "../../logs", fileName);
  const logDir = path.dirname(logFilePath);

  try {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    fs.appendFileSync(logFilePath, message + "\n", "utf8");
  } catch (err) {
    console.error("Failed to write to log file:", err);
  }
}
