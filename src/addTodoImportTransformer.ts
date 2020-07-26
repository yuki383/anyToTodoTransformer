import * as ts from "typescript";

export function addTodoImportTransformer(ctx: ts.TransformationContext) {
  return (sourceFile: ts.SourceFile) => {
    const importStatement = createImportTodoNode("./src/todo.ts");

    const statements: readonly ts.Statement[] = [
      importStatement,
      ...sourceFile.statements,
    ];
    sourceFile.statements = ts.createNodeArray(statements);
    return sourceFile;
  };
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
