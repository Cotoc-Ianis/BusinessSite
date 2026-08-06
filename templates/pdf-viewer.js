// Shared PDF.js canvas viewer — template pages set window._templateId before loading this
(function () {
  var item = window.templateData && window.templateData[window._templateId];
  if (!item || !item.pdfPath) return;

  document.getElementById('pdf-section').hidden = false;

  var PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  var WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  var pdfDoc = null, pageNum = 1, rendering = false, pending = null;

  var canvas   = document.getElementById('pdf-canvas');
  var ctx      = canvas.getContext('2d');
  var prevBtn  = document.getElementById('pdf-prev');
  var nextBtn  = document.getElementById('pdf-next');
  var numEl    = document.getElementById('pdf-page-num');
  var countEl  = document.getElementById('pdf-page-count');

  function renderPage(n) {
    rendering = true;
    pdfDoc.getPage(n).then(function (page) {
      var scale    = Math.min(1.6, (canvas.parentElement.clientWidth - 4) / page.getViewport({ scale: 1 }).width);
      var viewport = page.getViewport({ scale: scale });
      canvas.width  = viewport.width;
      canvas.height = viewport.height;
      page.render({ canvasContext: ctx, viewport: viewport }).promise.then(function () {
        rendering = false;
        if (pending !== null) { renderPage(pending); pending = null; }
      });
    });
    numEl.textContent = n;
    prevBtn.disabled = n <= 1;
    nextBtn.disabled = n >= (pdfDoc ? pdfDoc.numPages : 1);
  }

  function go(n) {
    pageNum = n;
    if (rendering) { pending = n; } else { renderPage(n); }
  }

  prevBtn.addEventListener('click', function () { if (pageNum > 1) go(pageNum - 1); });
  nextBtn.addEventListener('click', function () { if (pageNum < pdfDoc.numPages) go(pageNum + 1); });

  var s = document.createElement('script');
  s.src = PDFJS;
  s.onload = function () {
    pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER;
    pdfjsLib.getDocument(item.pdfPath).promise.then(function (doc) {
      pdfDoc = doc;
      countEl.textContent = doc.numPages;
      nextBtn.disabled = doc.numPages <= 1;
      renderPage(1);
    });
  };
  document.head.appendChild(s);
})();
