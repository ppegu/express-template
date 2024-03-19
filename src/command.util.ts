import { exec } from "child_process";

export function execCommand(command: string): Promise<any> {
  return new Promise((rs, rj) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        rj(err);
        return;
      }
      if (stderr) {
        console.log("stderr:", stderr);
      }
      if (stdout) console.log(stdout);
      // rs(stdout);
    });
  });
}
