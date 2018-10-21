let cells = [];

class Cell {
  constructor(row, col) {
    cells.push(this);
    this.cellID = cells.length;
    this.row = row;
    this.col = col;
    this.surroundingBombs = 0;
    this.isBomb = false;
    this.state = 'covered';
    this.HTML = `<a class="cell covered" cellID="${this.cellID}" row="${this.row}" col="${this.col}"></a>`;
  }

  getSurroundingBombs() {
    for(let i = 0, row, col, cellID=0; i < 8; i++) {
      switch(i) {
        case 0: if(this.col > 1 && this.row > 1) { row = (this.row-1); col = (this.col-1); cellID = (width*row)-(width-col); } else continue; break;
        case 1: if(this.row > 1) { row = (this.row-1); cellID = (width*row)-(width-this.col); } else continue; break;
        case 2: if(this.col < width && this.row > 1) { row = (this.row-1); col = (this.col+1); cellID = (width*row)-(width-col); } else continue; break;
        case 3: if(this.col < width) { col = (this.col+1); cellID = (width*this.row)-(width-col); } else continue; break;
        case 4: if(this.col < width && this.row < height) { row = (this.row+1); col = (this.col+1); cellID = (width*row)-(width-col); } else continue; break;
        case 5: if(this.row < height) { row = (this.row+1); cellID = (width*row)-(width-this.col); } else continue; break;
        case 6: if(this.col > 1 && this.row < height) { row = (this.row+1); col = (this.col-1); cellID = (width*row)-(width-col); } else continue; break;
        case 7: if(this.col > 1) { col = (this.col-1); cellID = (width*this.row)-(width-col); } else continue; break;
      }
      let cell = findCell(cellID);
      if(cell) if(cell.isBomb) this.surroundingBombs++;
    }
  }
  getSurroundingBlanks() {
    for(var i = 0, row, col, cellID; i < 8; i++) {
      switch(i) {
        case 0: if(this.col > 1 && this.row > 1) { row = (this.row-1); col = (this.col-1); cellID = (width*row)-(width-col); } else continue; break;
        case 1: if(this.row > 1) { row = (this.row-1); cellID = (width*row)-(width-this.col); } else continue; break;
        case 2: if(this.col < width && this.row > 1) { row = (this.row-1); col = (this.col+1); cellID = (width*row)-(width-col); } else continue; break;
        case 3: if(this.col < width) { col = (this.col+1); cellID = (width*this.row)-(width-col); } else continue; break;
        case 4: if(this.col < width && this.row < height) { row = (this.row+1); col = (this.col+1); cellID = (width*row)-(width-col); } else continue; break;
        case 5: if(this.row < height) { row = (this.row+1); cellID = (width*row)-(width-this.col); } else continue; break;
        case 6: if(this.col > 1 && this.row < height) { row = (this.row+1); col = (this.col-1); cellID = (width*row)-(width-col); } else continue; break;
        case 7: if(this.col > 1) { col = (this.col-1); cellID = (width*this.row)-(width-col); } else continue; break;
      }
      $(`.cell[cellID="${cellID}"]`).mousedown();
    }
  }
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
