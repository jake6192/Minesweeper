let _GAME_ = new Game();

$(document).ready(newGame);
$('.face').click(newGame);
$('*').bind("contextmenu", false);

function newGame() {
  $('.container').html('');
  _GAME_.width  = +$('#width' ).val();
  _GAME_.height = +$('#height').val();
  _GAME_.bombs  = +$('#bombs' ).val();
  _GAME_.totalCells = _GAME_.width*_GAME_.height;

  if(_GAME_.bombs > _GAME_.totalCells) {
    endGame();
    _GAME_.bombs = 80;
    $('#bombs').css({'background-color':'rgb(255,30,60)'});
    return;
  }
  writeCSS();
  _GAME_.drawCells();
  _GAME_.fillBombs();
  _GAME_.setupCells();
  let cell, interval = setInterval(function() {
    cell = getRandomBomb_Blank();
    if(!cell.isBomb) {
      $(`.cell[cellID="${cell.cellID}"]`).mousedown();
      clearInterval(interval);
      return;
    }
  }, 250);
  _GAME_.gameState = 'playing';
}

function completeGame() {
  $('.covered').addClass('bomb');
  $('.face > img').attr({'src':'images/face2.png'});
  $('.cell').off("mousedown");
}

function endGame() {
  let covered = $('.covered');
  for(var i = 0; i < covered.length; i++) {
    let cell = _GAME_.findCell($(covered[i]).attr('cellID'));
    if(!cell.isBomb) {
      if(cell.state=='flagged') $(`.cell[cellID="${cell.cellID}"]`).removeClass('covered flagged').addClass('bomb').text('X');
      else $(`.cell[cellID="${cell.cellID}"]`).removeClass('covered').addClass(`blank_${cell.surroundingBombs}`);
    } else {
      $(`.cell[cellID="${cell.cellID}"]`).removeClass('covered').addClass('uncovered bomb');
      $('.button#newGame').show();
      $('.face > img').attr({'src':'images/face3.png'});
    }
  }
  _GAME_.gameState = 'ended';
  $('.cell').off("mousedown");
}

function clickEvent(event) {
  let cell = _GAME_.findCell($(this).attr('cellID'));
  if(event.which == 3) {
    $(this).toggleClass('flagged');
    cell.state = cell.state=='flagged'?'covered':'flagged';
  } else {
    if(cell.isBomb && cell.state!='flagged') endGame();
    else {
      if(cell.state=='flagged') return;
      cell.state = 'uncovered';
      $(`.cell[cellID="${cell.cellID}"]`).removeClass('covered').addClass('uncovered');
      let _bombs = cell.surroundingBombs;
      if(!$(this).hasClass('flagged')) { $(this).addClass(`blank_${_bombs} uncovered`).removeClass('covered').off("mousedown"); }
      if(_bombs == 0) cell.getSurroundingBlanks();
      if($('.uncovered').length==(_GAME_.totalCells-_GAME_.bombs)) completeGame();
    }
  }
}

function writeCSS() {
  let HTMLCSS;
  HTMLCSS  = `<style type="text/css">`;
  HTMLCSS +=   `.container {`;
  HTMLCSS +=     `max-width: ${35*_GAME_.width}px;`;
  HTMLCSS +=     `max-height: ${35*_GAME_.height}px;`;
  HTMLCSS +=   `}`;
  HTMLCSS += `</style>`;
  $('head').append(HTMLCSS);
}
