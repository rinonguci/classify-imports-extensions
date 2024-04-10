# Classify Imports Extension for Visual Studio Code

The **classify-imports** extension for Visual Studio Code is designed to organize and categorize import statements within your TypeScript files. It offers various customization options to tailor the sorting and classification according to your preferences.

## Features

- Sorts and organizes import statements.
- Classifies imports into categories: Third Party Modules, Relative Modules, and Types Modules.
- Customizable import order to suit your needs.
- Option to include a blank line between import categories.
- Ability to sort imports by length.
- Option to separate type imports into their own category.
- Option to terminate import statements with a semicolon.
- Support for adding comments above each import category.


## Usage

After installing the extension, access it by executing the `classify-imports.sortImports` command in the command palette (`Cmd+Shift+P`).

The extension will automatically arrange and classify your import statements based on the default settings. If you wish to modify these settings, you can do so in your `settings.json` file.

## Default Options

```json
{
  "importOrder": [
    "<THIRD_PARTY_MODULES> --comment THIRD PARTY MODULES",
    "<RELATIVE_MODULES> --comment RELATIVE MODULES",
    "<TYPES_MODULES> --comment TYPES MODULES"
  ],
  "importOrderSeparation": true,
  "importOrderSortByLength": true,
  "importOrderSplitType": true,
  "importWithSemicolon": true,
  "importOrderAddComments": true
}
```

## Customizing Options

To customize the extension's behavior, modify the `classify-imports` object in your `settings.json` file. Here's an example:

```json
{
  "classify-imports": {
    "importOrder": [
      "<RELATIVE_MODULES> --comment RELATIVE MODULES",
      "<THIRD_PARTY_MODULES> --comment THIRD PARTY MODULES",
      "<TYPES_MODULES> --comment TYPES MODULES"
    ],
    "importOrderSeparation": true,
    "importOrderSortByLength": true,
    "importOrderSplitType": true,
    "importWithSemicolon": false,
    "importOrderAddComments": true
  }
}
```

### Example

```typescript
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import type { UserInterface } from '../types/user.interface';
```
=> After running the `classify-imports.sortImports` command, the import statements will be sorted and categorized as follows:

```typescript
// RELATIVE MODULES
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

// THIRD PARTY MODULES
import { Observable } from 'rxjs';
import { Component } from '@angular/core';

// TYPES MODULES
import type { UserInterface } from '../types/user.interface';
```


In this example, the import order has been reversed, and all other options have been disabled (`false`).

## Explanation of Options

- `importOrder`: Defines the order in which import statements will be sorted and categorized. Imports are classified into Third Party Modules, Relative Modules, and Types Modules. The order of categories in the array determines their sequence in the sorted import statements. The `--comment` flag adds a descriptive comment above each category.

- `importOrderSeparation`: Inserts a blank line between each category of import statements if set to `true`.

- `importOrderSortByLength`: Sorts import statements within each category based on their length if set to `true`.

- `importOrderSplitType`: Separates type imports into a dedicated category (`Types Modules`) if `true`; otherwise, includes type imports within their respective categories (Third Party or Relative).

- `importWithSemicolon`: Appends a semicolon to the end of each import statement if `true`.

- `importOrderAddComments`: Includes comments above each category of import statements as specified in `importOrder`.

## Note

This extension exclusively supports ES6 (import syntax) TypeScript files and does not function with CommonJS (require syntax) files.