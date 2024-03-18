import { exec } from "child_process";
import fs from "fs";
import inquirer from "inquirer";
import path from "path";
import prettier from "prettier";
import Template from "./template.util";

export type ProjectInfo = {
  "project-name": string;
  language: string;
};

export default class InitCommand {
  projectName = "";

  async askProjectInfo(): Promise<ProjectInfo> {
    const answers = await inquirer.prompt([
      {
        name: "language",
        message: "select language :",
        choices: ["typescript"],
        type: "list",
      },
    ]);

    return { ...answers, "project-name": this.projectName };
  }

  generatePackageJson(info: ProjectInfo) {
    const packageJsonPath = path.join(
      __dirname,
      "../templates/",
      info.language,
      "package.json"
    );

    const packageJsonBuffer = fs.readFileSync(packageJsonPath);
    const packageJsonString = packageJsonBuffer.toString();

    const packageJson = JSON.parse(packageJsonString);

    packageJson.name = info["project-name"];

    return JSON.stringify(packageJson);
  }

  async generateProject(info: ProjectInfo) {
    const templateDir = path.join(__dirname, "../templates", info.language);

    const projectPath = info["project-name"];

    if (fs.existsSync(projectPath)) {
      console.log(`${projectPath} already exists.`);
      return;
    }

    console.log(`generating ${info.language} project...`);

    fs.mkdirSync(projectPath, { recursive: true });

    Template.copyFolderRecursively(templateDir, projectPath, ["node_modules"]);

    const packageJson = this.generatePackageJson(info);

    const packageJsonPretty = await prettier.format(packageJson, {
      parser: "json",
    });

    fs.writeFileSync(
      path.join(projectPath, "./package.json"),
      packageJsonPretty
    );
  }

  async init(projectName: string) {
    this.projectName = projectName;
    const info = await this.askProjectInfo();
    await this.generateProject(info);
  }
}
