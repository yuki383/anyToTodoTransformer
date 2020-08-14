import * as ts from "typescript";
import { createTodoType, isAnyType } from "../utils/nodeUtils";

export function anyToTodoTransFormer(ctx: ts.TransformationContext) {
  return (sourceFile: ts.SourceFile) => {
    function visitor(node: ts.Node): ts.Node {
      if (ts.isVariableDeclaration(node) && isAnyType(node.type)) {
        const actualType = ts.createKeywordTypeNode(
          ts.SyntaxKind.NumberKeyword
        );
        const todoType = createTodoType(actualType);
        const newVariableDeclaration = ts.updateVariableDeclaration(
          node,
          node.name,
          todoType,
          node.initializer
        );

        return newVariableDeclaration;
      }

      //   if (ts.isTypeNode(node) && node.kind === ts.SyntaxKind.AnyKeyword) {
      //     // TODO: 現在Todo<any>をTodo<Todo<any>>にしてしまう
      //     // なので、parentがTodoの場合は変換しないようにする
      //     // AnyKeywordからparentを参照するのは厳しそうなので、
      //     // variable declarationとかから肩を判別する？

      //     return ts.createTypeReferenceNode(ts.createIdentifier("Todo"), [
      //       ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
      //     ]);
      //   }

      return ts.visitEachChild(node, visitor, ctx);
    }

    return ts.visitEachChild(sourceFile, visitor, ctx);
  };
}
