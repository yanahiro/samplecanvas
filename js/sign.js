/**
 * 電子署名関連
 */

var startPoint = (function(e) {
  e.preventDefault();
  ctx.beginPath();
 
  Xpoint = e.layerX;
  Ypoint = e.layerY;
   
  ctx.moveTo(Xpoint, Ypoint);
});
 
var movePoint = (function(e) {
  if(e.buttons === 1 || e.witch === 1 || e.type == 'touchmove') {
    Xpoint = e.layerX;
    Ypoint = e.layerY;
    moveflg = 1;
     
    ctx.lineTo(Xpoint, Ypoint);
    ctx.lineCap = "round";
    ctx.lineWidth = defSize * 2;
    ctx.strokeStyle = defColor;
    ctx.stroke();
     
  }
});
 
var endPoint = (function(e) {
 
    if(moveflg === 0) {
       ctx.lineTo(Xpoint-1, Ypoint-1);
       ctx.lineCap = "round";
       ctx.lineWidth = defSize * 2;
       ctx.strokeStyle = defColor;
       ctx.stroke();
        
    }
    moveflg = 0;
  setLocalStoreage();
});
 
var clearCanvas = (function() {
    if(confirm('Canvasを初期化しますか？'))
    {
        initLocalStorage();
        temp = [];
        resetCanvas();
    }
});
 
var resetCanvas = (function() {
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
});
 
var chgImg = (function() {
  var png = canvas.toDataURL();
 
  document.getElementById("newImg").src = png;
});
 
var initLocalStorage = (function() {
    myStorage.setItem("__log", JSON.stringify([]));
});

var setLocalStoreage = (function() {
    var png = canvas.toDataURL();
    var logs = JSON.parse(myStorage.getItem("__log"));
 
    setTimeout(function(){
        logs.unshift({0:png});
 
        myStorage.setItem("__log", JSON.stringify(logs));
 
        currentCanvas = 0;
        temp = [];
    }, 0);
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
    Ypoint;
 
//初期値（サイズ、色、アルファ値）の決定
var defSize = 1,
    defColor = "#555";
 
 
// ストレージの初期化
var myStorage = localStorage;
window.onload = initLocalStorage();
 
// PC対応
canvas.addEventListener('mousedown', startPoint, false);
canvas.addEventListener('mousemove', movePoint, false);
canvas.addEventListener('mouseup', endPoint, false);
// スマホ対応
canvas.addEventListener('touchstart', startPoint, false);
canvas.addEventListener('touchmove', movePoint, false);
canvas.addEventListener('touchend', endPoint, false);
