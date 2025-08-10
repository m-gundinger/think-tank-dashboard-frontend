const fsPromise = import("fs");
const pathPromise = import("path");

const SCRIPT_CONFIG = {
  VALID_EXTENSIONS: [
    ".ts",
    ".js",
    ".tsx",
    ".jsx",
    //'.html',
    //".css",
    //'.scss',
    //".json",
    //'', // For extensionless files like 'LICENSE', 'Dockerfile', or '.husky/commit-msg'
    //'.yml', // For .yml files
    //'.yaml', // Added for common YAML extension
    //'.prisma',
    //'.sh', // For .sh files
    //'.mjs',
    // Add any other specific extensions you need, with a leading dot.
  ],
  // Folders to always ignore by name, wherever they appear
  IGNORED_DIRS_COMMON: [
    "ui",
    "lib",
    "styles",
    "types",
    "node_modules",
    ".git",
    ".angular",
    ".vscode",
    "public", // Original common ignores
    "dist",
    "coverage",
  ],
  // Specific files to ignore by name, wherever they appear
  IGNORED_FILES: [
    "backend.txt",
    "collate-files.js", // The script itself
    "collate-files_core.js",
    "package-lock.json",
    "Prompt1", // Make sure these names are exact
    "Prompt2", // Make sure these names are exact
    "Prompt3",
    "Prompt4",
    // Add this script's output file if it's generated within inputDir to avoid self-inclusion
    // e.g., if outputFile could be 'collated_code.txt' and inputDir is '.', add 'collated_code.txt'
  ],
  // Top-level subdirectories of inputDir that should be included for deep traversal
  INCLUDED_TOP_LEVEL_SUBDIRS: [
    //".husky",
    "config",
    "prisma",
    ,
    "src" /* 'tests' */,
  ],
  USAGE_MESSAGE: "Usage: node collate-files.js <inputDir> <outputFile>",
};

function usageAndExit() {
  console.error(SCRIPT_CONFIG.USAGE_MESSAGE);
  process.exit(1);
}

const [, , inputDirFromArgs, outputFileFromArgs] = process.argv;

if (!inputDirFromArgs || !outputFileFromArgs) {
  usageAndExit();
}

function getAllFilePaths(currentDir, fs, path, rootDir, outputFileBaseName) {
  let filePaths = [];
  let entries;

  try {
    entries = fs.readdirSync(currentDir, { withFileTypes: true });
  } catch (error) {
    console.error(`Error reading directory "${currentDir}":`, error.message);
    return [];
  }

  for (const entry of entries) {
    const entryName = entry.name;
    const fullPath = path.join(currentDir, entryName);

    // Skip the output file itself if it's somehow in the processing path
    if (
      outputFileBaseName &&
      entryName === outputFileBaseName &&
      path.resolve(currentDir) ===
        path.resolve(path.dirname(outputFileFromArgs))
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      // Check if this directory name is in the common ignore list
      if (
        SCRIPT_CONFIG.IGNORED_DIRS_COMMON.some(
          (ignoredDir) => entryName.toLowerCase() === ignoredDir.toLowerCase()
        )
      ) {
        continue;
      }

      const isDirectChildOfRootDir =
        path.resolve(currentDir) === path.resolve(rootDir);

      if (isDirectChildOfRootDir) {
        // If in the root directory, only recurse if it's an explicitly included top-level subdirectory
        if (SCRIPT_CONFIG.INCLUDED_TOP_LEVEL_SUBDIRS.includes(entryName)) {
          filePaths = filePaths.concat(
            getAllFilePaths(fullPath, fs, path, rootDir, outputFileBaseName)
          );
        }
        // Other directories in the root are not recursed into
      } else {
        // If already in an allowed subdirectory path (e.g., inside 'src/' or '.husky/'), continue recursion
        filePaths = filePaths.concat(
          getAllFilePaths(fullPath, fs, path, rootDir, outputFileBaseName)
        );
      }
    } else {
      // It's a file
      // 1. Check if the file name is in the globally ignored files list
      if (SCRIPT_CONFIG.IGNORED_FILES.includes(entryName)) {
        continue;
      }

      // 2. Check for valid extension
      const ext = path.extname(entryName).toLowerCase();
      if (!SCRIPT_CONFIG.VALID_EXTENSIONS.includes(ext)) {
        continue;
      }

      // 3. If checks pass, include the file.
      // The directory traversal logic ensures we are either in the root
      // or within an allowed subdirectory path like 'src/components' or '.husky'.
      filePaths.push(fullPath);
    }
  }
  return filePaths;
}

async function main() {
  const fs = await fsPromise;
  const path = await pathPromise;

  // Resolve absolute paths for robustness
  const resolvedInputDir = path.resolve(inputDirFromArgs);
  const resolvedOutputFile = path.resolve(outputFileFromArgs);
  const outputFileBaseName = path.basename(resolvedOutputFile);

  const outputDir = path.dirname(resolvedOutputFile);
  if (!fs.existsSync(outputDir)) {
    try {
      fs.mkdirSync(outputDir, { recursive: true });
    } catch (error) {
      console.error(
        `Error creating output directory "${outputDir}":`,
        error.message
      );
      process.exit(1);
    }
  }

  try {
    // Ensure the output file does not grow indefinitely if script is run multiple times with same output file
    fs.writeFileSync(resolvedOutputFile, "", "utf-8");
  } catch (error) {
    console.error(
      `Error initializing output file "${resolvedOutputFile}":`,
      error.message
    );
    process.exit(1);
  }

  // Pass resolvedInputDir as both current directory to start and as rootDir reference
  const allFilePaths = getAllFilePaths(
    resolvedInputDir,
    fs,
    path,
    resolvedInputDir,
    outputFileBaseName
  );

  if (allFilePaths.length === 0) {
    console.log("No files found matching the criteria to collate.");
    return;
  }

  for (const filePath of allFilePaths) {
    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      // Make relative paths consistent with forward slashes for the header
      const relativePath = path
        .relative(resolvedInputDir, filePath)
        .replace(/\\/g, "/");
      const header = `\n// FILE: ${relativePath}\n`;
      fs.appendFileSync(resolvedOutputFile, header + fileContent, "utf-8");
    } catch (err) {
      console.error(`Error processing file "${filePath}":`, err.message);
      // Optionally, decide if one error should stop the whole process or just skip the file
    }
  }
  console.log(
    `All specified files have been collated into: ${resolvedOutputFile}`
  );
}

main().catch((error) => {
  console.error("An unexpected error occurred during script execution:", error);
  process.exit(1);
});
