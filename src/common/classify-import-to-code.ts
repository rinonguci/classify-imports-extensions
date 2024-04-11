//RELATIVE MODULES
import { Options } from "../types/common.type";
import { classifyImport } from "./classify-import";
import { ImportDeclaration } from "../types/babel.type";
import { getImportOrder } from "./handle-import-order-default";
import { convertNodesToString } from "./convert-nodes-to-string";

export const classifyImportToCode = (
  body: ImportDeclaration[],
  options: Options
) => {
  const generateImportGroup = (
    comment: string,
    group: ImportDeclaration[],
    newLine: string
  ) => {
    if (options.importOrderAddComments) {
      return (
        `//${comment}\n` + convertNodesToString(group).join("\n") + newLine
      );
    }
    return convertNodesToString(group).join("\n") + newLine;
  };

  const importOrder = getImportOrder(options);

  const imports = classifyImport(body, options);
  const commentsWithImportOrder = options.importOrder.reduce(
    (acc, [key, value]: any) => {
      acc[key] = value;
      return acc;
    },
    {} as { [key: string]: string }
  );

  const importsList: Record<string, ImportDeclaration[]> = {
    "<THIRD_PARTY_MODULES>": imports.thirdPartyImports,
    "<TYPES_MODULES>": imports.importTypeImports,
    ...imports.arrayRegexImports,
    "<RELATIVE_MODULES>": imports.relativePathImports,
  };

  let newCode = "";
  let newLine = options.importOrderSeparation ? "\n\n" : "\n";

  importOrder.forEach((importType) => {
    const group = importsList[importType];
    if (group?.length) {
      const comment = commentsWithImportOrder[importType];

      newCode += generateImportGroup(comment || importType, group, newLine);
    }
  });

  if (!options.importWithSemicolon) {
    newCode = newCode.replace(new RegExp(";", "g"), "");
  }

  return newCode.replace(new RegExp(newLine + "$"), "");
};
