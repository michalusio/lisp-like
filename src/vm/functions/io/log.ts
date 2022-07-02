import { ScopeStack } from "../../scope";

export const log = (args: unknown[], _: ScopeStack) => {
  args.forEach(arg => console.log(arg));
};