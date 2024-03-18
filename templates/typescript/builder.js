async function generateBuild() {
  await Bun.build({
    entrypoints: ["./src/server.ts"],
    outdir: "./build",
    target: "bun",
  });
}

generateBuild();
