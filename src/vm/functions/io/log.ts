import { RunType } from "../../runtype";
import { ScopeStack } from "../../scope";

export const log = (args: RunType[], _: ScopeStack) => {
  args.forEach(arg => console.log(arg));
};