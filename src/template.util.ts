import fs from "fs";
import path from "path";

export default class Template {
  public static replacePlaceholder(
    template: string,
    placeholder: string,
    replacement: string
  ) {
    let result = template;

    const regex = new RegExp(`{{${placeholder}}}`, "g");

    result = result.replace(regex, replacement);

    return result;
  }

  public static copyFolderRecursively(
    folder: string,
    destination: string,
    ignore: string[]
  ) {
    if (!fs.statSync(folder).isDirectory()) {
      fs.copyFileSync(folder, destination);
      console.log("copying completed.");
      return;
    }

    const files = fs.readdirSync(folder);

    for (const file of files) {
      if (ignore.filter((i) => i === file)[0]) continue;

      const sourcePath = path.join(folder, file);
      const destinationPath = path.join(destination, file);

      if (fs.statSync(sourcePath).isDirectory()) {
        fs.mkdirSync(destinationPath, { recursive: true });

        this.copyFolderRecursively(sourcePath, destinationPath, ignore);
        continue;
      }

      fs.copyFileSync(sourcePath, destinationPath);
    }
  }
}
