import ts, * as typescript from "typescript";
import { isAnyType, createTodoType } from "../utils/nodeUtils";

export function todoifyTypeTransformer(ctx: ts.TransformationContext) {
  return (typeNode: ts.TypeNode) => {
    let isTodoTypeReference = false;

    function visitor(node: ts.Node): ts.Node {
      if (
        ts.isTypeReferenceNode(node) &&
        ts.isIdentifier(node.typeName) &&
        node.typeName.escapedText === "Todo"
      ) {
        isTodoTypeReference = true;
        return ts.visitEachChild(node, visitor, ctx);
      }

      // nodeがany型かつTodo<any>の形式でない場合、Todo型に変換する
      if (ts.isTypeNode(node) && isAnyType(node)) {
        if (isTodoTypeReference) {
          isTodoTypeReference = false;
          return node;
        }

        isTodoTypeReference = false;
        return createTodoType(
          ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
        );
      }

      isTodoTypeReference = false;
      return ts.visitEachChild(node, visitor, ctx);
    }

    if (typeNode.kind === ts.SyntaxKind.AnyKeyword) {
      return createTodoType(typeNode);
    }

    return ts.visitEachChild(typeNode, visitor, ctx);
  };
}
