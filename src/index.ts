import fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import { getProgram } from "./programs";
import { getTargets } from "./sourceFiles";
import { addTodoImportTransformer } from "./addTodoImportTransformer";
import { anyToTodoTransFormer } from "./anyToTodoTransformer";

function main() {
  const rootName = process.argv[2] || path.resolve(process.cwd());
  const searchDir = "./src/targets";
  const program = getProgram(rootName);

  // anyが含まれているSourceFileの配列を得る
  const transformTargets: ts.SourceFile[] | undefined = getTargets(
    program,
    searchDir
  );

  if (transformTargets === undefined) {
    throw new Error("Invalid arguments");
  }

  const result = ts.transform(transformTargets, [
    addTodoImportTransformer,
    anyToTodoTransFormer,
  ]);

  const printer = ts.createPrinter();
  result.dispose();

  const transformed = result.transformed[0];
  const print = printer.printFile(transformed);

  fs.writeFileSync("./result.ts", print);
}

main();
