const fs = require("node:fs/promises");
const path = require("node:path");

let Resvg;
let sharp;
let potpack;
try {
  ({ Resvg } = require("@resvg/resvg-js"));
  sharp = require("sharp");
  potpack = require("potpack");
  if (typeof potpack !== "function" && typeof potpack?.default === "function") {
    potpack = potpack.default;
  }
} catch (error) {
  console.error(
    "Missing dependencies. Install workspace dependencies with: pnpm install",
  );
  throw error;
}

function parseNumericLength(value) {
  if (!value) return null;
  const normalized = value.trim();
  if (!normalized || normalized.endsWith("%")) return null;
  const match = normalized.match(/^([+-]?\d*\.?\d+)(px)?$/i);
  if (!match) return null;
  const parsed = Number.parseFloat(match[1]);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

function extractSvgSize(svgContent, fileName) {
  const svgTagMatch = svgContent.match(/<svg\b[^>]*>/i);
  if (!svgTagMatch) throw new Error(`Invalid SVG (missing <svg>): ${fileName}`);

  const svgTag = svgTagMatch[0];
  const widthMatch = svgTag.match(/\bwidth=["']([^"']+)["']/i);
  const heightMatch = svgTag.match(/\bheight=["']([^"']+)["']/i);
  const widthAttr = parseNumericLength(widthMatch?.[1] ?? null);
  const heightAttr = parseNumericLength(heightMatch?.[1] ?? null);

  if (widthAttr && heightAttr) {
    return {
      width: Math.max(1, Math.round(widthAttr)),
      height: Math.max(1, Math.round(heightAttr)),
    };
  }

  const viewBoxMatch = svgTag.match(/\bviewBox=["']([^"']+)["']/i);
  if (viewBoxMatch) {
    const parts = viewBoxMatch[1]
      .trim()
      .split(/[\s,]+/)
      .map((part) => Number.parseFloat(part));
    if (parts.length === 4 && parts.every(Number.isFinite)) {
      const [, , vbWidth, vbHeight] = parts;
      if (vbWidth > 0 && vbHeight > 0) {
        return {
          width: Math.max(1, Math.round(vbWidth)),
          height: Math.max(1, Math.round(vbHeight)),
        };
      }
    }
  }

  throw new Error(
    `Cannot determine SVG size for ${fileName}. Add width/height or a valid viewBox.`,
  );
}

async function loadSvgIcons(inputDir) {
  const entries = await fs.readdir(inputDir, { withFileTypes: true });
  const svgFiles = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".svg"))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "en"));

  if (svgFiles.length === 0) {
    throw new Error(`No SVG files found in ${inputDir}`);
  }

  return Promise.all(
    svgFiles.map(async (fileName) => {
      const filePath = path.join(inputDir, fileName);
      const svg = await fs.readFile(filePath);
      const size = extractSvgSize(svg.toString("utf8"), fileName);
      return {
        id: path.basename(fileName, ".svg"),
        svg,
        width: size.width,
        height: size.height,
      };
    }),
  );
}

function rasterizeSvg(svgBuffer, targetWidth, targetHeight) {
  const resvg = new Resvg(svgBuffer);
  const rendered = resvg.render();
  const pngBuffer = rendered.asPng();

  return sharp(pngBuffer)
    .resize(targetWidth, targetHeight, {
      fit: "fill",
      kernel: sharp.kernel.nearest,
    })
    .png()
    .toBuffer();
}

async function buildSpriteFiles({ icons, pixelRatio, outputDir, basename }) {
  const suffix = pixelRatio === 1 ? "" : "@2x";
  const pngPath = path.join(outputDir, `${basename}${suffix}.png`);
  const jsonPath = path.join(outputDir, `${basename}${suffix}.json`);

  const renderedIcons = await Promise.all(
    icons.map(async (icon) => {
      const width = icon.width * pixelRatio;
      const height = icon.height * pixelRatio;
      const png = await rasterizeSvg(icon.svg, width, height);
      return {
        id: icon.id,
        width,
        height,
        pixelRatio,
        png,
        w: width,
        h: height,
      };
    }),
  );

  const packBoxes = renderedIcons.map((icon) => ({ ...icon }));
  const packed = potpack(packBoxes);
  const atlasWidth = Math.max(1, packed.w || 0);
  const atlasHeight = Math.max(1, packed.h || 0);

  const imageBuffer = await sharp({
    create: {
      width: atlasWidth,
      height: atlasHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(
      packBoxes.map((box) => ({
        input: box.png,
        left: box.x,
        top: box.y,
      })),
    )
    .png()
    .toBuffer();

  const packedById = new Map(packBoxes.map((box) => [box.id, box]));
  const dataLayout = {};
  for (const icon of icons) {
    const box = packedById.get(icon.id);
    dataLayout[box.id] = {
      width: box.width,
      height: box.height,
      x: box.x,
      y: box.y,
      pixelRatio: box.pixelRatio,
    };
  }

  await Promise.all([
    fs.writeFile(pngPath, imageBuffer),
    fs.writeFile(jsonPath, `${JSON.stringify(dataLayout, null, 2)}\n`, "utf8"),
  ]);

  return { pngPath, jsonPath, iconCount: icons.length, pixelRatio };
}

async function generateSprites({ inputDir, outputDir, basename = "ofm" }) {
  await fs.mkdir(outputDir, { recursive: true });
  const icons = await loadSvgIcons(inputDir);
  return Promise.all([
    buildSpriteFiles({ icons, pixelRatio: 1, outputDir, basename }),
    buildSpriteFiles({ icons, pixelRatio: 2, outputDir, basename }),
  ]);
}

module.exports = { generateSprites };
