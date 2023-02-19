$(document).ready(function () {
    InitSecondaryNavigation();
    if (typeof Sys != "undefined" && Sys.WebForms && Sys.WebForms.PageRequestManager && Sys.WebForms.PageRequestManager.getInstance() != null) {
        Sys.WebForms.PageRequestManager.getInstance().add_endRequest(SecondaryNavigation_RequestHandler);
    } 
});

///<summary>partial postback event handler. Executed after the partial postback is completed. Clears modal popup textboxes</summary>
///<param name="sender"></param>
///<param name="args">http://www.asp.net/ajax/documentation/live/ClientReference/Sys.WebForms/EndRequestEventArgsClass/default.aspx</param>
function SecondaryNavigation_RequestHandler(sender, args) {
    InitSecondaryNavigation();
}

///<summary>Initialise Secondary Navigation by setting state and assign on click events</summary>
function InitSecondaryNavigation() {
    //set state
    var hash = window.location.hash;
    if (hash.length > 0) {
        var a = $("ul.navmenu a[href$='" + hash + "']");
        ExpandSecondaryNavLinks(a)
    }
    // add on click 
    var a = $("ul.navmenu a:not([href='javascript:;'])");
    $(a).click(function () {
        $(a).removeClass("selected");
        ExpandSecondaryNavLinks($(this));
    })

    function ExpandSecondaryNavLinks(me) {
        me.addClass("selected");
        me.parentsUntil('ul.navmenu').each(function () {
            if ($(this).is('ul.submenu')) {
                $(this).css('display', 'inline-block');
                var currentMenu = $(this).parent('li').children('div.menutop');
                currentMenu.addClass('menutop-open');
                currentMenu.children('div.toggle').addClass('toggle-open');
                currentMenu.children('div.toggle').children('a').attr('title', 'Collapse Menu');
                currentMenu.children('a').addClass('selected');
            }
        });
    }
}