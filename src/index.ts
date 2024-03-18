#!/usr/bin/env bun

import process from "process";
import InitCommand from "./init-command";

const args: string[] = process.argv;

const commands = ["init"];

const firstCommand = args[2];

if (args.length < 3 || !commands.filter((c) => c === firstCommand)[0]) {
  console.log("Command not matched \n");
  console.log("Usage: express-template", ...commands, "\n");
  process.exit();
}

const projectName = args
  .filter((a) => a.includes("--name"))[0]
  ?.split("--name=")[1];

if (firstCommand === "init") {
  if (!projectName) {
    console.log("--name is required", "\n");
    process.exit();
  }

  const init = new InitCommand();
  init.init(projectName).then(() => {
    process.exit(0);
  });
}
