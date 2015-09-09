// var bookMarkData = null;
// chrome.bookmarks.getTree(function (aBookMark) {
//     bookMarkData = aBookMark;
// });

// 获取网站图标 reference:https://code.google.com/p/chromium/issues/detail?id=55139
function imgToCanvas(img) {
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    var context = canvas.getContext("2d");
    context.drawImage(img, 0, 0);
    return canvas;
}

function getImgDataUrl(url, cb) {
    var img = document.createElement('img');
    img.onload = function () {
        var canvas = imgToCanvas(img);
        var dataUrl = canvas.toDataURL('image/png', 0.75);
        cb({
            data: dataUrl
        });
    };
    img.src = url;
}

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
    /*
    setTimeout(function() {
        sendResponse('life3ddd33 --- ' + request.query);
    });
    */
    switch (request.type) {
        case "getImgDataUrl":
            return getImgDataUrl(request.url, sendResponse);
            break;
        case 'searchBookmark':
          chrome.bookmarks.search(request.query, function (ret) {
            sendResponse(ret);
          });
    };

});

// 是立刻执行的, 不能有setTimeout();
/*
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    // sendResponse('life');
    setTimeout(function(){
        sendResponse('life333');
    });
    chrome.bookmarks.search(request.title, function (ret) {
      sendResponse(ret);
    });
  }
);
*/
