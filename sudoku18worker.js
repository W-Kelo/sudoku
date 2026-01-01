
function isValid18(board, row, col, num) {

  // wiersz
  for (let c = 0; c < 18; c++) {
    if (board[row][c] === num && c !== col) return false;
  }

  // kolumna
  for (let r = 0; r < 18; r++) {
    if (board[r][col] === num && r !== row) return false;
  }

  // blok 3x6
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 6) * 6;

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 6; c++) {
      const rr = startRow + r;
      const cc = startCol + c;
      if (board[rr][cc] === num && !(rr === row && cc === col)) {
        return false;
      }
    }
  }

  return true;
}

// klasyczny backtracking
function solveSudoku18(board) {

  for (let row = 0; row < 18; row++) {
    for (let col = 0; col < 18; col++) {

      if (board[row][col] === 0) {

        for (let num = 1; num <= 18; num++) {

          if (isValid18(board, row, col, num)) {

            board[row][col] = num;

            if (solveSudoku18(board)) return true;

            board[row][col] = 0;
          }
        }

        return false; // brak liczby pasującej w tym miejscu
      }
    }
  }

  return true; // wypełniono wszystko
}

// odbieramy tablicę od strony głównej
self.onmessage = function (e) {

  const board = e.data;

  const boardCopy = JSON.parse(JSON.stringify(board));

  const solved = solveSudoku18(boardCopy);

  // odsyłamy wynik
  self.postMessage({
    solved,
    board: boardCopy
  });
};
