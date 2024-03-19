import fs from "fs";
import inquirer from "inquirer";
import path from "path";
import prettier from "prettier";
import Template from "./template.util";

export type ProjectInfo = {
  projectName: string;
  language: string;
};

export default class InitCommand {
  async askProjectInfo(): Promise<ProjectInfo> {
    const answers = await inquirer.prompt([
      {
        name: "projectName",
        message: "Project name :",
      },
      {
        name: "language",
        message: "select language :",
        choices: ["typescript"],
        type: "list",
      },
    ]);

    return { ...answers };
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

    packageJson.name = info.projectName;

    return JSON.stringify(packageJson);
  }

  async generateProject(info: ProjectInfo) {
    const templateDir = path.join(__dirname, "../templates", info.language);

    const projectPath = info.projectName;

    if (fs.existsSync(projectPath)) {
      console.error(`\nerror: ${projectPath} already exists 😬😬.\n`);
      process.exit();
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

  async init() {
    const info = await this.askProjectInfo();
    await this.generateProject(info);

    console.log("Done!😎 Happy coding😍😍😍. \n");

    console.log(`cd ${info.projectName} and run "bun install" to get start.\n`);
  }
}
