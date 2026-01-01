// =========================
// SZYBKI SOLVER 18x18 MRV – NAPRAWIONY
// =========================

// sprawdzanie poprawności
function isValid18(board, row, col, num) {

  // wiersz
  for (let c = 0; c < 18; c++) {
    if (board[row][c] === num) return false;
  }

  // kolumna
  for (let r = 0; r < 18; r++) {
    if (board[r][col] === num) return false;
  }

  // blok 3x6
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 6) * 6;

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 6; c++) {
      if (board[startRow + r][startCol + c] === num) return false;
    }
  }

  return true;
}

// lista kandydatów
function getCandidates(board, row, col) {
  const cand = [];
  for (let num = 1; num <= 18; num++) {
    if (isValid18(board, row, col, num)) cand.push(num);
  }
  return cand;
}

// wybór komórki MRV
function selectBestCell(board) {
  let best = null;
  let bestCandidates = null;

  for (let r = 0; r < 18; r++) {
    for (let c = 0; c < 18; c++) {

      if (board[r][c] !== 0) continue;

      const cand = getCandidates(board, r, c);

      // brak kandydatów => SPRZECZNOŚĆ
      if (cand.length === 0) return { status: "FAIL" };

      if (!best || cand.length < bestCandidates.length) {
        best = { r, c, cand };
        bestCandidates = cand;

        if (cand.length === 1) return { status: "OK", ...best };
      }
    }
  }

  // brak pustych pól => ROZWIĄZANE
  if (!best) return { status: "SOLVED" };

  return { status: "OK", ...best };
}

// solver
function solveSudoku18(board) {

  const choice = selectBestCell(board);

  if (choice.status === "SOLVED") return true;
  if (choice.status === "FAIL") return false;

  const { r, c, cand } = choice;

  // losowa kolejność kandydatów dla rozproszenia drzewa
  cand.sort(() => Math.random() - 0.5);

  for (const num of cand) {
    board[r][c] = num;

    if (solveSudoku18(board)) return true;

    board[r][c] = 0;
  }

  return false;
}

// odbiór z głównego wątku
self.onmessage = function (e) {

  const boardCopy = JSON.parse(JSON.stringify(e.data));

  const solved = solveSudoku18(boardCopy);

  self.postMessage({
    solved,
    board: boardCopy
  });
};
