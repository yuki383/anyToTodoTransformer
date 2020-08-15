import * as ts from "typescript";
import { isAnyType, createTodoType } from "../utils/nodeUtils";
import {
  todoifyTypeTransformer,
  isTodoReference,
  todoifyTypeNode,
} from "./todoifyTypeTransformer";

export function anyToTodoTransFormer(ctx: ts.TransformationContext) {
  return (sourceFile: ts.SourceFile) => {
    function visitor(node: ts.Node): ts.Node {
      if (ts.isVariableDeclaration(node) && node.type) {
        const converted = convertVariableType(node.type);

        const newVariableDeclaration = ts.updateVariableDeclaration(
          node,
          node.name,
          converted,
          node.initializer
        );
        return newVariableDeclaration;
      }

      return ts.visitEachChild(node, visitor, ctx);
    }

    return ts.visitEachChild(sourceFile, visitor, ctx);
  };
}

function convertVariableType(node: ts.TypeNode) {
  if (isAnyType(node)) {
    return createTodoType(node);
  }

  if (ts.isTypeReferenceNode(node) && isTodoReference(node)) {
    if (!node.typeArguments) return node;
    const typeArguments = todoifyTypeNode(node.typeArguments[0]);
    return createTodoType(typeArguments);
  }

  const transformed = ts.transform(node, [todoifyTypeTransformer]).transformed;
  if (transformed.length < 1) return node;

  return transformed[0];
}
