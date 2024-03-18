import fs from "fs";
import path from "path";

const workDir = path.join(__dirname);

const filePaths: string[] = [];

/**write output router path */
function writeRouteContent() {
  const stream = fs.createWriteStream(
    path.join(workDir, "./index.production.ts"),
  );

  stream.write(`import { Router } from "express";\n\n`);
  stream.write(`const router = Router();\n\n`);

  filePaths.forEach((filePath) => {
    const routePath = filePath
      .replace("./", "/")
      .replace("index.route", "")
      .replace(".route", "");
    stream.write(
      `router.use("${routePath}", require("${filePath}").default);\n`,
    );
  });

  stream.write(`\nexport default router;`);
  stream.end();
}

function registerFilePaths(folder: string) {
  const files = fs.readdirSync(folder);

  for (const file of files) {
    const isDir = fs.statSync(path.join(folder, file)).isDirectory();

    if (isDir) {
      registerFilePaths(path.join(folder, file));
      continue;
    }

    if (!file.includes(".route")) continue;

    const folderPath = folder.replace(workDir, ".") + "/";

    const filePath = folderPath + file.replace(".ts", "");

    filePaths.push(filePath);
  }
}

registerFilePaths(workDir);
writeRouteContent();
