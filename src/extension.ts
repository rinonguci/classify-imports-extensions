import * as vscode from "vscode";

import { Options, OptionsInput } from "./types/common.type";
import { formatOptions } from "./common/format-options";
import { sortImportPlugin } from "./sort-import-plugin";

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
  importWithSemicolon: true,
  importOrderAddComments: true,
};

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "sort-imports" is now active!');
  let disposable = vscode.commands.registerCommand(
    `${NAME_EXTENSION}.sortImports`,
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) return;

      const mergeOptions = {
        ...formatOptions(optionsDefault),
      } as Options;
      const code = editor.document.getText();

      const { allImportWithMessage, loc, newCode } = sortImportPlugin(
        code,
        mergeOptions,
      );

      let flag = false;
      allImportWithMessage.forEach((value) => {
        if (!value?.message) return;
        flag = true;
      });

      if (flag) {
        editor.edit((editBuilder) => {
          editBuilder.replace(
            new vscode.Range(
              new vscode.Position(loc.start.line - 1, loc.start.column),
              new vscode.Position(loc.end.line - 1, loc.end.column),
            ),
            newCode,
          );
        });

        vscode.window.showInformationMessage("Imports sorted successfully!");
      }
    },
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
