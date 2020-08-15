import * as ts from "typescript";
import { isAnyType } from "../utils/nodeUtils";
import { todoifyTypeTransformer } from "./todoifyTypeTransformer";

export function anyToTodoTransFormer(ctx: ts.TransformationContext) {
  return (sourceFile: ts.SourceFile) => {
    function visitor(node: ts.Node): ts.Node {
      if (ts.isVariableDeclaration(node) && node.type) {
        const transformed = ts.transform(node.type, [todoifyTypeTransformer])
          .transformed;
        if (transformed.length < 1) return node;

        const newVariableDeclaration = ts.updateVariableDeclaration(
          node,
          node.name,
          transformed[0],
          node.initializer
        );
        return newVariableDeclaration;
      }

      return ts.visitEachChild(node, visitor, ctx);
    }

    return ts.visitEachChild(sourceFile, visitor, ctx);
  };
}
