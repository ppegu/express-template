#!/usr/bin/env bun

import process from "process";
import InitCommand from "./init-command";

const args: string[] = process.argv;

const commands = ["init"];

const firstCommand = args[2];

if (args.length < 3 || !commands.filter((c) => c === firstCommand)[0]) {
  console.log("Command not matched 😇😇\n");
  console.log("Usage: express-template", ...commands, "\n");
  process.exit();
}

if (firstCommand === "init") {
  const init = new InitCommand();
  init.init().then(() => {
    process.exit(0);
  });
}
