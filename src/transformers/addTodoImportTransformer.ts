import * as path from "path";
import * as ts from "typescript";

export function getAddTodoImportTransformer(todoPath: string) {
  function addTodoImportTransformer(ctx: ts.TransformationContext) {
    return (sourceFile: ts.SourceFile) => {
      const importPath = getImportPath(sourceFile.fileName, todoPath);

      const importStatement = createImportTodoNode(importPath);

      const insertIndex = sourceFile.statements.reduce(
        (acc, currentNode, idx) => {
          if (ts.isImportDeclaration(currentNode)) {
            return idx + 1;
          }
          return acc;
        },
        0
      );

      const statements: readonly ts.Statement[] = [
        ...sourceFile.statements.slice(0, insertIndex),
        importStatement,
        ...sourceFile.statements.slice(insertIndex),
      ];

      sourceFile.statements = ts.createNodeArray(statements);
      return sourceFile;
    };
  }
  return addTodoImportTransformer;
}

function createImportTodoNode(path: string) {
  return ts.createImportDeclaration(
    undefined,
    undefined,
    ts.createImportClause(
      undefined,
      ts.createNamedImports([
        ts.createImportSpecifier(undefined, ts.createIdentifier("Todo")),
      ]),
      false
    ),
    ts.createStringLiteral(path)
  );
}

function getImportPath(sourceFileName: string, targetPath: string) {
  const targets = path.parse(targetPath);
  const sourceFileDir = path.dirname(sourceFileName);

  const relativePath = path.relative(sourceFileDir, targets.dir);

  return path.format({
    dir: relativePath,
    name: targets.name,
  });
}
