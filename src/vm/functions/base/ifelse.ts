import { CallParam, ExpressionLiteral } from "../../../ast";
import { isCallParam } from "../../../utils";
import { runStatement } from "../../run-statements";
import { ScopeStack } from "../../scope";

export const ifelse = (args: unknown[], scope: ScopeStack) => {
  if (args.length !== 3 || !isCallParam(args[1]) || !isCallParam(args[2]) || args[1][0] !== 'expression' || args[2][0] !== 'expression') {
    throw new Error("ifelse requires 3 arguments, last two expressions");
  }
  const [check, ifTrue, ifFalse] = args as [boolean, ExpressionLiteral, ExpressionLiteral];
  if (ifTrue[1].length !== 1 || ifFalse[1].length !== 1) {
    throw new Error("ifelse requires exactly one element in each expression (maybe use seq?)");
  }
  return check
    ? runStatement(ifTrue[1][0], scope)
    : runStatement(ifFalse[1][0], scope);
};

export const _if = (args: unknown[], scope: ScopeStack) => {
  if (args.length !== 2 || !isCallParam(args[1])) {
    throw new Error("if requires 2 arguments");
  }
  const [check, ifTrue] = args as [boolean, CallParam];
  return check
    ? runStatement(ifTrue, scope)
    : undefined;
};