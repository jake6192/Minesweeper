const _GAME_ = new Game();
let timerInterval, timer;

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
  if(timerInterval) clearInterval(timerInterval);
  timer = 0;
  $('style, .container').html('');
  $('#bombs').removeAttr('style');
  $('.face img').attr({ "src": "images/face1.png" });
  _GAME_.width      = +$('#width' ).val();
  _GAME_.height     = +$('#height').val();
  _GAME_.cellWidth  = +$('#cellWidth').val();
  _GAME_.bombs      = +$('#bombs' ).val();
  _GAME_.totalCells = _GAME_.width*_GAME_.height;
  if(_GAME_.bombs > _GAME_.totalCells) {
    endGame();
    _GAME_.bombs = 80;
    $('#bombs').css({'background-color':'rgb(255,30,60)'});
    return;
  }
  $('.counter#remainingBombs').html(_GAME_.bombs);
  timerInterval = setInterval(function() {
    timer++;
    $('.counter#timer').html(timer<10?`00${timer}`:timer<100?`0${timer}`:timer);
    if(timer > 999) clearInterval(timerInterval);
  }, 1000);
  appendCSS('.container', [['max-width', (_GAME_.cellWidth*_GAME_.width), true], ['max-height', (_GAME_.cellWidth*_GAME_.height), true]]);
  appendCSS('.cell', [['width', _GAME_.cellWidth, true], ['height', _GAME_.cellWidth, true], ['line-height', _GAME_.cellWidth, true]]);
  appendCSS('.infoContainer', [['margin', `25px calc(50% - ${(_GAME_.cellWidth*_GAME_.width)/2}px)`, false]]);
  appendCSS('.btn_container', [['margin', `50px calc(50% - ${(_GAME_.cellWidth*_GAME_.width)/2}px)`, false]]);
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
  clearInterval(timerInterval);
  $('.covered').addClass('bomb');
  $('.face > img').attr({'src':'images/face2.png'});
  $('.cell').off("mousedown");
}

function endGame() {
  clearInterval(timerInterval);
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
  let cell = _GAME_.findCell($(this).attr('cellID')), remainingBombs = +$('.counter#remainingBombs').html();
  if(event.which == 3) {
    $(this).toggleClass('flagged');
    cell.state = cell.state=='flagged'?'covered':'flagged';
    if(cell.state == 'flagged') $('.counter#remainingBombs').html(remainingBombs-1);
    else $('.counter#remainingBombs').html(remainingBombs+1);
  } else {
    if(cell.isBomb && cell.state!='flagged') endGame();
    else {
      if(cell.state=='flagged') return;
      cell.state = 'uncovered';
      $(`.cell[cellID="${cell.cellID}"]`).removeClass('covered').addClass('uncovered');
      let _bombs = cell.surroundingBombs;
      if(!$(this).hasClass('flagged')) { $(this).addClass(`blank_${_bombs} uncovered`).removeClass('covered').off("mousedown"); }
      if(_bombs == 0) cell.getSurroundingBlanks();
      if($('.uncovered').length==(_GAME_.totalCells-_GAME_.bombs)+1) completeGame();
    }
  }
}
