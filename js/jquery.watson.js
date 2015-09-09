// Generated by CoffeeScript 1.6.3
/*
 *		Watson - Holmes 
 *
 *		@author Blackfish | Jesse Kivivuori
 *		@version 3.1.7
*/
(function() {
    var e, t, n, r, i, s;
    s = Holmes.version;
    i = null;
    t = parseFloat(localStorage["holmes-version"]);
    isNaN(t) && (localStorage["holmes-version"] = t = "0");
    if (t < s) {
        localStorage["holmes-info-hide"] = "false";
        chrome.browserAction.setBadgeBackgroundColor({
            color: "#000"
        });
        chrome.browserAction.setBadgeText({
            text: "NEW!"
        });
        localStorage["holmes-version"] = s
    }
    n = e = r = null;
    chrome.omnibox.setDefaultSuggestion({
        description: Holmes.getPlaceholder()
    });
    chrome.omnibox.onInputChanged.addListener(function(t, s) {
        var o, u, a, f, l, c, h, p, d, v, m;
        s([]);
        e = t;
        a = t;
        v = f = [];
        if (a.length > 0) {
            l = new RegExp(a, "gi");
            p = Holmes.bookmarks;
            for (u = c = 0, h = p.length; c < h; u = ++c) {
                o = p[u];
                if ((o.title.match(l) || o.url.match(l)) && v.length < 7) {
                    m = o.url.replace(/&/gi, "&amp;");
                    d = o.title.replace(/&/gi, "&amp;");
                    v.push({
                        content: m,
                        description: d + " - " + m
                    });
                    _.uniq(v, !0)
                }
            }
        }
        i = v;
        if (i.length > 0) {
            n = i[0].description;
            r = i[0].content;
            chrome.omnibox.setDefaultSuggestion({
                description: n
            });
            i.shift();
            return s(i)
        }
        n = r = null;
        return e != null && e !== "" ? chrome.omnibox.setDefaultSuggestion({
            description: "Oh no! No single bookmark found. Press enter to Google!"
        }) : chrome.omnibox.setDefaultSuggestion({
            description: Holmes.getPlaceholder()
        })
    });
    chrome.omnibox.onInputEntered.addListener(function(t) {
        r != null ? e === t && (t = r) : t = "http://www.google.com/search?q=" + e;
        console.log(t);
        return chrome.tabs.getSelected(null,
        function(e) {
            return chrome.tabs.update(e.id, {
                url: t
            })
        })
    })
}).call(this);