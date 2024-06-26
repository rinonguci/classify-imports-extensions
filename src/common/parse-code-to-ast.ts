//THIRD PARTY MODULES
import { parse } from "@babel/parser";

//RELATIVE MODULES
import { Ast } from "../types/babel.type";

export const parseCodeToAst = (code: string) => {
  return parse(code, {
    sourceType: "module",
    plugins: [
      "typescript",
      "jsx",
      "classProperties",
      "objectRestSpread",
      "decorators",
    ],
  }) as Ast;
};
