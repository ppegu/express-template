import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import Template from "./template.util";

export type ProjectInfo = {
  "project-name": string;
  language: string;
};

export default class InitCommand {
  async askProjectInfo(): Promise<ProjectInfo> {
    const answers = await inquirer.prompt([
      {
        name: "project-name",
        message: "Project name :",
      },
      {
        name: "language",
        message: "select language :",
        choices: ["typescript"],
        type: "list",
      },
    ]);

    return answers;
  }

  generatePackageJson(info: ProjectInfo) {
    const packageJsonBuffer = fs.readFileSync(
      path.join(
        __dirname,
        "../templates/",
        info.language,
        "package.json.template"
      )
    );

    const packageJsonString = packageJsonBuffer.toString();

    const packageJson = Template.replacePlaceholder(
      packageJsonString,
      "project-name",
      info["project-name"]
    );

    return packageJson;
  }

  async generateProject(info: ProjectInfo) {}

  async init() {
    const info = await this.askProjectInfo();

    await this.generateProject(info);
  }
}
