import * as ts from "typescript";

export function anyToTodoTransFormer(ctx: ts.TransformationContext) {
  return (sourceFile: ts.SourceFile) => {
    function visitor(node: ts.Node): ts.Node {
      if (ts.isTypeNode(node) && node.kind === ts.SyntaxKind.AnyKeyword) {
        return ts.createTypeReferenceNode(
          ts.createIdentifier("Todo"),
          [ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)]
        );
      }

      return ts.visitEachChild(node, visitor, ctx);
    }

    return visitor(sourceFile);
  };
}
