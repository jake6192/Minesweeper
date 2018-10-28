const _GAME_ = new Game(), cellWidth = 35;

$(document).ready(newGame);
$('.face').click(newGame);
$('*').bind("contextmenu", false);

function appendCSS(selector, properties) {
  let HTMLCSS = `${selector} {`;
  for(var i in properties) HTMLCSS += ` ${properties[i][0]}: ${properties[i][1]}${properties[i][2]?'px':''};`;
  HTMLCSS += ` }`;
  $('style').append(HTMLCSS);
}

function newGame() {
  $('style, .container').html('');
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
  appendCSS('.container', [['max-width', (cellWidth*_GAME_.width), true], ['max-height', (cellWidth*_GAME_.height), true]]);
  appendCSS('.cell', [['width', cellWidth, true], ['height', cellWidth, true], ['line-height', cellWidth, true]]);
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
