import { Router } from "express";

import fs from "fs";
import path from "path";

const router = Router();

function registerRoutes(folder: string) {
  const files = fs.readdirSync(folder);

  for (const file of files) {
    const fullPath = path.join(folder, file);
    const isDir = fs.statSync(fullPath).isDirectory();
    if (isDir) {
      registerRoutes(fullPath);
      continue;
    }
    if (!file.includes(".route")) continue;
    const workDir = path.join(__dirname);
    const folderPath = folder.replace(workDir, ".") + "/";
    const filePath = folderPath + file.replace(".ts", "");

    const routePath = filePath
      .replace("./", "/")
      .replace("index.route", "")
      .replace(".route", "");

    router.use(routePath, require(filePath).default);
  }
}

registerRoutes(path.join(__dirname));

export default router;
