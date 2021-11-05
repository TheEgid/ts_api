// import * as exec from "await-exec";
import * as path from "path";

interface Endpoint {
  stdout: string;
  stderr: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-var-requires
const exec = require("await-exec") as (cmd: string, opt: any | Error) => Promise<Endpoint>;

const wrapperPython = async (commandPy: string) => {
  return await exec(commandPy, (error: Error) => {
    if (error) {
      console.error(`exec error: ${error as unknown as string}`);
    }
  });
};

const fileProcess: (Filepath: string) => Promise<Endpoint> = async (Filepath: string) => {
  const commandPython =
    "python " +
    path.join(__dirname, "../..", "py_child", "uploads_main.py") +
    ` --pdf_filepath=${Filepath}`;
  return await wrapperPython(commandPython);
};

export default fileProcess;
