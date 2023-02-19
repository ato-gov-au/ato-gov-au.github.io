//Used on button click to navigate to different URLs
function goToUrlList() {
    var sE = null, url;
    if (document.getElementById) {
        sE = document.getElementById('urlList');
    } else if (document.all) {
        sE = document.all['urlList'];
    }
    if (sE && (url = sE.options[sE.selectedIndex].value)) {
        location.href = url;
    }
}

$(".btnWrapper").ready(function () {
    ShowMyGovLogoForIndividual();

    $("#urlList").change(function () {
        ShowMyGovLogoForIndividual();
    });
});

function ShowMyGovLogoForIndividual() {
    var onLineServicesUrlList = null;
    onLineServicesUrlList = $('#urlList');

    if (onLineServicesUrlList.find('option:selected').text().indexOf("Individual") >= 0) {
        if ($("#logonContainer").exists()) {
            $("#logonContainer").addClass('hidden');
        }
        if ($("#myGovContainer").exists()) {
            $("#myGovContainer").removeClass('hidden');
        }
    }
    else {
        if ($("#logonContainer").exists()) {
            $("#logonContainer").removeClass('hidden');
        }
        if ($("#myGovContainer").exists()) {
            $("#myGovContainer").addClass('hidden');
        }
    }
}

jQuery.fn.exists = function () {
    return jQuery(this).length > 0;
};

//Validating for Sys object before calling Handler
$("#AZIndex").ready(function () {
    InitAZIndex();
    if (typeof Sys != "undefined" && Sys.WebForms && Sys.WebForms.PageRequestManager && Sys.WebForms.PageRequestManager.getInstance() != null) {
        Sys.WebForms.PageRequestManager.getInstance().add_endRequest(AZIndex_RequestHandler);
    }
}
);

///<summary>partial postback event handler. Executed after the partial postback is completed. Clears modal popup textboxes</summary>
///<param name="sender"></param>
///<param name="args">http://www.asp.net/ajax/documentation/live/ClientReference/Sys.WebForms/EndRequestEventArgsClass/default.aspx</param>
function AZIndex_RequestHandler(sender, args) {
    InitAZIndex();
}

//Index Display Type Script
function InitAZIndex() {
    var charIndex = readIndexCookie('indexCookie');

    if (charIndex == null) {
        showTaxonomies("A");
    } else {
        showTaxonomies(charIndex);
    }
}

function showTaxonomies(className) {
    createIndexCookie('indexCookie', className, 5);
    $('div.taxonomyDiv').hide();
    $('#' + className).show();
}

function createIndexCookie(pLabel, pVal, pMinutes) {
    var tExpDate = new Date();

    tExpDate.setTime(tExpDate.getTime() + (pMinutes * 60 * 1000));
    document.cookie = pLabel + "=" + escape(pVal) + ((pMinutes == null) ? "" : ";expires=" + tExpDate.toGMTString() + "; path=/");
}

function readIndexCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');

    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];

        while (c.charAt(0) == ' ') c = c.substring(1, c.length);

        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
//Index Display Type Script


// -------------------------------------------------
// --- START MegaMenu and Corporate Menu javascript
// -------------------------------------------------
//Validating for Sys object before calling Handler
/*$(document).ready(function () {
InitSuperFish();
if (typeof Sys != "undefined" && Sys.WebForms && Sys.WebForms.PageRequestManager && Sys.WebForms.PageRequestManager.getInstance() != null) {
Sys.WebForms.PageRequestManager.getInstance().add_endRequest(SuperFish_RequestHandler);
}
});

///<summary>partial postback event handler. Executed after the partial postback is completed. Clears modal popup textboxes</summary>
///<param name="sender"></param>
///<param name="args">http://www.asp.net/ajax/documentation/live/ClientReference/Sys.WebForms/EndRequestEventArgsClass/default.aspx</param>
function SuperFish_RequestHandler(sender, args) {
InitSuperFish();
}

function InitSuperFish() {
$("ul.sf-menu").superfish({
pathClass: 'current',
disableHI: false,
//delay		: 0,
animation: { opacity: 'show' },
speed: 200,
autoArrows: false
});
}*/
// -------------------------------------------------
// --- END MegaMenu and Corporate Menu
// -------------------------------------------------

// -------------------------------------------------
// --- START Footer jQuery
// -------------------------------------------------
//Validating for Sys object before calling Handler
$(document).ready(function () {
    InitFooterFlyout();
    if (typeof Sys != "undefined" && Sys.WebForms && Sys.WebForms.PageRequestManager && Sys.WebForms.PageRequestManager.getInstance() != null) {
        Sys.WebForms.PageRequestManager.getInstance().add_endRequest(FooterFlyout_RequestHandler);
    }
});

///<summary>partial postback event handler. Executed after the partial postback is completed. Clears modal popup textboxes</summary>
///<param name="sender"></param>
///<param name="args">http://www.asp.net/ajax/documentation/live/ClientReference/Sys.WebForms/EndRequestEventArgsClass/default.aspx</param>
function FooterFlyout_RequestHandler(sender, args) {
    InitFooterFlyout();
}

function InitFooterFlyout() {
    $(function () {
        $('div.viewMore').each(function () {
            var distance = 15;
            var time = 150;
            var hideDelay = 20;
            var hideDelayTimer = null;
            var beingShown = false;
            var shown = false;
            var trigger = $('.trigger', this);
            var popup = $('.popup', this);
            var popupLink = $('.popup a', this);
            var info = $('.popup', this).css('opacity', 0);
            $([trigger.get(0), info.get(0)]).bind("focus mouseenter focusin", function () {
                if (hideDelayTimer) clearTimeout(hideDelayTimer);
                if (beingShown || shown) {
                    // don't trigger the animation again
                    return;
                } else {
                    // reset position of info box
                    beingShown = true;

                    info.css({
                        top: -16,
                        left: 32,
                        display: 'block'
                    }).animate({
                        left: '-=' + distance + 'px',
                        opacity: 1
                    }, time, 'swing', function () {
                        beingShown = false;
                        shown = true;
                    });
                }

                return false;
            }).bind("mouseout", function () {
                if (hideDelayTimer) clearTimeout(hideDelayTimer);
                hideDelayTimer = setTimeout(function () {
                    hideDelayTimer = null;
                    info.animate({
                        left: '+=' + distance + 'px',
                        opacity: 0
                    }, time, 'swing', function () {
                        shown = false;
                        info.css('display', 'none');
                    });

                }, hideDelay);

                return false;
            });
            $([popupLink.get(0), info.get(0)]).bind("focus mouseover mouseenter focusin hover", function () {
                if (hideDelayTimer) clearTimeout(hideDelayTimer);
                if (beingShown || shown) {
                    // don't trigger the animation again
                    return;
                } else {
                    // reset position of info box
                    beingShown = true;

                    info.css({
                        top: -16,
                        left: 32,
                        display: 'block'
                    }).animate({
                        left: '-=' + distance + 'px',
                        opacity: 1
                    }, time, 'swing', function () {
                        beingShown = false;
                        shown = true;
                    });
                }

                return false;
            });
            $([popup.get(0), info.get(0)]).bind("focus mouseover mouseenter focusin hover", function () {
                if (hideDelayTimer) clearTimeout(hideDelayTimer);
                if (beingShown || shown) {
                    // don't trigger the animation again
                    return;
                } else {
                    // reset position of info box
                    beingShown = true;

                    info.css({
                        top: -16,
                        left: 32,
                        display: 'block'
                    }).animate({
                        left: '-=' + distance + 'px',
                        opacity: 1
                    }, time, 'swing', function () {
                        beingShown = false;
                        shown = true;
                    });
                }

                return false;
            }).bind("mouseout focusout", function () {
                if (hideDelayTimer) clearTimeout(hideDelayTimer);
                hideDelayTimer = setTimeout(function () {
                    hideDelayTimer = null;
                    info.animate({
                        left: '+=' + distance + 'px',
                        opacity: 0
                    }, time, 'swing', function () {
                        shown = false;
                        info.css('display', 'none');
                    });

                }, hideDelay);

                return false;
            });
        });
    });
}
// -------------------------------------------------
// --- END Footer jQuery
// -------------------------------------------------




/*-------------------------------------------------------------------------
//--- Plus/Minus Toggles for Left Hand Expand & In Detail Expand Start
-------------------------------------------------------------------------*/
//Validating for Sys object before calling Handler
$(document).ready(function () {
    InitToggleMenu();
    if (typeof Sys != "undefined" && Sys.WebForms && Sys.WebForms.PageRequestManager && Sys.WebForms.PageRequestManager.getInstance() != null) {
        Sys.WebForms.PageRequestManager.getInstance().add_endRequest(ToggleMenu_RequestHandler);
    }
});

///<summary>partial postback event handler. Executed after the partial postback is completed. Clears modal popup textboxes</summary>
///<param name="sender"></param>
///<param name="args">http://www.asp.net/ajax/documentation/live/ClientReference/Sys.WebForms/EndRequestEventArgsClass/default.aspx</param>
function ToggleMenu_RequestHandler(sender, args) {
    InitToggleMenu();
}

function InitToggleMenu() {
    SetActiveUrl();
    $('#localNav .toggle:not(.toggle-open), #relatedNav .toggle:not(.toggle-open)').addClass('toggle-closed').parent('div').parent('li').children
('ul').hide();
    $('#localNav .toggle, #relatedNav .toggle').click(function (event) {
        event.preventDefault();
        toggleClick($(this));
    })

    /*-------------------------------------------------------------------------
    //--- In Detail Expand Title Toggles
    -------------------------------------------------------------------------*/
    $('#relatedNav .inDetailToggle').click(function (event) {
        event.preventDefault();
        var toggle = $(this).parent('div').children('div.toggle');
        toggleClick(toggle);
    })

    // Toggle Function to Expand/Collapse
    function toggleClick(toggle) {
        if (toggle.hasClass('toggle-open')) {
            toggle.parent('.menutop').removeClass('menutop-open').addClass('menutop-closed');
            toggle.removeClass('toggle-open').addClass('toggle-closed');
            toggle.children('a').attr('title', 'Expand Menu');
            toggle.parent('div').parent('li').children('ul').slideUp(250);
        } else {
            toggle.parent('.menutop').removeClass('menutop-closed').addClass('menutop-open');
            toggle.removeClass('toggle-closed').addClass('toggle-open');
            toggle.children('a').attr('title', 'Collapse Menu');
            toggle.parent('div').parent('li').children('ul').slideDown(250);
        }
    }

    /*-------------------------------------------------------------------------
    //--- Plus/Minus Toggles Common Functions
    -------------------------------------------------------------------------*/

    function SetActiveUrl() {
        $('#localNav a, #relatedNav a').each(function () {
            if ($(this).attr('href').toLowerCase() == window.location.pathname.toLowerCase()) {
                $(this).addClass('selected');
                $(this).parentsUntil('ul.navmenu').each(function () {
                    if ($(this).is('ul.submenu')) {
                        var currentMenu = $(this).parent('li').children('div.menutop');
                        currentMenu.addClass('menutop-open');
                        currentMenu.children('div.toggle').addClass('toggle-open');
                        currentMenu.children('div.toggle').children('a').attr('title', 'Collapse Menu');
                        currentMenu.children('a').addClass('selected');
                    }
                });
            }
        });
    }
}
/*-------------------------------------------------------------------------
//--- Plus/Minus Toggles for Left Hand Expand & In Detail Expand End
-------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------
//--- Right Side Accordion Start
-------------------------------------------------------------------------*/
//Validating for Sys object before calling Handler
$(document).ready(function () {
    InitAccordionMenu();
    if (typeof Sys != "undefined" && Sys.WebForms && Sys.WebForms.PageRequestManager && Sys.WebForms.PageRequestManager.getInstance() != null) {
        Sys.WebForms.PageRequestManager.getInstance().add_endRequest(AccordionMenu_RequestHandler);
    }
});

///<summary>partial postback event handler. Executed after the partial postback is completed. Clears modal popup textboxes</summary>
///<param name="sender"></param>
///<param name="args">http://www.asp.net/ajax/documentation/live/ClientReference/Sys.WebForms/EndRequestEventArgsClass/default.aspx</param>
function AccordionMenu_RequestHandler(sender, args) {
    InitAccordionMenu();
}

function InitAccordionMenu() {

    //Prevents the defaults functionality for the onclick of headings in the Accordion
    $('div.accordion h3.h a.trigger').click(function (event) {
        event.preventDefault();
    })

    //Initialize accordions with class of accordion.
    if (typeof ($.fn.accordion.defaults) != "undefined") {
        $.fn.accordion.defaults.container = false;
    }
    $(function () {
        $(".accordion").accordion({
            obj: "div",
            wrapper: "div",
            el: ".h",
            head: "h3",
            next: "div",
            showMethod: "slideFadeDown",
            hideMethod: "slideFadeUp",
            initShow: "div.outer:first",
            showSpeed: 200,
            hideSpeed: 400,
            scrollSpeed: 300
        });
    });

    //Accordion Heading with a href/name which is the same as the location hash is opened
    $('.accordion').ready(function () {
        var hash = window.location.hash.substring(1);
        if (hash != '') {
            var currentH3 = $('.accordion h3').find('a[href*=#' + hash + ']').closest('h3');
            if (currentH3.length == 0) {
                currentH3 = $('.accordion h3').find('a[name*=' + hash + ']').closest('h3');
            }
            currentH3.find('a.trigger').trigger('click');
        }
    });
}

/*-------------------------------------------------------------------------
//--- Right Side Accordion End
-------------------------------------------------------------------------*/
