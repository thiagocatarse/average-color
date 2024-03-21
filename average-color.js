function addImage(file) {
  var element = document.createElement('div');
  element.className = 'row';
  element.innerHTML =
    '<div class="cell image">' +
    '  <img />' +
    '</div>' +
    '<div class="cell color">' +
    '  <div class="box original"></div>' +
    '  <ul>' +
    '    <li class="hsl original"></li>' +
    '  </ul>' +
    '</div>' +
    '<div class="cell color modified">' +
    '  <div class="box modified"></div>' +
    '  <ul>' +
    '    <li class="hsl modified"></li>' +
    '  </ul>' +
    '</div>';

  var img = element.querySelector('img');
  img.src = URL.createObjectURL(file);
  img.onload = function() {
    var rgb = getAverageColor(img);
    var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    var modifiedHSL = modifyHSL(hsl);
    
    var originalHslStr = 'hsl(' + Math.round(hsl.h * 360) + ', ' + Math.round(hsl.s * 100) + '%, ' + Math.round(hsl.l * 100) + '%)';
    var modifiedHslStr = 'hsl(' + Math.round(modifiedHSL.h * 360) + ', ' + Math.round(modifiedHSL.s * 100) + '%, ' + Math.round(modifiedHSL.l * 100) + '%)';
    
    var originalBox = element.querySelector('.box.original');
    var modifiedBox = element.querySelector('.box.modified');
    originalBox.style.backgroundColor = originalHslStr;
    modifiedBox.style.backgroundColor = modifiedHslStr;

    element.querySelector('.hsl.original').textContent = 'Original: ' + originalHslStr;
    element.querySelector('.hsl.modified').textContent = 'Modified: ' + modifiedHslStr;
  };

  document.getElementById('images').appendChild(element);
}

// The rest of the functions (getAverageColor, rgbToHsl, modifyHSL, handleImages, and event handlers) remain unchanged.
