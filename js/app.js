class Game {
  constructor() {
    this.gameState = 'idle';
    this.cells = [];
    this.width = 0;
    this.height = 0;
    this.cellWidth = 0;
    this.totalCells = this.width*this.height;
    this.bombs = 0;
  }

  getRandomCell() {
    let random = Math.floor((Math.random() * this.totalCells) + 0);
    for(let i = 0; i < this.cells.length; i++) {
      if(this.cells[i].cellID != random) continue;
      return this.cells[i];
    }
    return {isBomb:true};
  }

  fillBombs() {
    let setBombs = this.bombs;
    while(setBombs > 0) {
      let cell = this.getRandomCell();
      if(!cell.isBomb) {
        cell.isBomb = true;
        setBombs--;
      }
    }
  }

  drawCells() {
    this.cells = [];
    for(let row = 1; row <= this.height; row++) {
      for(let col = 1; col <= this.width; col++) {
        let cell = new Cell(row, col);
        $('.container').append(cell.HTML);
      }
    }
    $('.cell.covered').mousedown(clickEvent);
  }

  setupCells() {
    for(let i = 0; i < this.cells.length; i++) {
      if(this.cells[i].isBomb) continue;
      this.cells[i].getSurroundingBombs();
    }
  }

  findCell(cellID) {
    for(let i = 0; i < this.cells.length; i++) {
      if(this.cells[i].cellID != cellID) continue;
      return this.cells[i];
    }
    return;
  }

  tooManyBombs() {
    endGame();
    this.bombs = Math.floor(this.totalCells*0.75);
    $('#bombs').val(this.bombs).css({'background-color':'rgb(255,30,60)'});
  }
}


//****************************************************************************//


class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.surroundingBombs = 0;
    this.isBomb = false;
    this.state = 'covered';
    _GAME_.cells.push(this);
    this.cellID = _GAME_.cells.length;
    this.HTML = `<div class="cell covered" cellID="${this.cellID}" row="${this.row}" col="${this.col}"></div>`;
  }

  getSurroundingBombs() {
    for(let i = 0, cellID; i < 8; i++) {
      cellID = surround(this, i);
      if(cellID === 'continue') continue;
      let cell = _GAME_.findCell(cellID);
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


//****************************************************************************//


function surround(obj, i) {
  let row, col, cellID;
  switch(i) {
    case 0: if(obj.col > 1 && obj.row > 1) { row = (obj.row-1); col = (obj.col-1); cellID = (_GAME_.width*row)-(_GAME_.width-col); } else return 'continue'; break;
    case 1: if(obj.row > 1) { row = (obj.row-1); cellID = (_GAME_.width*row)-(_GAME_.width-obj.col); } else return 'continue'; break;
    case 2: if(obj.col < _GAME_.width && obj.row > 1) { row = (obj.row-1); col = (obj.col+1); cellID = (_GAME_.width*row)-(_GAME_.width-col); } else return 'continue'; break;
    case 3: if(obj.col < _GAME_.width) { col = (obj.col+1); cellID = (_GAME_.width*obj.row)-(_GAME_.width-col); } else return 'continue'; break;
    case 4: if(obj.col < _GAME_.width && obj.row < _GAME_.height) { row = (obj.row+1); col = (obj.col+1); cellID = (_GAME_.width*row)-(_GAME_.width-col); } else return 'continue'; break;
    case 5: if(obj.row < _GAME_.height) { row = (obj.row+1); cellID = (_GAME_.width*row)-(_GAME_.width-obj.col); } else return 'continue'; break;
    case 6: if(obj.col > 1 && obj.row < _GAME_.height) { row = (obj.row+1); col = (obj.col-1); cellID = (_GAME_.width*row)-(_GAME_.width-col); } else return 'continue'; break;
    case 7: if(obj.col > 1) { col = (obj.col-1); cellID = (_GAME_.width*obj.row)-(_GAME_.width-col); } else return 'continue'; break;
  }
  return cellID;
}

function getRandomBomb_Blank() { // (Bomb OR Blank) //
  let blankCell;
  while(!blankCell) {
    let cell = _GAME_.getRandomCell();
    if(cell.surroundingBombs == 0) blankCell = cell;
  }
  return blankCell;
}
