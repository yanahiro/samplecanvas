/**
 * 電子署名関連
 */

var saveflg = false;
var mouseOver = (function(e) {
  console.log('mouseOver');
  if (saveflg) {
    moveflg = 0;
    setLocalStoreage();
    e.preventDefault();
    ctx.beginPath();
  }
});

var startPoint = (function(e) {
  e.preventDefault();
  ctx.beginPath();
 
  Xpoint = e.layerX;
  Ypoint = e.layerY;
   
  ctx.moveTo(Xpoint, Ypoint);
  console.log('start');
  saveflg = true;
});

var movePoint = (function(e) {
  if (e.buttons === 1 || e.witch === 1 || e.type == 'touchmove') {
    console.log('in');
    Xpoint = e.layerX;
    Ypoint = e.layerY;
    moveflg = 1;
     
    ctx.lineTo(Xpoint, Ypoint);
    ctx.lineCap = "round";
    ctx.lineWidth = defSize * 2;
    ctx.strokeStyle = defColor;
    ctx.stroke();     

    saveflg = true;
  }
});
 
var endPoint = (function(e) { 
  if (moveflg === 0) {
     ctx.lineTo(Xpoint-1, Ypoint-1);
     ctx.lineCap = "round";
     ctx.lineWidth = defSize * 2;
     ctx.strokeStyle = defColor;
     ctx.stroke();
     console.log('endpoint1');      
     saveflg = true;
  }
  console.log('endpoint2');      
  moveflg = 0;
  setLocalStoreage();
  saveflg = false;
});
 
var resetCanvas = (function() {
    ctx.clearRect(0, 0, ctx.canvas.clientWidth + 2, ctx.canvas.clientHeight + 2);
});
 
var initLocalStorage = (function() {
  if (myStorage) {
    myStorage.setItem("__log", JSON.stringify([]));
  }
});

var setLocalStoreage = (function() {
    var png = canvas.toDataURL();
    var logs = JSON.parse(myStorage.getItem("__log"));

    setTimeout(function() {
        // logs.unshift({png});
        logs.unshift({ png: png });
 
        myStorage.setItem("__log", JSON.stringify(logs));

        currentCanvas = 0;
        temp = [];
    }, 0);
});

var prevCanvas = (function() {
    var logs = JSON.parse(myStorage.getItem("__log"));
 
    if (logs.length > 0) {
        temp.unshift(logs.shift());
 
        setTimeout(function() {
            myStorage.setItem("__log", JSON.stringify(logs));
            resetCanvas();
            console.log(logs[0]['png']);
            draw(logs[0]['png']);
 
        }, 0);
    }
});
 
var nextCanvas = (function() {
    var logs = JSON.parse(myStorage.getItem("__log"));
 
    if (temp.length > 0) {
        logs.unshift(temp.shift());
 
        setTimeout(function() {
            myStorage.setItem("__log", JSON.stringify(logs));
            resetCanvas();
 
            draw(logs[0]['png']);
 
        }, 0);
    }
});

var clearCanvas = (function() {
    if (confirm('Canvasを初期化しますか？')) {
        initLocalStorage();
        temp = [];
        resetCanvas();
    }
});
 
var chgImg = (function() {
  var png = canvas.toDataURL();
 
  document.getElementById("newImg").src = png;
});
 


var draw = (function(src) {
    var img = new Image();
    img.src = src;
 
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
    }
});

var canvas = document.getElementById('cs'),
    ctx = canvas.getContext('2d'),
    moveflg = 0,
    Xpoint,
    Ypoint,
    currentCanvas,
    temp = [];
 
//初期値（サイズ、色、アルファ値）の決定
var defSize = 1;
var defColor = "#555";
 
 
// ストレージの初期化
var myStorage = localStorage;
window.onload = initLocalStorage();
 
// PC対応
canvas.addEventListener('mouseover', mouseOver, false);
canvas.addEventListener('mousedown', startPoint, false);
canvas.addEventListener('mousemove', movePoint, false);
canvas.addEventListener('mouseup', endPoint, false);
// canvas.addEventListener('mouseleave', endPoint, false);
// スマホ対応
canvas.addEventListener('touchstart', startPoint, false);
canvas.addEventListener('touchmove', movePoint, false);
canvas.addEventListener('touchend', endPoint, false);
