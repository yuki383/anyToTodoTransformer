import * as path from "path";

const foo: string = "I'm foo variable.";

function funcAny(n: any) {
  return n;
}
function funcTodo(n: Todo<any>) {
  return n;
}

const variable: any = foo;
const variableTodo: Todo<any> = foo;

type Mock = {
  any: any;
  todo: Todo<any>;
};
