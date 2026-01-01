// =========================
// SZYBKI SOLVER 18x18 MRV
// =========================

// sprawdzanie poprawności
function isValid18(board, row, col, num) {
  for (let c = 0; c < 18; c++) if (board[row][c] === num) return false;
  for (let r = 0; r < 18; r++) if (board[r][col] === num) return false;

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 6) * 6;

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 6; c++) {
      if (board[startRow + r][startCol + c] === num) return false;
    }
  }
  return true;
}

// zwraca listę dopuszczalnych liczb dla pola
function getCandidates(board, row, col) {
  const candidates = [];
  for (let num = 1; num <= 18; num++) {
    if (isValid18(board, row, col, num)) candidates.push(num);
  }
  return candidates;
}

// wybiera najlepsze pole (MRV)
function selectBestCell(board) {
  let best = null;
  let bestCandidates = null;

  for (let r = 0; r < 18; r++) {
    for (let c = 0; c < 18; c++) {
      if (board[r][c] === 0) {

        const cand = getCandidates(board, r, c);

        if (cand.length === 0) return null;        // sprzeczność
        if (cand.length === 1) return { r, c, cand };

        if (!best || cand.length < bestCandidates.length) {
          best = { r, c, cand };
          bestCandidates = cand;

          if (cand.length === 2) return best;      // MRV – bardzo dobre
        }
      }
    }
  }

  return best; // może być null = brak pustych pól
}

// szybki backtracking z MRV
function solveSudoku18(board) {

  const cell = selectBestCell(board);
  if (!cell) return true; // brak pustych = sukces

  const { r, c, cand } = cell;

  // heurystyczne sortowanie kandydatów
  cand.sort((a, b) => Math.random() - 0.5);

  for (const num of cand) {

    if (isValid18(board, r, c, num)) {
      board[r][c] = num;

      if (solveSudoku18(board)) return true;

      board[r][c] = 0;
    }
  }

  return false;
}

// odbiór z głównej strony
self.onmessage = function (e) {

  const boardCopy = JSON.parse(JSON.stringify(e.data));

  const solved = solveSudoku18(boardCopy);

  self.postMessage({
    solved,
    board: boardCopy
  });
};
