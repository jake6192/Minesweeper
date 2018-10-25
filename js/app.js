let cells = [];

class Game {
  constructor() {
    this.gameState = 'idle';
  }
}


class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.surroundingBombs = 0;
    this.isBomb = false;
    this.state = 'covered';
    cells.push(this);
    this.cellID = cells.length;
    this.HTML = `<div class="cell covered" cellID="${this.cellID}" row="${this.row}" col="${this.col}"></div>`;
  }

  getSurroundingBombs() {
    for(let i = 0, cellID; i < 8; i++) {
      cellID = surround(this, i);
      if(cellID === 'continue') continue;
      let cell = findCell(cellID);
      if(cell) if(cell.isBomb) this.surroundingBombs++;
    }
  }
  getSurroundingBlanks() {
    for(var i = 0, cellID; i < 8; i++) {
      cellID = surround(this, i);
      if(cellID === 'continue') continue;
      $(`.cell[cellID="${cellID}"]`).mousedown();
    }
  }
}


function surround(obj, i) {
  let row, col, cellID;
  switch(i) {
    case 0: if(obj.col > 1 && obj.row > 1) { row = (obj.row-1); col = (obj.col-1); cellID = (width*row)-(width-col); } else return 'continue'; break;
    case 1: if(obj.row > 1) { row = (obj.row-1); cellID = (width*row)-(width-obj.col); } else return 'continue'; break;
    case 2: if(obj.col < width && obj.row > 1) { row = (obj.row-1); col = (obj.col+1); cellID = (width*row)-(width-col); } else return 'continue'; break;
    case 3: if(obj.col < width) { col = (obj.col+1); cellID = (width*obj.row)-(width-col); } else return 'continue'; break;
    case 4: if(obj.col < width && obj.row < height) { row = (obj.row+1); col = (obj.col+1); cellID = (width*row)-(width-col); } else return 'continue'; break;
    case 5: if(obj.row < height) { row = (obj.row+1); cellID = (width*row)-(width-obj.col); } else return 'continue'; break;
    case 6: if(obj.col > 1 && obj.row < height) { row = (obj.row+1); col = (obj.col-1); cellID = (width*row)-(width-col); } else return 'continue'; break;
    case 7: if(obj.col > 1) { col = (obj.col-1); cellID = (width*obj.row)-(width-col); } else return 'continue'; break;
  }
  return cellID;
}

function findCell(cellID) {
  for(let i = 0; i < cells.length; i++) {
    if(cells[i].cellID != cellID) continue;
    return cells[i];
  }
  return;
}

function getRandomCell() {
  let random = Math.floor((Math.random() * (width*height)) + 0);
  for(let i = 0; i < cells.length; i++) {
    if(cells[i].cellID != random) continue;
    return cells[i];
  }
  return {isBomb:true};
}

function getRandomBomb_Blank() { // (Bomb OR Blank) //
  let blankCell;
  while(!blankCell) {
    let cell = getRandomCell();
    if(cell.surroundingBombs == 0) blankCell = cell;
  }
  return blankCell;
}
