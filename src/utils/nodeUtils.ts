import * as ts from "typescript";

export function isAnyType(type: ts.TypeNode | undefined): boolean {
  if (type === undefined) return false;
  if (type.kind !== ts.SyntaxKind.AnyKeyword) return false;

  return true;
}

export function createTodoType(genericsType: ts.TypeNode) {
  return ts.createTypeReferenceNode(ts.createIdentifier("Todo"), [
    genericsType,
  ]);
}

// TODO: ts.transformは、Nodeを変換する関数なので、この関数をts.TransformerFactoryにしてFunctionDeclarationを変換すると良さそう
// export function anyToTodoFunctionDeclaration(node: ts.FunctionDeclaration): ts.FunctionDeclaration {
  
// }

export function todoifyTuple(tuple: ts.TupleTypeNode) {
  const newElementTypes = tuple.elementTypes.map((element) => {
    if (element.kind === ts.SyntaxKind.AnyKeyword) {
      const todoType = createTodoType(
        ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
      );
      return todoType;
    }

    return element;
  });
  return ts.createTupleTypeNode(newElementTypes);
}
