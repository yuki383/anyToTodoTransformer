import * as fs from "fs";
import * as path from "path";
import ts from "typescript";

/**
 *
 * @param program programインスタンス
 * @param searchDir fs.readdirするディレクトリ(globに対応するかもしれない)
 */
export function getTargets(
  program: ts.Program,
  searchDir: string
): ts.SourceFile[] {
  const files = fs.readdirSync(searchDir);

  const targets = files
    .map((fileName) => {
      const filePath = path.resolve(
        program.getCurrentDirectory(),
        "src/targets",
        fileName
      );
      return program.getSourceFile(filePath);
    })
    .filter(required)
    .filter(hasAnyKeyword);

  return targets;
}

function required<T>(sourceFile: T | undefined): sourceFile is T {
  return sourceFile !== undefined;
}

function hasAnyKeyword(sourceFile: ts.SourceFile): boolean {
  let hasAny = false;

  function visit(node: ts.Node) {
    if (ts.isTypeNode(node)) {
      if (node.kind === ts.SyntaxKind.AnyKeyword) {
        hasAny = true;
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  if (hasAny) {
    return true;
  }
  return false;
}
