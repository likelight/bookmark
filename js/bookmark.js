$(function() {
	// 判断是否在百度, Google
	var href = location.href;
	var baidus = [
		'https://www.baidu.com',
		'http://www.baidu.com',
		'https://baidu.com',
		'http://baidu.com',
	];
	var googles = [
		'https://www.google.com',
		'http://www.google.com',
		'https://google.com',
		'http://google.com',
	];

	function isBaiduOrGoogle(isBaidu) {
		var urls = isBaidu ? baidus : googles;
		for (var i = 0; i < urls.length; ++i) {
			if (href.indexOf(urls[i]) == 0) {
				return true;
			}
		}
	}


	var F6Api = {
		curSearchTitle: null,
		searchBookmark: function(title, callback) {
			var me = this;
			// 表示正在搜索
			if(me.curSearchTitle == title) {
				return;
			}
			me.curSearchTitle = title;
			chrome.extension.sendRequest({type: "searchBookmark", query: title}, function (response) {
				// 表示是旧的
				if(title != me.curSearchTitle) {
					return;
				}
				me.curSearchTitle = null; // 设为空
				callback && callback(response);
			});
		},
		searchRelation: function(title, callback) {
			var me = this;
			var response = [
				{text: '复联2', url: 'http://tv.sohu.com/item/MTE3MzU0Ng==.html', top: 32, left: 217, font: '25px/1.2 Helvetica,arial,sans-serif',color:'#0085D8',fontweight:'700'},
                {text: '速激7', url: 'http://v.baidu.com/v?s=8&word=%CB%D9%B6%C8%D3%EB%BC%A4%C7%E97%20%B5%E7%D3%B0&fr=ala11#pn=0', top: 99, left: 155, font: '25px/1.2 Helvetica,arial,sans-serif',color:'#F2572D',fontweight:'800'},
                {text: '左耳', url: 'http://tv.sohu.com/item/MTE5NTEyOQ==.html', top: 38, left: 159, font: '17px/1.2 Helvetica,arial,sans-serif',color:'#00ABD8'},
                {text: '搜狐电影', url: 'http://tv.sohu.com/movie/', top: 133, left: 70, font: '16px/1.2 Helvetica,arial,sans-serif',color:'#EFC028',fontweight:'200'},
                {text: '“一生要看的300部电影”', url: 'http://www.douban.com/doulist/1011415/', top: 63, left: 26, font: '30px/1.2 Helvetica,arial,sans-serif',color:'#0067A6',fontweight:'900'},
                {text: '豆瓣电影', url: 'http://movie.douban.com/', top: 34, left: 44, font: '25px/1.2 Helvetica,arial,sans-serif',color:'#F2572D',fontweight:'700'},
                {text: '百度糯米电影', url: 'http://sh.nuomi.com/movie', top: 8, left: 153, font: '17px/1.2 Helvetica,arial,sans-serif',color:'#EFC028',fontweight:'700'},
                {text: '小调网', url: 'http://www.xiaopian.com/', top: 139, left: 154, font: '18px/1.2 Helvetica,arial,sans-serif',color:'#EFC028',fontweight:'700'},
                {text: '多啦A梦伴我同行', url: 'http://movie.douban.com/subject/25769362/?source=new_aladdin', top: 105, left: 30, font: '15px/1.2 Helvetica,arial,sans-serif',color:'#00ABD8',fontweight:'700'},
                {text: '电影天堂', url: 'http://www.dytt8.net/', top: 10, left: 65, font: '17px/1.2 Helvetica,arial,sans-serif',color:'#F2852D',fontweight:'200'},
                {text: 'IMDb', url: 'http://www.imdb.com/', top: 107, left: 240, font: '17px/1.2 Helvetica,arial,sans-serif',color:'#00ABD8',fontweight:'lighter'},
                {text: '时光网', url: 'http://www.xiaopian.com/', top: 135, left: 220, font: '14px/1.2 Helvetica,arial,sans-serif',color:'#F2852D'}
			];

			callback && callback(response);
		}
	};

	var BookmarkCommon = {
		initCss: function(isGoogle) {
			if($('#f6-bookmarks-style').length > 0) {
				return;
			}

			var style = `
				<style id="f6-bookmarks-style">
				#f6-bookmarks {
					width: 100%;
					max-height: 215px;
					margin-top: 15px;
				}
				#f6-bookmarks-left {
					display: inline-block;
					width: 540px;
					padding-left: 121px;
				}
				#f6-bookmarks-right {
					float: right;
					width: 384px;
					height: 100%;
					border-left: 1px solid #e1e1e1;
					padding-left: 17px;
				}
				.f6-panel {
					background-color: #fff;
					border: 1px solid #e3e3e3;
					border-radius: 4px;
					border-bottom-color: #e0e0e0;
					border-right-color: #ececec;
					overflow: hidden;
					box-shadow: 1px 2px 1px rgba(0,0,0,0.072);
					-webkit-box-shadow: 1px 2px 1px rgba(0,0,0,0.072);
					-moz-box-shadow: 1px 2px 1px rgba(0,0,0,0.072);
					-o-box-shadow: 1px 2px 1px rgba(0,0,0,0.072);
				}
				.f6-panel-heading {
				    padding: 8px 15px;
				    background-color: #f8f8f8;
				    border-bottom: 1px solid #ddd;
				    overflow: hidden;
				    color: #000;
				}
				.f6-panel-heading-left-re {
					font-weight: bold;
				}
				.f6-panel-heading-left {
					float: left;
					text-shadow: 1px 2px 1px rgba(0,0,0,0.072);
				}
				.f6-panel-heading-right {
					float: right;
				}
				.f6-panel-body {
					max-height: 157px;
					overflow-y: scroll;
					padding: 2px 10px;
					font-size: 13px;
				}
				.f6-panel-body a {
					text-decoration: none;
					color: #fff;
				}
				.f6-panel-body li {
					padding: 3px;
					border-radius: 3px;
					line-height: 20px;
					cursor: pointer;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					color: #fff;
				}
				.f6-panel-body li:hover {
					background-color: #ddd;
				}
				.f6-panel-heading-left-text {
					color: #666;
					font-size: 11px;
				}
				.f6-panel-heading-close {
					font-size: 18px;
					color: #666;
					cursor: pointer;
				}
				.f6-right-heading {
					font-size: 14px;
					font-weight: bold;
					color: #333;
					line-height: 20px;
				}
				.f6-right-body {
					margin-top: 5px;
					height: 178px;
					position: relative;
				}
				.f6-right-body a {
					position: absolute;
					text-decoration: none;
				}
				.f6-panel-body-title {
					color: #000;
				}
				.f6-right-body a:link,
				.f6-right-body a:hover,
				.f6-right-body a:active,
				.f6-right-body a:visited {
					color: #00c;
				}
				.animated {
					-webkit-animation-duration: 1s;
					animation-duration: 1s;
					-webkit-animation-fill-mode: both;
					animation-fill-mode: both;
				}
				@-webkit-keyframes pulse {
					0% {
						-webkit-transform: scale3d(1, 1, 1);
						transform: scale3d(1, 1, 1);
					}

					50% {
						-webkit-transform: scale3d(1.5, 1.5, 1.5);
						transform: scale3d(1.5, 1.5, 1.5);
					}

					100% {
						-webkit-transform: scale3d(1, 1, 1);
						transform: scale3d(1, 1, 1);
					}
				}
				@keyframes pulse {
					0% {
						-webkit-transform: scale3d(1, 1, 1);
						transform: scale3d(1, 1, 1);
					}

					50% {
						-webkit-transform: scale3d(1.5, 1.5, 1.5);
						transform: scale3d(1.5, 1.5, 1.5);
					}

					100% {
						-webkit-transform: scale3d(1, 1, 1);
						transform: scale3d(1, 1, 1);
					}
				}
				.pulse {
					-webkit-animation-name: pulse;
					animation-name: pulse;
				} `;
			if(isGoogle) {
				style += `#f6-bookmarks {
					padding-left: 0;
					margin-top: 0;
					width: auto;
				}`;
			}
			style += `
				</style>
				`
			$('head').append(
				style
			);
		},
		renderBookmarks: function(bookmarks) {
			var max = 10;
			var tpl = [
				'<div class="f6-panel">',
				  '<div class="f6-panel-heading">',
					  '<div class="f6-panel-heading-left"><span class="f6-panel-heading-left-re">Re</span>discover&nbsp;&nbsp;<span class="f6-panel-heading-left-text">为您找到了%bookmarkNum条书签</span></div>',
					  '<div class="f6-panel-heading-right"><a class="f6-panel-heading-close">×</a></div>',
				  '</div>',
				  '<div class="f6-panel-body">%bookmarkList',
				  '</div>',
				'</div>'].join('');

			var html = '<ul>';
			for(var i = 0; i < bookmarks.length; ++i) {
				var b = bookmarks[i];
				html += '<li>';
				getImageAsBlob("chrome://favicon/" + b.url, i);
				html += '<span id="f6-favicon-' + i + '"></span><a target="_blank" title="' + b.url + '" href="' + b.url + '"><span class="f6-panel-body-title">' + b.title +
				'</span>&nbsp;&nbsp;&nbsp;' + b.url + '</a></li>';
			}
			html += '</ul>';

			var content = tpl.replace('%bookmarkNum', bookmarks.length).replace('%bookmarkList', html);
			return content;
		},
		renderRelations: function(key, relations) {
			var tpl = [
				'<div class="f6-right-heading">',
					'与"',
					key,
					'"相关的热门书签：',
				'</div>',
				'<div class="f6-right-body">%RelationsList',
				'</div>'].join('');
			var html = '';
			for(var i = 0, len = relations.length; i < len; i++) {
				var item = relations[i];
				html += '<a target="_blank" href="' + item.url + '" style="font:' + item.font + ';top:' + item.top +'px; left:' +  item.left + 'px;color:' + item.color +
				'; font-weight:' + item.fontweight + ';text-shadow: 2px 2px 2px rgba(0,0,0,0.1);">' + item.text + '</a>';
			}

			return tpl.replace('%RelationsList', html);
		}
	}

    // 获取网站图标 reference:https://code.google.com/p/chromium/issues/detail?id=55139
    function getImageAsBlob(url, i) {
        chrome.extension.sendRequest({ url: url, type: "getImgDataUrl" }, function (result) {
            var img = document.createElement('img');
            img.style.width = "13px";
            img.style.height = "13px";
            img.style.paddingRight = "5px";
            img.src = result.data;

            $('#f6-favicon-' + i).html(img);
        });
    }

	// 百度操作
	function goBaidu() {
		console.log('goBaidu');

		var $bookmarksCnt;
		var $bookmarksLeft;
		var $bookmarksRight;

		function init() {
			if($('#f6-bookmarks').length > 0) {
				return;
			}
			$('#container').prepend('<div id="f6-bookmarks"><div id="f6-bookmarks-left"></div><div id="f6-bookmarks-right"></div></div>');
			$bookmarksCnt = $('#f6-bookmarks');
			$bookmarksLeft = $bookmarksCnt.find('#f6-bookmarks-left');
			$bookmarksRight = $bookmarksCnt.find('#f6-bookmarks-right');
			BookmarkCommon.initCss(false);
		}

		function clear() {
			clearLeft();
			clearRight();
			$bookmarksCnt.hide();
		}
		function clearLeft() {
			$bookmarksLeft.html('').hide();
		}
		function clearRight() {
			$bookmarksRight.html('').hide();
		}

		function setBookmarks(bookmarks) {
			$bookmarksCnt.show();
			$bookmarksLeft.html(BookmarkCommon.renderBookmarks(bookmarks));
			var $close = $bookmarksLeft.find('.f6-panel-heading-close');
			$close.click(function(){
				if(timer) {
					clearInterval(timer);
				}
				$('#kw').unbind('keyup', search);
				$bookmarksCnt.remove();
			});
		}
		function setRelations(key, relations) {
			$bookmarksCnt.show();
			$bookmarksRight.html(BookmarkCommon.renderRelations(key, relations));
			$links = $bookmarksRight.find("a");
			$links.click(function(){
				var me = $(this);
				me.removeClass().addClass('pulse animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
					me.removeClass();
					window.open(me.attr('href'));
				});
				return false;
			});
		}

		function search() {
			init();

			var key = $('#kw').val();
			if(key) {
				// console.log('search');
				F6Api.searchBookmark(key, function(bookmarks) {
					var actualBookmarks = [];
					if(bookmarks && bookmarks.length > 0){
						for (var i = bookmarks.length - 1; i >= 0; i--) {
							if(bookmarks[i].url != undefined)
								actualBookmarks.push(bookmarks[i]);
						};
					}
					if(actualBookmarks && actualBookmarks.length > 0) {
						setBookmarks(actualBookmarks);
					} else {
						clear();
					}
				});
				if(key == "电影"){
					F6Api.searchRelation(key, function(relations) {
						if(relations && relations.length) {
							setRelations(key, relations);
						} else {
							clearRight();
						}
					});
				}

			} else {
				clear();
			}
		}

		$('#kw').keyup(search);

		// 防止即刻搜索将内容变没了
		var timer = setInterval(function() {
			if($('#f6-bookmarks').length == 0) {
				search();
			}
		}, 100);

		search();
	}

	function goGoogle() {
		console.log('goGoogle');

		var $bookmarksCnt;

		function init() {
			if($('#f6-bookmarks').length > 0) {
				return;
			}
			$('#center_col').prepend('<div id="f6-bookmarks"></div>');
			$bookmarksCnt = $('#f6-bookmarks');
			BookmarkCommon.initCss(true);
		}

		function clear() {
			$bookmarksCnt.html(''); // .hide();
		}

		function setBookmarks(bookmarks) {
			console.log(bookmarks);
			$bookmarksCnt.html(BookmarkCommon.renderBookmarks(bookmarks)).show();
		}

		function search() {
			init();

			var key = $('#lst-ib').val();
			if(key) {
				// console.log('search');
				F6Api.searchBookmark(key, function(bookmarks) {
					if(bookmarks && bookmarks.length > 0) {
						setBookmarks(bookmarks);
					} else {
						clear();
					}
				});
			} else {
				clear();
			}
		}

		$('#lst-ib').keyup(function() {
			search();
		});

		$('#sblsbb').click(function() {
			search();
		});

		// 防止即刻搜索将内容变没了
		setInterval(function() {
			if(!$.trim($('#f6-bookmarks').html())) {
				search();
			}
		}, 100);

		search();
	}

	if(isBaiduOrGoogle(true)) {
		goBaidu();
		return;
	}
	else if(isBaiduOrGoogle(false)) {
		goGoogle();
		return;
	}
});
