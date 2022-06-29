import { ParseFile } from "parser-combinators";
import { root } from "../ast";
import { get } from "./file-cache";
import { arithmetics, fn, load, array, log, ifelse, _if, _main, nameof, stack, letScope, getScope, _let } from "./functions";
import { runStatement } from "./run-statements";
import { ScopeStack } from "./scope";

export function runner(main: [string, number]): unknown {
  const scopeStack = new ScopeStack();

  // Load the built-ins
  scopeStack.push({
    main: _main,
    seq: (args: unknown[], _: ScopeStack) => args[args.length - 1],
    let: _let,
    'let-scope': letScope,
    'get-scope': getScope,
    stack,
    fn,
    load,
    ifelse,
    if: _if,
    log,
    nameof,
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
  rest.forEach(v => runStatement(v, scopeStack));

  // Run the main function
  return runStatement(mainFn, scopeStack);
}
