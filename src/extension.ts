//THIRD PARTY MODULES
import * as vscode from "vscode";

//RELATIVE MODULES
import { formatOptions } from "./common/format-options";
import { sortImportPlugin } from "./sort-import-plugin";
import { Options, OptionsInput } from "./types/common.type";
import getStartLineHandler from "./common/get-start-line-handler";

const NAME_EXTENSION = "classify-imports";

const optionsDefault: OptionsInput = {
  importOrder: [
    "<THIRD_PARTY_MODULES> --comment THIRD PARTY MODULES",
    //regex
    "<RELATIVE_MODULES> --comment RELATIVE MODULES",
    "<TYPES_MODULES> --comment TYPES MODULES",
  ],
  importOrderSeparation: true,
  importOrderSortByLength: true,
  importOrderSplitType: true,
  importWithSemicolon: false,
  importOrderAddComments: false,
};

export function activate(context: vscode.ExtensionContext) {
  const options = vscode.workspace.getConfiguration(NAME_EXTENSION);
  let disposable = vscode.commands.registerCommand(
    `${NAME_EXTENSION}.sortImports`,
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) return;
      const mergeOptions = {
        ...formatOptions(optionsDefault),
        ...formatOptions({
          importOrder: options.get("importOrder"),
          importOrderSeparation: options.get("importOrderSeparation"),
          importOrderSortByLength: options.get("importOrderSortByLength"),
          importOrderSplitType: options.get("importOrderSplitType"),
          importWithSemicolon: options.get("importWithSemicolon"),
          importOrderAddComments: options.get("importOrderAddComments"),
        } as OptionsInput),
      } as Options;
      const _code = editor.document.getText();

      const comments = mergeOptions.importOrder
        .map((value) => value?.[1])
        .filter(Boolean);
      let code = _code;

      comments.forEach((item) => {
        code = code.replace(new RegExp(`//${item}`, "g"), "");
      });

      const { allImportWithMessage, loc, newCode } = sortImportPlugin(
        code,
        mergeOptions
      );

      let flag = false;
      allImportWithMessage.forEach((value) => {
        if (!value?.message) return;
        flag = true;
      });

      let startLine = getStartLineHandler(loc, code);

      if (flag) {
        editor.edit((editBuilder) => {
          editBuilder.replace(
            new vscode.Range(
              new vscode.Position(startLine, loc.start.column),
              new vscode.Position(loc.end.line - 1, loc.end.column)
            ),
            newCode
          );
        });

        vscode.window.showInformationMessage("Imports sorted successfully!");
      }
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
