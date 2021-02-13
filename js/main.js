let _GAME_ = new Game(),
timerInterval,
previousGameState = [];

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
  _GAME_.timer = 0;
  $('style, .container').html('');
  $('#bombs').removeAttr('style');
  $('.face img').attr({ "src": "images/face1.png" });
  $('#bombs').off("mouseleave mouseenter");
  _GAME_.width      = +$('#width' ).val();
  _GAME_.height     = +$('#height').val();
  _GAME_.cellWidth  = +$('#cellWidth').val();
  _GAME_.bombs      = +$('#bombs' ).val();
  _GAME_.totalCells = _GAME_.width*_GAME_.height;
  $('.counter#remainingBombs').html(_GAME_.bombs);
  timerInterval = setInterval(function() {
    _GAME_.timer++;
    $('.counter#timer').html(_GAME_.timer<10?`00${_GAME_.timer}`:_GAME_.timer<100?`0${_GAME_.timer}`:_GAME_.timer);
    if(_GAME_.timer > 999) clearInterval(timerInterval);
  }, 1000);
  appendCSS('.container', [['max-width', (_GAME_.cellWidth*_GAME_.width), true], ['max-height', (_GAME_.cellWidth*_GAME_.height), true]]);
  appendCSS('.cell', [['width', _GAME_.cellWidth, true], ['height', _GAME_.cellWidth, true], ['line-height', _GAME_.cellWidth, true]]);
  appendCSS('.infoContainer', [['margin', `25px calc(50% - ${(_GAME_.cellWidth*_GAME_.width)/2}px)`, false]]);
  appendCSS('.btn_container', [['margin', `50px calc(50% - ${(_GAME_.cellWidth*_GAME_.width)/2}px)`, false]]);
  _GAME_.drawCells();
  if(_GAME_.bombs > _GAME_.totalCells*0.75) {
    _GAME_.tooManyBombs();
  } else {
    _GAME_.fillBombs();
    _GAME_.setupCells();
    let cell, interval = setInterval(function() {
      cell = getRandomBomb_Blank();
      if(!cell.isBomb) {
        $(`.cell[cellID="${cell.cellID}"]`).mousedown();
        clearInterval(interval);
        $('#undo').hide();
        return;
      }
    }, 250);
    _GAME_.gameState = 'playing';
    previousGameState[0] = $('.container').html();
    previousGameState[1] = _GAME_;
  }
}

function undoMove() {
  if(previousGameState !== []) {
    $('.container').html(previousGameState[0]);
    _GAME_ = previousGameState[1];
    previousGameState = [];
    $('.cell.covered').mousedown(clickEvent);
    $('#undo').hide();

    if(!timerInterval) timerInterval = setInterval(function() {
      _GAME_.timer++;
      $('.counter#timer').html(_GAME_.timer<10?`00${_GAME_.timer}`:_GAME_.timer<100?`0${_GAME_.timer}`:_GAME_.timer);
      if(_GAME_.timer > 999) clearInterval(timerInterval);
    }, 1000);
  }
}

function completeGame() {
  clearInterval(timerInterval);
  timerInterval = null;
  $('.covered, .flagged').addClass('bomb');
  $('.face > img').attr({'src':'images/face2.png'});
  $('.cell').off("mousedown");
}

function endGame() {
  clearInterval(timerInterval);
  timerInterval = null;
  let covered = $('.covered');
  for(var i = 0; i < covered.length; i++) {
    let cell = _GAME_.findCell($(covered[i]).attr('cellID'));
    if(!cell.isBomb) {
      if(cell.state=='flagged') $(`.cell[cellID="${cell.cellID}"]`).removeClass('covered flagged').addClass('bomb incorrect').text('X');
      else $(`.cell[cellID="${cell.cellID}"]`).removeClass('covered').addClass(`blank_${cell.surroundingBombs}`);
    } else {
      $(`.cell[cellID="${cell.cellID}"]`).removeClass('covered').addClass('uncovered bomb');
      $('.button#newGame').show();
      $('.face > img').attr({'src':'images/face3.png'});
    }
  }
  $('.covered, .flagged').addClass('bomb');
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
    previousGameState[0] = $('.container').html();
    previousGameState[1] = _GAME_;
    $('#undo').show();

    if(cell.isBomb && cell.state!='flagged') {
      $(this).addClass('detonated');
      endGame();
    } else {
      if(cell.state=='flagged') return;
      cell.state = 'uncovered';
      $(`.cell[cellID="${cell.cellID}"]`).removeClass('covered').addClass('uncovered');
      let _bombs = cell.surroundingBombs;
      if(!$(this).hasClass('flagged')) { $(this).addClass(`blank_${_bombs} uncovered`).removeClass('covered').off("mousedown"); }
      if(_bombs == 0) cell.getSurroundingBlanks();
      if($('.covered').length==_GAME_.bombs) completeGame();
    }
  }
}
