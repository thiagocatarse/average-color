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

function getAverageColor(img) {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var width = canvas.width = img.naturalWidth;
  var height = canvas.height = img.naturalHeight;

  ctx.drawImage(img, 0, 0);

  var imageData = ctx.getImageData(0, 0, width, height);
  var data = imageData.data;
  var r = 0;
  var g = 0;
  var b = 0;

  for (var i = 0, l = data.length; i < l; i += 4) {
    r += data[i];
    g += data[i+1];
    b += data[i+2];
  }

  r = Math.floor(r / (data.length / 4));
  g = Math.floor(g / (data.length / 4));
  b = Math.floor(b / (data.length / 4));

  return { r: r, g: g, b: b };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0;
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h, s: s, l: l };
}

function modifyHSL(hsl) {
  return {
    h: hsl.h,
    s: Math.min(hsl.s + 0.1, 1),
    l: Math.max(hsl.l - 0.1, 0)
  };
}

function handleImages(files) {
  document.getElementById('images').innerHTML = '';

  for (var i = 0; i < files.length; i++) {
    addImage(files[i]);
  }
}

document.ondragover = function(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
};

document.ondrop = function(event) {
  event.preventDefault();
  handleImages(event.dataTransfer.files);
};

(function() {
  var upload = document.getElementById('upload');
  var target = document.getElementById('target');

  upload.onchange = function() {
    handleImages(this.files);
  };

  target.onclick = function() {
    upload.click();
  };
})();
