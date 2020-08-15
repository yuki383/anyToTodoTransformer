# Any to Todo Transformer

Replace `any` in the source code with `Todo<any>`.

## Usage

```
 $ <toolName> [todoFilePath] [...options]
```

### Options

| option                | desciption                                         |
| --------------------- | -------------------------------------------------- |
| todoFile **required** | The file which Todo declarations are exported.     |
| -t, --target          | The directory containing the files to be converted |
| -p, --project         | TypeScript configuration file (e.g. tsconfig.json) |

## Example

### Before

```typescript
const foo: string = "I'm foo variable.";

function funcAny(n: any) {
  return n;
}
function funcTodo(n: Todo<any>) {
  return n;
}

const variable: any = foo;
const { objectBinding1 }: { objectBinding1: any } = { objectBinding1: "foo" };
const { objectBinding2 }: any = { objectBinding2: "foo" };
const [tuplePattern]: [string, string, any] = ["one", "two", 333];
const [ArrayPattern]: any[] = ["one", "two", 333];
const variableTodo: Todo<any> = foo;

type Mock = {
  any: any;
  todo: Todo<any>;
};
```

### After

```typescript
import { Todo } from "../todo";
const foo: string = "I'm foo variable.";
function funcAny(n: Todo<any>) {
  return n;
}
function funcTodo(n: Todo<any>) {
  return n;
}
const variable: Todo<any> = foo;
const {
  objectBinding1,
}: {
  objectBinding1: Todo<any>;
} = { objectBinding1: "foo" };
const { objectBinding2 }: Todo<any> = { objectBinding2: "foo" };
const [tuplePattern]: [string, string, Todo<any>] = ["one", "two", 333];
const [ArrayPattern]: Todo<any>[] = ["one", "two", 333];
const variableTodo: Todo<any> = foo;
type Mock = {
  any: Todo<any>;
  todo: Todo<any>;
};
```
