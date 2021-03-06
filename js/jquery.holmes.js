// Generated by CoffeeScript 1.6.3
/*
 *		Holmes - Chrome Bookmark Search Extension
 *
 *		@author Blackfish | Jesse Kivivuori
 *		@version 3.1.7
*/
(function() {
    var e, t, n, r, i, s, o, u;
    n = 10;
    i = null;
    s = null;
    // document.querySelector("#search input").placeholder = Holmes.getPlaceholder();
    o = setTimeout(function() {
        return $("#search input").focus()
    },
    100);
    if (localStorage["holmes-info-hide"] === "false") {
        chrome.browserAction.setBadgeText({
            text: ""
        });
        document.querySelector(".notice").style.display = "block";
        document.querySelector("#link-wrap").style.display = "none";
        localStorage["holmes-info-hide"] = "true"
    }
    $("#search input").focus();
    t = $("#view ol");
    e = null;
    key.filter = function(e) {
        var t;
        t = (e.target || e.srcElement).tagName;
        return t !== "SELECT" && t !== "TEXTAREA"
    };
    key("down, up",
    function(r, i) {
        if (e != null && t.children().length > 1) switch (i.shortcut) {
        case "down":
            if (e.index() !== n - 1 && e.index() < t.children().length - 1) return e = e.removeClass("current").next("li").addClass("current");
            break;
        case "up":
            if (e.index() !== 0) return e = e.removeClass("current").prev("li").addClass("current")
        }
    });
    key("enter, shift + enter",
    function(t, n) {
        switch (n.shortcut) {
        case "enter":
        case "shift+enter":
            if (e != null) return chrome.tabs.create({
                url: e.find("a").prop("href"),
                pinned: key.shift ? !0 : !1
            });
            if (i.length > 2) return chrome.tabs.create({
                url: "http://www.google.com/search?q=" + i
            })
        }
    });
    r = function(e, t) {
        var n;
        e = e.length < t ? e: e.substr(0, t) + "...";
        n = new RegExp(i, "gi");
        return e.replace(n, "<span>" + n.exec(e) + "</span>")
    };
    u = function(i) {
        var o, u, a, f, l, c, h;
        if (i.length > 0) {
            h = "";
            for (o = f = 0, l = i.length; f < l; o = ++f) {
                u = i[o];
                if (! (o < n)) continue;
                a = o === 0 ? "current": "";
                c = r(u.title, 50);
                h += '<li class="' + a + ' cf"><img src="chrome://favicon/' + u.url + '"><a href="' + u.url + '" title="' + u.url + '">' + c + "</a></li>"
            }
            t.html(h);
            e = t.children(":first");
            return t.find("a").on("click",
            function() {
                return chrome.tabs.create({
                    url: this.href
                })
            })
        }
        s != null && t.html('<div class="no-bookmarks-found"><h1>Oh no!</h1><p><b>No single bookmark found.</p></div>');
        return e = null
    };
    $("#pattern").on("keydown",
    function(e) {
        var t;
        t = e.keyCode;
        if (t === 38 || t === 40) return $(this).css("-webkit-user-select", "none")
    });
    $("#pattern").on("keyup",
    function(e) {
        var n, r, o, a, f, l;
        o = e.keyCode;
        if (o === 38 || o === 40 || o === 37 || o === 39) {
            $(this).css("-webkit-user-select", "text");
            return ! 1
        }
        i = $("#pattern").val();
        t.html("");
        l = [];
        if (i.length > 0) {
            s = new RegExp(i, "gi");
            f = Holmes.bookmarks;
            for (r = 0, a = f.length; r < a; r++) {
                n = f[r]; (n.title.match(s) || n.url.match(s)) && l.push(n)
            }
        } else {
            l = [];
            s = null
        }
        return u(l)
    });
    $(".icon-cog, .icon-info").on("click",
    function(e) {
        e.preventDefault();
        return $("#" + $(this).data("launch")).addClass("open")
    })
}).call(this);