
var UIUtils = {
  drawVerifiedSymbol: function (element, result) {
    if (result) {
        const imgDim= {width:e(element).width/5,height:e(element).width/5}; //logo dimention
        var context = e(element).getContext('2d');
        var imageObj = new Image();  
        imageObj.src = './img/ok-256.png';      
        imageObj.onload = function() {
            context.drawImage(imageObj, 
            e(element).width / 2 - imgDim.width / 2 +1,
            e(element).height / 2 - imgDim.height / 2,imgDim.width,imgDim.height);
        }; 
    }
  },

  qrSizeBytes: function(qr) {
      return Math.round((qr.modules.size*qr.modules.size)/8);
  },

  describe: function(qr) {
      if (qr == null || qr === undefined) return "Data is too big to be stored in a QR";
      return qr.modules.size + "x" + qr.modules.size + " " + this.qrSizeBytes(qr) + " bytes";
  },

  drawsQR: function(elemPref, value, debugURI) {
      const params = { margin:0, width:e(elemPref+'-code').scrollWidth, errorCorrectionLevel: 'L', color: {dark: '#3654DD' }};

      if (e(elemPref+"-code-label"))
        e(elemPref+"-code-label").style.display = '';

      // Builds QR Element
      QRCode.toCanvas(e(elemPref+'-code'), value, params, function (error) { });

      if (e(elemPref+"-pdf")) {
        if (PDF417.draw(value, e(elemPref+"-pdf")) === undefined) {
            e(elemPref+"-pdf-label").style.display = '';
            e(elemPref+"-pdf").style.display = '';
        } 
      }

      let qr = QRCode.create(value, params);

      let qrQ = null;
      try {
          qrQ = QRCode.create(value, { margin:0, width:275, errorCorrectionLevel: 'Q', color: {dark: '#3654DD' }});
      } catch (err) {
          console.error("Q " + err);
      }
      
      let qrH = null;
      try {
          qrH = QRCode.create(value, { margin:0, width:275, errorCorrectionLevel: 'H', color: {dark: '#3654DD' }});
      } catch (err) {
          console.error("H " + err);
      }

      let qrM = QRCode.create(value, { margin:0, width:275, errorCorrectionLevel: 'M', color: {dark: '#3654DD' }});
      let qrL = QRCode.create(value, { margin:0, width:275, errorCorrectionLevel: 'L', color: {dark: '#3654DD' }});
      
      e(elemPref+"-bytes").innerHTML = "URI in A/N (5.5bit/char): "+ Math.round(value.length * 5.5/8) + " bytes<br>";

      e(elemPref+"-bytes").innerHTML += "<br>QR Size Analysis: ";
      e(elemPref+"-bytes").innerHTML += "<br>-ECC L  7% "  + this.describe(qrL);
      e(elemPref+"-bytes").innerHTML += "<br>-ECC M 15% " + this.describe(qrM);
      e(elemPref+"-bytes").innerHTML += "<br>-ECC Q 25% " + this.describe(qrQ);
      e(elemPref+"-bytes").innerHTML += "<br>-ECC H 30% " + this.describe(qrH);
      
      e(elemPref+"-bytes").innerHTML += "<br><br>QR built with " + qr.segments.length + " segments";
      for (i=0; i<qr.segments.length; i++) {
          e(elemPref+"-bytes").innerHTML += "<br>- " + i + ": " + qr.segments[i].mode.id + " " + qr.segments[i].data;
      }

      if (e(elemPref+"-result")) {
        e(elemPref+"-result").innerHTML = debugURI;
      }
  }
}