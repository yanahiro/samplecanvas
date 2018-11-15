/**
 * canvas操作
 * canvasに文字を書くための処理
 * IE,EdgeとChromeはイベントの発生順序が異なるため
 * 発生順序を意識しする
 */

// ポインタがcanvas上に存在するかを管理するフラグ
// canvas判定フラグ
var isOnCanvas = false;

// 保存可否判定フラグ
var saveflg = false;

/**
 * マウスオーバーイベント
 * （フォーカスイン）
 * canvas上にカーソルがある場合
 * 
 * @param  なし
 * @return なし
 */
var mouseOver = (function(e) {
  console.log('mouseOver');
  // canvas上からフォーカスが外れて
  // 戻ってきた場合に直前までの
  // 内容を保存する
  if (saveflg) {
    moveflg = 0;
    setLocalStoreage();
    // e.preventDefault();
    ctx.beginPath();
    saveflg = false;
    console.log('mouseOver:save');
  }
  // IE,Edge制御用項目
  isOnCanvas = true;
});

/**
 * マウスリーブイベント
 * （フォーカスアウト）
 * canvas上からカーソルが外れた場合
 * 
 * @param  なし
 * @return なし
 */
var mouseLeave = (function(e) {
  // IE,Edge制御用項目
  isOnCanvas = false;
  console.log('mouseLeave');
});

/**
 * マウスダウンイベント（マウスボタンを押したとき）
 * タッチスタートイベント
 * canvas上でマウスクリック、もしくはタッチした場合
 * 
 * @param  なし
 * @return なし
 */
var startPoint = (function(e) {
  e.preventDefault();
  ctx.beginPath();
 
  Xpoint = e.layerX;
  Ypoint = e.layerY;
   
  ctx.moveTo(Xpoint, Ypoint);
  console.log('start');
  saveflg = true;
  isOnCanvas = true;
});

/**
 * マウスムーブイベント
 * タッチムーブイベント
 * canvas上でマウスを移動、
 * もしくはタッチしたまま移動した場合
 * 
 * @param  なし
 * @return なし
 */
var movePoint = (function(e) {
  // タッチによる画面スクロールを止める
  e.preventDefault();
  // IE,Edge制御用項目
  // mouseoverよりmousemoveが先に発火するため
  // mouseoverイベント前は処理しない
  if (!isOnCanvas) {
    alert('isOnCanvas : ' + isOnCanvas);
    console.log('movePoint : false');
    return;
  }

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

// var movePointForPC = (function(e) {
//   // IE,Edge制御用項目
//   // mouseoverよりmousemoveが先に発火するため
//   // mouseoverイベント前は処理しない
//   if (e.type == 'mousemove' && !isOnCanvas) {
//     console.log('movePoint : false');
//     return;
//   }
//   movePoint(e);
// });
 
/**
 * マウスアップイベント（マウスボタンを離したとき）
 * タッチエンドイベント
 * canvas上でマウスのクリックを離す、
 * もしくはタッチを終了した場合
 * 
 * @param  なし
 * @return なし
 */
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

/**
 * リセット処理
 * canvas上に描画した内容をクリアする
 * 
 * @param  なし
 * @return なし
 */
var resetCanvas = (function() {
  // border分の幅と高さを足す(2px)
  ctx.clearRect(0, 0, ctx.canvas.clientWidth + 2, ctx.canvas.clientHeight + 2);
});
 
/**
 * ストレージ初期化処理
 * localstorageを初期化する
 * 
 * @param  なし
 * @return なし
 */
var initLocalStorage = (function() {
  if (myStorage) {
    myStorage.setItem("__log", JSON.stringify([]));
  }
});

/**
 * ストレージ保存処理
 * 描画した内容をlocalStorageに保存する
 * 
 * @param  なし
 * @return なし
 */
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

/**
 * 戻る処理
 * １つ前の描画内容に戻す
 * 
 * @param  なし
 * @return なし
 */
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
 
/**
 * 進む処理
 * １つ先の描画内容に戻す
 * 
 * @param  なし
 * @return なし
 */
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


/**
 * リセット処理
 * 確認後、localStorageとcanvasを初期化する
 * 
 * @param  なし
 * @return なし
 */
var clearCanvas = (function() {
    if (confirm('Canvasを初期化しますか？')) {
        initLocalStorage();
        temp = [];
        resetCanvas();
    }
});
 
/**
 * 画像変換処理
 * canvas上に記載した内容を画像変換する
 * 
 * @param  なし
 * @return なし
 */
var chgImg = (function() {
  var png = canvas.toDataURL();
 
  document.getElementById("newImg").src = png;
});
 
/**
 * 描画処理
 * canvas上にイメージを描画する
 * 
 * @param  なし
 * @return なし
 */
var draw = (function(src) {
    var img = new Image();
    img.src = src;
 
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
    }
});


/** ---------------------------
 * 
 * 主処理
 * 
 * -------------------------- */

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
canvas.addEventListener('mouseleave', mouseLeave, false);
// スマホ対応
canvas.addEventListener('touchstart', startPoint, false);
canvas.addEventListener('touchmove', movePoint, false);
canvas.addEventListener('touchend', endPoint, false);

