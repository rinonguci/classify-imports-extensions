//THIRD PARTY MODULES
import generator from "babel-generator";

//RELATIVE MODULES
import { ImportDeclaration } from "../types/babel.type";

export const convertNodesToString = (arr: ImportDeclaration[]) => {
  return arr.map((value) => {
    return generator(value as any, {
      comments: true,
      retainLines: true,
    }).code.replace(/^[\n]*/, "");
  });
};
