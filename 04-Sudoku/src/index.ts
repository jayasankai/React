import fs from "fs";

// Difficulty levels
export type Difficulty = "easy" | "medium" | "hard";

// Sudoku grid type
export type SudokuGrid = number[][];

// Generate a blank Sudoku grid
function createEmptyGrid(): SudokuGrid {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

function generateSudoku(difficulty: Difficulty): SudokuGrid {
  // Step 1: Generate a complete solution (simple backtracking)
  function isSafe(
    grid: SudokuGrid,
    row: number,
    col: number,
    num: number
  ): boolean {
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num || grid[x][col] === num) return false;
    }
    const startRow = row - (row % 3),
      startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[startRow + i][startCol + j] === num) return false;
      }
    }
    return true;
  }

  function fillGrid(grid: SudokuGrid): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(
            () => Math.random() - 0.5
          );
          for (const num of nums) {
            if (isSafe(grid, row, col, num)) {
              grid[row][col] = num;
              if (fillGrid(grid)) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  // Step 2: Remove clues based on difficulty
  const cluesMap = { easy: 40, medium: 32, hard: 28 };
  const clues = cluesMap[difficulty];
  const grid = createEmptyGrid();
  fillGrid(grid);

  // Remove numbers to create puzzle
  let cellsToRemove = 81 - clues;
  while (cellsToRemove > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (grid[row][col] !== 0) {
      grid[row][col] = 0;
      cellsToRemove--;
    }
  }
  return grid;
}

function sudokuGridToHtml(grid: SudokuGrid): string {
  let html = `<table class="sudoku-grid">\n`;
  for (let row = 0; row < 9; row++) {
    html += `<tr${row === 2 || row === 5 ? ' class="bborder"' : ""}>`;
    for (let col = 0; col < 9; col++) {
      const value = grid[row][col] ? grid[row][col] : "";
      let classes = "";
      if (col === 2 || col === 5) classes += "rborder";
      html += `<td${classes ? ` class="${classes}"` : ""}>${value}</td>`;
    }
    html += `</tr>\n`;
  }
  html += `</table>`;
  return html;
}

function puzzlesSectionHtml(
  difficulty: Difficulty,
  startIdx: number,
  endIdx: number,
  puzzles: SudokuGrid[]
): string {
  let html = `<div class="puzzle-container">\n`;
  for (let i = startIdx; i < endIdx; i++) {
    html += `<div class="puzzle-wrapper">\n<h3>${difficulty}-puzzle-${
      i + 1
    }</h3>\n`;
    html += sudokuGridToHtml(puzzles[i]);
    html += `\n</div>\n`;
  }
  html += `</div>\n`;
  return html;
}

function generateHtmlFile() {
  const categories: Difficulty[] = ["easy", "medium", "hard"];
  const puzzlesPerCategory = 20;
  let html = `<!DOCTYPE html>
<html>
<head>
<title>Printable Sudoku Collection</title>
<style>
@media print {
body { font-size: 12px; }
.page-break { page-break-after: always; }
h1, h2 { text-align: center; }
}
.puzzle-container { display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; }
.puzzle-wrapper { display: inline-block; margin-bottom: 5px; }
.puzzle-wrapper h3 { text-align: center; margin-bottom: 0px; font-family: sans-serif; }
.sudoku-grid { border-collapse: collapse; border: 3px solid black; font-family: sans-serif; }
.sudoku-grid td { width: 32px; height: 32px; border: 1px solid #999; text-align: center; font-size: 18px; }
.sudoku-grid td.rborder { border-right: 2px solid black; }
.sudoku-grid tr.bborder td { border-bottom: 2px solid black; }
</style>
</head>
<body>
`;

  for (const difficulty of categories) {
    const puzzles: SudokuGrid[] = [];
    for (let i = 0; i < puzzlesPerCategory; i++) {
      puzzles.push(generateSudoku(difficulty));
    }
    html += puzzlesSectionHtml(difficulty, 0, puzzlesPerCategory, puzzles);
  }

  html += `</body>\n</html>`;
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const dateStr = `${dd}${mm}${yyyy}`;
  const randomSuffix = Math.floor(Math.random() * 100000);
  fs.writeFileSync(
    `output/sudoku-${dateStr}-${randomSuffix}.html`,
    html,
    "utf8"
  );
}

generateHtmlFile();
