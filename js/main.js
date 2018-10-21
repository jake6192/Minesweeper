const width = 15;
const height = 20;
const bombs = 80;

$(document).ready(function() {
  writeCSS();
  drawCells();
  fillBombs();
  setupCells();
});

function endGame() {
  // alert('endgame');
}

function writeCSS() {
  let HTMLCSS = ``;
  HTMLCSS += `<style type="text/css">`;
  HTMLCSS +=   `.container {`;
  HTMLCSS +=     `max-width: ${35*width}px;`;
  HTMLCSS +=     `max-height: ${35*height}px;`;
  HTMLCSS +=     `margin: 50px auto;`;
  HTMLCSS +=     `background-color: rgb(255, 255, 255);`;
  HTMLCSS +=     `border: 3px groove #999;`;
  HTMLCSS +=     `display: flex;`;
  HTMLCSS +=     `flex-wrap: wrap;`;
  HTMLCSS +=   `}`;
  HTMLCSS += `</style>`;
  $('head').append(HTMLCSS);
}

function drawCells() {
  for(let row = 1; row <= height; row++) {
    for(let col = 1; col <= width; col++) {
      let cell = new Cell(row, col);
      $('.container').append(cell.HTML);
    }
  }
  $('.cell.covered').bind("contextmenu",function(e){
    return false;
  }).mousedown(function(event) {
    let cell = findCell($(this).attr('cellID'));
    if(event.which == 3) {
      $(this).toggleClass('flagged');
      cell.state = $(this).hasClass('flagged')?'flagged':'covered';
    } else {
      let cell = findCell($(this).attr('cellID'));
      if(cell.isBomb) endGame(); //TODO//
      else {
        cell.state = 'uncovered';
        let _bombs = cell.surroundingBombs;
        if(!$(this).hasClass('flagged')) { $(this).addClass(getClass(_bombs)).removeClass('covered').addClass('uncovered').off("click"); }
        if(_bombs == 0) cell.getSurroundingBlanks();
      }
    }
  });
}

function getClass(num) {
  switch(num) {
    case 0: return 'blank_0'; break;
    case 1: return 'blank_1'; break;
    case 2: return 'blank_2'; break;
    case 3: return 'blank_3'; break;
    case 4: return 'blank_4'; break;
    case 5: return 'blank_5'; break;
    case 6: return 'blank_6'; break;
    case 7: return 'blank_7'; break;
    case 8: return 'blank_8'; break;
  }
}

function fillBombs() {
  let setBombs = bombs;
  while(setBombs > 0) {
    let cell = getRandomCell();
    if(!cell.isBomb) {
      cell.isBomb = true;
      setBombs--;
    }
  }
}

function setupCells() {
  for(let i = 0; i < cells.length; i++) {
    if(cells[i].isBomb) continue;
    cells[i].getSurroundingBombs();
  }
}
