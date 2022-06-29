import { runStatement } from "../../run-statements";
import { ScopeStack } from "../../scope";

export const ifelse = (args: unknown[], scope: ScopeStack) => {
  if (args.length !== 3) {
    throw new Error("ifelse requires 3 arguments");
  }
  const [check, ifTrue, ifFalse] = args as [boolean, [any], [any]];
  return check
    ? runStatement(ifTrue[0], scope)
    : runStatement(ifFalse[0], scope);
};

export const _if = (args: unknown[], scope: ScopeStack) => {
  if (args.length !== 2) {
    throw new Error("if requires 2 arguments");
  }
  const [check, ifTrue] = args as [boolean, [any]];
  return check
    ? runStatement(ifTrue[0], scope)
    : undefined;
};