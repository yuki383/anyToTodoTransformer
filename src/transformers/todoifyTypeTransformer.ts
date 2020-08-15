import * as ts from "typescript";
import { isAnyType, createTodoType } from "../utils/nodeUtils";

export function todoifyTypeTransformer(ctx: ts.TransformationContext) {
  return (typeNode: ts.TypeNode) => {
    function visitor(node: ts.Node): ts.Node {
      // nodeがTodo型なら型引数をtodoifyする
      if (ts.isTypeReferenceNode(node) && isTodoReference(node)) {
        if (node.typeArguments) {
          return createTodoType(todoifyTypeNode(node.typeArguments[0]));
        }
      }

      // nodeがany型かつTodo<any>の形式でない場合、Todo型に変換する
      if (ts.isTypeNode(node) && isAnyType(node)) {
        return createTodoType(node);
      }

      return ts.visitEachChild(node, visitor, ctx);
    }

    return ts.visitEachChild(typeNode, visitor, ctx);
  };
}

export function todoifyTypeNode(node: ts.TypeNode) {
  const transformed = ts.transform(node, [todoifyTypeTransformer]).transformed;
  if (transformed.length < 1) {
    return node;
  }

  return transformed[0];
}

export function isTodoReference(node: ts.TypeNode) {
  return (
    ts.isTypeReferenceNode(node) &&
    ts.isIdentifier(node.typeName) &&
    node.typeName.escapedText === "Todo"
  );
}
