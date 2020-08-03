import fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import { getProgram } from "./programs";
import { getTargets } from "./sourceFiles";
import {
  getAddTodoImportTransformer,
} from "./addTodoImportTransformer";
import { anyToTodoTransFormer } from "./anyToTodoTransformer";
import { parseArgs } from "./parseArgs";

function main() {
  const args = parseArgs(process.argv);

  // ヘルプコマンドの場合他の処理を実行しない
  if (process.argv.find((arg) => /-h|--help/) !== undefined) {
    return;
  }

  if (args.todoFilePath === undefined) {
    console.error("Invalid argument");
    return;
  }

  const program = getProgram(args.project);

  // anyが含まれているSourceFileの配列を得る
  const transformTargets: ts.SourceFile[] | undefined = getTargets(
    program,
    args.todoFilePath
  );

  if (transformTargets === undefined) {
    console.error("Invalid arguments");
    return;
  }

  if (transformTargets.length <= 0) {
    console.error("Cannot find file include type any.");
    return;
  }

  const addTodoImportTransformer = getAddTodoImportTransformer(
    args.todoFilePath
  );

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
