import * as ts from "typescript";

const configHost: ts.ParseConfigHost = {
  useCaseSensitiveFileNames: false,
  readDirectory: ts.sys.readDirectory,
  fileExists: ts.sys.fileExists,
  readFile: ts.sys.readFile,
};

const configFileHost: ts.ParseConfigFileHost = {
  ...configHost,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  onUnRecoverableConfigFileDiagnostic(diagnostic) {
    throw new Error(
      ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
    );
  },
};

export function getProgram(searchPath: string) {
  // tsconfig.jsonの相対パスを取得する
  const configPath = ts.findConfigFile(
    searchPath,
    ts.sys.fileExists,
    "tsconfig.json"
  );

  if (!configPath) {
    throw new Error("Could not find a valid 'tsconfig.json'.");
  }
  const parsedCommandLine = ts.getParsedCommandLineOfConfigFile(
    configPath,
    {},
    configFileHost
  );

  if (!parsedCommandLine) {
    throw new Error("invalid parsedCommandLine");
  }
  if (parsedCommandLine.errors.length) {
    throw new Error("parsedCommandLine has errors.");
  }

  console.log(parsedCommandLine.options);

  const program = ts.createProgram({
    rootNames: parsedCommandLine.fileNames,
    options: parsedCommandLine.options,
  });

  return program;
}
