import { Project, ts, SyntaxKind } from "ts-morph";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";


import "source-map-support/register.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendPath = path.resolve(__dirname, "../backend_core.txt");
const outputPath = path.resolve(__dirname, "../src/types/generated.ts");

async function main() {
  console.log("🚀 Starting type generation from backend schemas...");

  const backendContent = await fs.readFile(backendPath, "utf-8");

  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      allowJs: true,
      target: ts.ScriptTarget.ESNext,
    },
  });

  const sourceFile = project.createSourceFile("backend.ts", backendContent);
  const typeAliases = new Set();
  const enums = new Set();
  const exports = new Set();

  
  sourceFile.getEnums().forEach((enumDecl) => {
    if (enumDecl.isExported()) {
      enums.add(enumDecl.getText());
      exports.add(enumDecl.getName());
    }
  });

  sourceFile.getVariableDeclarations().forEach((varDecl) => {
    if (
      varDecl.isExported() &&
      varDecl.getInitializer()?.getText().startsWith("z.")
    ) {
      const schemaName = varDecl.getName();

      if (schemaName.endsWith("Schema")) {
        const typeName = schemaName.replace("Schema", "");
        const typeAlias = `export type ${typeName} = z.infer<typeof ${schemaName}>;`;
        typeAliases.add(typeAlias);
        exports.add(typeName);
        exports.add(schemaName);
      }
    }
  });

  sourceFile.getTypeAliases().forEach((typeAlias) => {
    if (typeAlias.isExported()) {
      typeAliases.add(typeAlias.getText());
      exports.add(typeAlias.getName());
    }
  });

  sourceFile.getInterfaces().forEach((interfaceDecl) => {
    if (interfaceDecl.isExported()) {
      typeAliases.add(interfaceDecl.getText());
      exports.add(interfaceDecl.getName());
    }
  });

  const outputContent = `/* eslint-disable */


import { z } from "zod";




${[...enums].join("\n\n")}




${sourceFile
  .getVariableStatements()
  .filter((s) => s.isExported())
  .map((s) => s.getText())
  .join("\n\n")}

${[...typeAliases].join("\n\n")}

export {
  ${[...exports].join(",\n  ")}
};
`;

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, outputContent);

  console.log(`✅ Types successfully generated at: ${outputPath}`);
}

main().catch((err) => {
  console.error("❌ Type generation failed:", err);
  process.exit(1);
});
