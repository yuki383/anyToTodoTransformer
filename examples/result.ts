import * as path from "path";
import { Todo } from "../todo";
const foo: string = "I'm foo variable.";
function funcAny(n: Todo<any>) {
    return n;
}
function funcTodo(n: Todo<Todo<any>>) {
    return n;
}
const variable: Todo<any> = foo;
const variableTodo: Todo<Todo<any>> = foo;
type Mock = {
    any: Todo<any>;
    todo: Todo<Todo<any>>;
};
