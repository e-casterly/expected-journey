#!/usr/bin/env node

const path = require("node:path");
const { generateSprites } = require("./index.cjs");

function parseArgs(argv) {
  const args = { inputDir: null, outputDir: null, basename: "ofm" };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];

    if (arg === "--input" && next) {
      args.inputDir = path.resolve(process.cwd(), next);
      i += 1;
      continue;
    }
    if (arg === "--output-dir" && next) {
      args.outputDir = path.resolve(process.cwd(), next);
      i += 1;
      continue;
    }
    if (arg === "--name" && next) {
      args.basename = next;
      i += 1;
    }
  }

  if (!args.inputDir || !args.outputDir) {
    throw new Error(
      "Usage: node src/cli.cjs --input <svg-dir> --output-dir <out-dir> [--name ofm]",
    );
  }

  return args;
}

async function main() {
  const { inputDir, outputDir, basename } = parseArgs(process.argv.slice(2));
  const results = await generateSprites({ inputDir, outputDir, basename });

  for (const result of results) {
    console.log(
      `Generated x${result.pixelRatio}: ${result.iconCount} icons -> ${result.pngPath}, ${result.jsonPath}`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
