import { ParseFile } from "parser-combinators";
import { dirname } from "path";
import { root } from "../ast";
import { get } from "./file-cache";
import { arithmetics, fn, load, array, log, _main, letScope, getScope, _let, _eval } from "./functions";
import { runStatement } from "./run-statements";
import { RunType } from "./runtype";
import { ScopeStack } from "./scope";

export function runner(main: [string, number]): RunType {
  const scopeStack = new ScopeStack();

  // Load the built-ins
  scopeStack.push({
    main: _main,
    seq: (args: RunType[], _: ScopeStack) => args[args.length - 1],
    eval: _eval,
    let: _let,
    'let-scope': letScope,
    'get-scope': getScope,
    fn,
    load,
    log,
    ...array,
    ...arithmetics
  });

  // Load the standard library
  const stdLib = ParseFile("./src/lib/lib.lng", root);
  scopeStack.pushNew();
  stdLib.forEach(v => runStatement(v, scopeStack));

  // Load the main file
  const mainFile = get(main[0]);
  const mainFn = mainFile[main[1]];
  const rest = mainFile.filter((_, index) => index !== main[1]);
  scopeStack.pushNew();
  scopeStack.set("_cwd", dirname(main[0]));
  rest.forEach(v => runStatement(v, scopeStack));

  // Run the main function
  return runStatement(mainFn, scopeStack);
}
