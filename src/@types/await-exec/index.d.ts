interface IEndpoint {
  stdout: string;
  stderr: string;
}

declare module "await-exec" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function exec(cmd: string, opt: any | Error): Promise<IEndpoint>;
  namespace exec {}

  export = exec;
}
