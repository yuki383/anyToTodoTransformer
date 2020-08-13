const foo: string = "I'm foo variable.";

function funcAny(n: any) {
  return n;
}
function funcTodo(n: Todo<any>) {
  return n;
}

const variable: any = foo;
const { objectBinding1 }: { objectBinding1: any } = { objectBinding1: "hoge" };
const { objectBinding2 }: any = { objectBinding2: "hoge" };
const [tuplePattern]: [string, string, any] = ["one", "two", 333];
const [ArrayPattern]: any[] = ["one", "two", 333];
const variableTodo: Todo<any> = foo;

type Mock = {
  any: any;
  todo: Todo<any>;
};
