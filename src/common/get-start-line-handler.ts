export default function getStartLineHandler(
  loc: {
    start: { line: number; column: number; index: number };
    end: { line: number; column: number; index: number };
  },
  code: string
) {
  let startLine = loc.start.line - 1;
  const codeLines = code.split("\n");
  for (let i = startLine - 1; i >= 0; i--) {
    if (codeLines[i].trim() === "") {
      startLine = i;
    } else {
      break;
    }
  }
  return startLine;
}
