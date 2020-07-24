import * as fs from "fs";
import ts from "typescript";

export function getTargets(
  program: ts.Program,
  searchDir: string
): ts.SourceFile[] {
  const files = fs.readdirSync(searchDir, { encoding: "utf-8" });

  const targets = files
    .map(program.getSourceFile)
    .filter(required)
    .filter(hasAnyKeyword);

  return targets;
}

function required<T>(sourceFile: T | undefined): sourceFile is T {
  return sourceFile !== undefined;
}

function hasAnyKeyword(sourceFile: ts.SourceFile): boolean {
  const hasAny = visit(sourceFile);
  if (hasAny) {
    return true;
  }
  return false;
}

function visit(node: ts.Node) {
  if (ts.isTypeNode(node)) {
    if (node.kind === ts.SyntaxKind.AnyKeyword) {
      return true;
    }
  }
  // TODO: isEndOfFileみたいな関数見つけてvisitの返り値をbooleanにしたい
  ts.forEachChild(node, visit);
}
