$(document).ready(function () {
    InitContentAnchors();
    if (typeof Sys != "undefined" && Sys.WebForms && Sys.WebForms.PageRequestManager && Sys.WebForms.PageRequestManager.getInstance() != null) {
        Sys.WebForms.PageRequestManager.getInstance().add_endRequest(Content_RequestHandler);
    } 
});

///<summary>partial postback event handler. Executed after the partial postback is completed. Clears modal popup textboxes</summary>
///<param name="sender"></param>
///<param name="args">http://www.asp.net/ajax/documentation/live/ClientReference/Sys.WebForms/EndRequestEventArgsClass/default.aspx</param>
function Content_RequestHandler(sender, args) {
    InitContentAnchors();
}

function InitContentAnchors() {
    // remove relative anchor from urls
    var match = window.location.href.match("[\?&](anchor=[^&#]+)")
    if (match != null) {
        var anchor = match[1];
        $("a[href*='" + anchor + "']").each(function () {
            var href = $(this).attr("href");
            href = href.replace(anchor, "").replace("?&", "?");
            $(this).attr("href", href);
        });
    };
    // process anchor links sans page querystring
    $("div.widgetBody a[href*='#']:not([href*='page=']):not([aria-controls])").add("div.content a[href*='#']:not([href*='page=']):not([aria-controls])").each(function () {
        var href = $(this).attr("href");
        var anchorMatch = href.match("(.*)(#)(.+)$");

        if (anchorMatch != null && anchorMatch.length >= 4) {

            // escape locals
            if (anchorMatch[1] == "" && $("a#" + anchorMatch[3]).length) {
            }
            else {
                href = href.replace(anchorMatch[2],
                                (href.indexOf("?") != -1 ? '&' : '?')
                                + "anchor=" + anchorMatch[3]
                                + "#");
                $(this).attr("href", href);
            }
        }
    });
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}