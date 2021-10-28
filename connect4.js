"use strict";
/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

function makeBoard() {
  // set "board" to empty HEIGHT x WIDTH matrix array
  for (let i = 0; i < HEIGHT; i++) {
    let row = [];
    for (let i = 0; i < WIDTH; i++) {
      row.push(null);
    }
    board.push(row);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector("#board");
  //create a row above the htmlBoard and set ID: "column-top"
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  //put a number of cells equal to the width in our new top row
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    //give each an id = it's horizontal position
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Build the grid based on the table size. Set each cell's id = its "row-column"
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let i = HEIGHT - 1; i >= 0; i--) {
    if (board[i][x] === null) {
      return i;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // make a div and insert into correct table cell
  let cell = document.getElementById(`${y}-${x}`);
  let piece = document.createElement("div");
  piece.classList.add("piece");
  if (currPlayer === 2) {
    piece.classList.add("p2");
  }
  cell.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  //pop up alert message after last piece has fallen
  setTimeout(() => {
    alert(msg);
  }, 800);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  //does nothing if game is already over
  if (checkForWin()) {
    alert("Game is over! Refresh the page for a new game!");
    return;
  }

  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    if (currPlayer === 1) {
      return endGame(`RED is the winner!`);
    } else {
      return endGame(`BLUE is the winner!`);
    }
  }

  // check if all cells in board are filled; if so call, call endGame as a tie
  if (
    board.every((arr) => {
      return arr.every((cell) => {
        return cell !== null;
      });
    })
  ) {
    endGame(
      `Somehow, you've managed a tie. You probably didn't even try to win...`
    );
  }

  // switch players
  currPlayer === 1 ? currPlayer++ : currPlayer--;

  //change text color
  let text = document.getElementById("colorText");
  text.classList.toggle("p2Color");

  //change text
  if (text.innerHTML === "RED") {
    text.innerHTML = "BLUE";
  } else {
    text.innerHTML = "RED";
  }
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      /** for every cell, take it and the three cells to its right
       * and put them in _win function. (some may not be valid cells
       * and beyond the dimensions of the board. For example starting
       * with [5,5] would include [5,6],[5,7],[5,8], the last of
       * which would not be on the board and would not pass the
       * cells.every condition no matter what.) */
      let horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      //for every cell, take it and the three cells below and put them in _win function.
      let vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      //for every cell, take it and the three cells diagonally down and right and put in _win function.
      let diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      //for every cell, take it and the three cells diagonally down and right and put in _win function.
      let diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];
      /**If we have four in a row in any orientation, within the board dimensions,
       * and all belonging to the same player, checkForWin() returns true.*/
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
