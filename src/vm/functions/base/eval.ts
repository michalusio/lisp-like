import { isCallParam } from "../../../utils";
import { runStatement } from "../../run-statements";
import { RunType } from "../../runtype";
import { ScopeStack } from "../../scope";

export const _eval = (args: RunType[], scopeStack: ScopeStack) => {
  if (args.length !== 1 || !isCallParam(args[0])) {
    throw new Error(`eval requires 1 argument`);
  }
  const expr = args[0];
  return runStatement(expr, scopeStack);
};