/**
 * 
 */

var getStyleSheetValue = (function(elem, prop) {
  if (!elem || !prop) {
    return null;
  }

  var style = window.getComputedStyle(elem);
  var value = style.getPropertyValue(prop);

  return value;
});

// ロードイベント処理
window.addEventListener('load', function() {
  var csObj = document.querySelector('#cs');
  var width = getStyleSheetValue(csObj, 'width');
  var height = getStyleSheetValue(csObj, 'height');
  console.log('width : ' + width);
  console.log('height : ' + height);

  var elem = document.getElementById("cs");
  elem.setAttribute('width', width);
  elem.setAttribute('height', height);
})
