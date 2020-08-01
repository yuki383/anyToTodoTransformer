import cac from "cac";

export function parseArgs(argv: string[]) {
  const cli = cac();
  cli.option(
    "-p, --project <project>",
    "Compile a TypeScript project given a valid configuration file.",
    { default: "./tsconfig.json" }
  );
  cli.option("-t, --targets <targets>", "Path of Transform Target Directory.", {
    default: "./src",
  });
  cli.help((helpSections) => {
    const help = {
      title: "Usage",
      body: "  $ index.ts <todoFilePath> [options]",
    };
    const options = helpSections.find((section) => section.title === "Options");

    if (options) {
      return [help, options];
    }

    return [help];
  });

  const parsed = cli.parse(argv);
  console.log(parsed);

  const todoFilePath = parsed.args[0];

  return {
    ...parsed.options,
    todoFilePath,
  } as Args;
}

type Args = {
  project: string;
  targets: string;
  todoFilePath?: string;
};
