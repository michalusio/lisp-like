import { resolve, sep } from "path";
import { getCwd } from "../../cwd";
import { get, setRun, tryGetRun } from "../../file-cache";
import { runStatement } from "../../run-statements";
import { ScopeStack } from "../../scope";

export const load = (args: any[], scopeStack: ScopeStack) => {
  if (typeof args[0] !== 'string' || args.length !== 1) {
    throw new Error(`Invalid body of loadFile function`);
  }

  const resolvedPath = resolve(getCwd(), args[0]).split(sep).join("/");
  let [isData, data] = tryGetRun(resolvedPath);
  if (!isData) {
    data = get(resolvedPath).map(v => runStatement(v, scopeStack));
    setRun(resolvedPath, data);
  }
  return data;
};