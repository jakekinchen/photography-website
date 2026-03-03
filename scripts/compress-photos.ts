import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const PHOTO_MAX_WIDTH = Number(process.env.PHOTO_MAX_WIDTH ?? 2560);
const JPEG_QUALITY = Number(process.env.PHOTO_JPEG_QUALITY ?? 78);
const PNG_QUALITY = Number(process.env.PHOTO_PNG_QUALITY ?? 80);
const WEBP_QUALITY = Number(process.env.PHOTO_WEBP_QUALITY ?? 75);

interface CompressionStats {
  inputBytes: number;
  outputBytes: number;
  filesProcessed: number;
}

async function collectImageFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return collectImageFiles(fullPath);
      }

      if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (SUPPORTED_EXTENSIONS.has(ext)) {
          return [fullPath];
        }
      }

      return [];
    })
  );

  return files.flat();
}

function createPipeline(inputPath: string) {
  const ext = path.extname(inputPath).toLowerCase();
  const image = sharp(inputPath).rotate().resize({
    width: PHOTO_MAX_WIDTH,
    withoutEnlargement: true,
    fit: "inside",
  });

  if (ext === ".jpg" || ext === ".jpeg") {
    return image.jpeg({
      quality: JPEG_QUALITY,
      mozjpeg: true,
      progressive: true,
    });
  }

  if (ext === ".png") {
    return image.png({
      quality: PNG_QUALITY,
      compressionLevel: 9,
      effort: 10,
      adaptiveFiltering: true,
    });
  }

  return image.webp({
    quality: WEBP_QUALITY,
    effort: 6,
  });
}

async function compressOneImage(
  inputPath: string,
  outputPath: string
): Promise<{ inputBytes: number; outputBytes: number }> {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  const { size: inputBytes } = await fs.stat(inputPath);
  const transformer = createPipeline(inputPath);

  if (inputPath === outputPath) {
    const tempPath = `${outputPath}.tmp`;
    await transformer.toFile(tempPath);
    await fs.rename(tempPath, outputPath);
  } else {
    await transformer.toFile(outputPath);
  }

  const { size: outputBytes } = await fs.stat(outputPath);
  return { inputBytes, outputBytes };
}

async function main() {
  const args = process.argv.slice(2);
  const options = new Set(args.filter((arg) => arg.startsWith("--")));
  const positional = args.filter((arg) => !arg.startsWith("--"));

  if (options.has("--help") || options.has("-h")) {
    console.log(
      [
        "Usage:",
        "  bun run photos:compress -- [inputDir] [outputDir] [--in-place]",
        "",
        "Defaults:",
        "  inputDir:  public/jakekinchen-photos",
        "  outputDir: public/jakekinchen-photos-optimized",
        "",
        "Examples:",
        "  bun run photos:compress",
        "  bun run photos:compress -- public/jakekinchen-photos /tmp/optimized",
        "  bun run photos:compress -- --in-place",
      ].join("\n")
    );
    return;
  }

  const inputRoot = path.resolve(
    positional[0] ?? path.join(process.cwd(), "public", "jakekinchen-photos")
  );
  const inPlace = options.has("--in-place");
  const outputRoot = inPlace
    ? inputRoot
    : path.resolve(
        positional[1] ??
          path.join(process.cwd(), "public", "jakekinchen-photos-optimized")
      );

  const rootExists = await fs
    .stat(inputRoot)
    .then((stats) => stats.isDirectory())
    .catch(() => false);

  if (!rootExists) {
    throw new Error(`Input directory not found: ${inputRoot}`);
  }

  const imageFiles = await collectImageFiles(inputRoot);

  if (imageFiles.length === 0) {
    console.log(`No supported image files found in ${inputRoot}`);
    return;
  }

  const stats: CompressionStats = {
    inputBytes: 0,
    outputBytes: 0,
    filesProcessed: 0,
  };

  for (const inputPath of imageFiles) {
    const relativePath = path.relative(inputRoot, inputPath);
    const outputPath = inPlace
      ? inputPath
      : path.join(outputRoot, relativePath);

    const result = await compressOneImage(inputPath, outputPath);
    stats.inputBytes += result.inputBytes;
    stats.outputBytes += result.outputBytes;
    stats.filesProcessed += 1;
  }

  const savedBytes = stats.inputBytes - stats.outputBytes;
  const savedPercent =
    stats.inputBytes > 0 ? (savedBytes / stats.inputBytes) * 100 : 0;

  console.log(`Compressed ${stats.filesProcessed} files`);
  console.log(`Input: ${(stats.inputBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Output: ${(stats.outputBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(
    `Saved: ${(savedBytes / 1024 / 1024).toFixed(2)} MB (${savedPercent.toFixed(
      1
    )}%)`
  );
  console.log(`Output directory: ${outputRoot}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
