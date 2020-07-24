const foo: string = "I'm foo variable.";

function expectNumber(n: any) {
  return n;
}

const bar: any = foo;

expectNumber(bar);
