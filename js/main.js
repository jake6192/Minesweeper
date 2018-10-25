let game = new Game(), width, height, totalCells, bombs;

$(document).ready(newGame);
$('.face').click(newGame);

function newGame() {
  $('.container').html('');
  width  = +$('#width' ).val();
  height = +$('#height').val();
  bombs  = +$('#bombs' ).val();
  totalCells = width*height;

  if(bombs > totalCells) {
    endGame();
    bombs = 80;
    $('#bombs').css({'background-color':'rgb(255,30,60)'});
    return;
  }
  writeCSS();
  drawCells();
  fillBombs();
  setupCells();
  let cell, interval = setInterval(function() {
    cell = getRandomBomb_Blank();
    if(!cell.isBomb) {
      $(`.cell[cellID="${cell.cellID}"]`).mousedown();
      clearInterval(interval);
      return;
    }
  }, 250);
  game.gameState = 'playing';
}

function completeGame() {
  $('.covered').addClass('bomb');
  $('.face > img').attr({'src':'images/face2.png'});
}

function endGame() {
  let covered = $('.covered');
  for(var i = 0; i < covered.length; i++) {
    let cell = findCell($(covered[i]).attr('cellID'));
    if(!cell.isBomb) {
      $(`.cell[cellID="${cell.cellID}"]`).removeClass('covered').addClass(getClass(cell.surroundingBombs));
    } else {
      $(`.cell[cellID="${cell.cellID}"]`).addClass('bomb');
      $('.button#newGame').show();
      $('.face > img').attr({'src':'images/face3.png'});
    }
  }
  game.gameState = 'ended';
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
  cells = [];
  for(let row = 1; row <= height; row++) {
    for(let col = 1; col <= width; col++) {
      let cell = new Cell(row, col);
      $('.container').append(cell.HTML);
    }
  }
  $('.cell.covered')
  .bind("contextmenu", false)
  .mousedown(function(event) {
    let cell = findCell($(this).attr('cellID'));
    if(event.which == 3) {
      $(this).toggleClass('flagged');
      cell.state = cell.state=='flagged'?'covered':'flagged';
    } else {
      if(cell.isBomb && cell.state!='flagged') endGame();
      else {
        cell.state = 'uncovered';
        $(`.cell[cellID="${cell.cellID}"]`).removeClass('covered').addClass('uncovered');
        let _bombs = cell.surroundingBombs, _class = getClass(_bombs);
        if(!$(this).hasClass('flagged')) { $(this).addClass(`${_class} uncovered`).removeClass('covered').off("mousedown"); }
        if(_bombs == 0) cell.getSurroundingBlanks();
        if($('.uncovered').length==totalCells) completeGame();
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
