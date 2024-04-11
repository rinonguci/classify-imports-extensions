//THIRD PARTY MODULES
import { Comment } from "@babel/types";

//RELATIVE MODULES
import { Options } from "./types/common.type";
import { getImportNodes } from "./common/get-import-nodes";
import { parseCodeToAst } from "./common/parse-code-to-ast";
import { codeWithoutComment } from "./common/code-without-comment";
import { classifyImportToCode } from "./common/classify-import-to-code";
import {
  CommentBlock,
  CommentLine,
  ImportDeclaration,
  Loc,
} from "./types/babel.type";

type ImportOrComment = ImportDeclaration | Comment | CommentBlock | CommentLine;

export const sortImportPlugin = (code: string, options: Options) => {
  console.log("🚀 ~ sortImportPlugin ~ code:", code);
  const formatComments = (
    allImports: ImportDeclaration[],
    commentsCustom: string[]
  ) => {
    return allImports.map((node) => {
      const { trailingComments, leadingComments, ...rest } = node;
      if (leadingComments && leadingComments.length > 0) {
        const filteredComments = leadingComments.filter(
          (comment: { value: string }) => {
            return !Boolean(
              commentsCustom.find((value) => comment.value.match(value))
            );
          }
        );

        return filteredComments.length === 0
          ? rest
          : { ...rest, leadingComments: filteredComments };
      }
      return rest;
    });
  };

  const getFirstAndLastNode = () => {
    let firstImportOrComment: ImportOrComment | undefined = allImports?.[0];
    if (
      firstImportOrComment?.leadingComments &&
      firstImportOrComment?.leadingComments.length > 0
    ) {
      firstImportOrComment = firstImportOrComment.leadingComments[0];
    }
    const lastImport = allImports[allImports.length - 1];
    return { firstImportOrComment, lastImport };
  };

  const getImportWithMessage = (
    allImports: ImportDeclaration[],
    sortedImports: ImportDeclaration[]
  ) => {
    return allImports.map((node) => {
      let newImport = sortedImports.find(
        (value) => codeWithoutComment(value) === codeWithoutComment(node)
      );
      if (!newImport) {
        return;
      }
      const lineCurrent = node.loc?.end.line;
      let lineNew = newImport.loc?.end.line;

      if (lineCurrent !== lineNew) {
        return {
          message: `Import ${node.source.value} moved from line ${lineCurrent} to line ${lineNew}`,
          node,
        };
      }

      return {
        node,
      };
    });
  };

  const commentsCustom = options.importOrder
    .map((value) => value?.[1])
    .filter(Boolean);

  const parseCode = parseCodeToAst(code);
  const allImports = getImportNodes(parseCode);

  const { firstImportOrComment, lastImport } = getFirstAndLastNode();
  if (!firstImportOrComment?.loc || !lastImport?.loc) {
    throw new Error("No import found");
  }
  const firstImportLoc = firstImportOrComment.loc as unknown as Loc;
  const lastImportLoc = lastImport.loc as unknown as Loc;

  const newAllImports = formatComments(allImports, commentsCustom);

  const newCode = classifyImportToCode(newAllImports, options).replace(
    /[\n]*$/,
    ""
  );

  const textToFirstImport = code.slice(0, firstImportLoc.start.index);

  const sortedImports = getImportNodes(
    parseCodeToAst(textToFirstImport + newCode)
  );

  return {
    allImportWithMessage: getImportWithMessage(allImports, sortedImports),
    newCode,
    loc: {
      start: firstImportLoc.start,
      end: lastImportLoc.end,
    },
  };
};
