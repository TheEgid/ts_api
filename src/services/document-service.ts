import exec from "await-exec";
import * as path from "path";

interface IEndpoint {
  stdout: string;
  stderr: string;
}

const wrapperPython: (commandPy: string) => Promise<IEndpoint> = async (commandPy: string) => {
  return await exec(commandPy, (error: Error) => {
    if (error) {
      console.error(`exec error: ${error as unknown as string}`);
    }
  });
};

const fileProcess: (filePath: string) => Promise<IEndpoint> = async (filePath: string) => {
  const commandPath = path.join(__dirname, "../..", "py_child", "uploads_main.py");
  const commandPython = `python ${commandPath} ${filePath}`;
  return await wrapperPython(commandPython);
};

export default fileProcess;
