//onload call checkSearchCookie function
var y1 = 20;   // change the # on the left to adjuct the Y co-ordinate
var ESCAPE_KEY = 27; // Keycode for Escape key
var gsaSearchSurveyDropzone; // Drop-zone object for the search survey.
var searchSurveyPositionInContent; // Current position of the search survey
var searchSurveyPositionInContentPaddingLeft = 17; // Survey padding left when displayed in content
var searchSurveyPositionYOffest = 217; // Y offset to re-position the survey when floating
var gsaSurveyPlaceholder = "<div id='GSASurveyPlaceholder' class='hide'>GSA Survey placeholder</div>"; // Survey float placeholder
var responsiveWindowWidth = 1199; // Mininum size width of the window when contents start to become responsive
var leftAreaFocusedTimeoutValue = 10; // Timeout value to check focus for the left area accordion
var contentAreaFocusedValue = 10; // Timeout value to check focus for the content area
var focusToSurveyTimeoutValue = 10; // Timeout value to focus on the search survey
var preventSearchSurveyRefocus = false;
(document.getElementById) ? dom = true : dom = false;

$(document).ready(function () {
    var exmins = 1;
    var cname = "ATOGov_GoogleCookie";
    var queryValue = getCookieValue(cname);

    if (queryValue != "ATOGSA") {

        if (queryValue != "") {
            if ($(window).width() >= 767) {
                showIt();
                placeIt();
            }
        }
    }
    checkSearchCookie(cname);

    if ($("#GSASurveylayer").length > 0) {
        GetSearchSuveyPositionInContent();
        HandlePositioningSearchSurvey();

        window.onscroll = function (event) {
            HandlePositioningSearchSurvey();
        };
    }

    queryValue = "";
    $('input[type="button"]').click(function () {
        $(this).closest("form").submit();
        document.getElementById("GSASurveylayer").style.visibility = 'hidden';
    });

    $(document).on("click", ".GSASurvey .closeButton", function (event) {
        event.preventDefault();

        $("#GSASurveylayer").hide();
    });

    // Hide search survey on press of Esc key
    $(document).keyup(function (event) {
        if ($("#GSASurveylayer").length > 0) {
            event.preventDefault();
            event.stopPropagation();
            if (event.keyCode == 27) {
                $("#GSASurveylayer").hide();
            }
        }
    });

    // Determine the last menu link item from the left hand area.
    var lastAccordionItems;
    var sideNavExists = $(".side-nav-container nav").length > 0;
    if (sideNavExists == true) {
        // Select the last visible link in the side navigation menu
        lastAccordionItems = $(".side-nav-container nav li:visible:last a:visible:last");
    } 

    // Focus on search survey if tabbing past the left area accordions. This is for keyboard accessiblity.
    $(lastAccordionItems).blur(function () {
        if (!preventSearchSurveyRefocus) {
            var leftAreaFocusedTimeout = window.setTimeout(function () {
                clearTimeout(leftAreaFocusedTimeout);

                var leftAreaFocused = ($(".side-nav-container nav li:first").siblings().andSelf().find("a").filter(function () {
                    return this == document.activeElement;
                }).length > 0) ? true : false;

                if (!leftAreaFocused) {
                    SetFocusToSurvey(true);

                    preventSearchSurveyRefocus = true;
                }
            }, leftAreaFocusedTimeoutValue);
        } else {
            preventSearchSurveyRefocus = false;
        }
    });

    // Find first anchor link that ia valid.
    var firstContentAnchor = $(".content-main-wrap .widgetBody a:visible").filter(function () {
        return $(this).prop("href") != ""
    }).first();

    // Focus on search survey if tabbing before the content area. This is for keyboard accessiblity.
    $(firstContentAnchor).blur(function () {
        if (!preventSearchSurveyRefocus) {
            var contentAreaFocusedTimeout = window.setTimeout(function () {
                clearTimeout(contentAreaFocusedTimeout);

                var contentAreaFocused = ($(".content-main-wrap .widgetBody a").filter(function () {
                    return this == document.activeElement;
                }).length > 0) ? true : false;

                if (!contentAreaFocused) {
                    SetFocusToSurvey(false);

                    preventSearchSurveyRefocus = true;
                }
            }, contentAreaFocusedValue);
        } else {
            preventSearchSurveyRefocus = false;
        }
    });

});

// Perform a check whether to float the search survey or move into content above the heading.
function DoFloatSeachSurvey() {
    var returnFloatSearchSurvey = false;
    var viewportBottomPosition = $(window).scrollTop() + $(window).height();

    if (($(window).scrollTop() > searchSurveyPositionInContent.top) || (viewportBottomPosition < searchSurveyPositionInContent.bottom)) {
        returnFloatSearchSurvey = true;
    }

    return returnFloatSearchSurvey;
}

// Floats the search survey away from the content header.
function FloatSearchSurveyFromContent() {
    if ($("#GSASurveyPlaceholder").length > 0) {
        $("#GSASurveylayer").parent().insertBefore("#GSASurveyPlaceholder");
        $("#GSASurveyPlaceholder").remove();
        $("#GSASurveylayer").css("position", "absolute").css("visibility", "visible");
        $("#GSASurveylayer").removeClass("GSASurvey");
        $("#GSASurveylayer").css("width", searchSurveyPositionInContent.width);
    }

    RepositionFloatingSearchSurvey();
}

// Gets the position of the survey above the content header.
function GetSearchSuveyPositionInContent() {
    // Clone the search survey as a temporary piece of content and place this before the search suvey content.
    var gsaSeachSurveyDropZone = $("#GSASurveylayer").parent().clone().attr("id", "GSASeachSurveyDropZone");
    // changed from .PBItem:first as no longer exists in 9.1
    $(gsaSeachSurveyDropZone).prependTo($(".content-main-wrap li:first"));
    $("#GSASeachSurveyDropZone #GSASurveylayer").css("position", "").css("visibility", "visible");

    // Get the current position of the search survey.
    searchSurveyPositionInContent = {
        top: $("#GSASeachSurveyDropZone #GSASurveylayer").offset().top,
        bottom: $("#GSASeachSurveyDropZone #GSASurveylayer").offset().top + $("#GSASeachSurveyDropZone #GSASurveylayer").height(),
        width: $("#GSASeachSurveyDropZone #GSASurveylayer").width()
    };

    $("#GSASeachSurveyDropZone").remove();
}

// Handles moving the search survey above the content header or make it float when scrolling away.
function HandlePositioningSearchSurvey() {
    if (DoFloatSeachSurvey()) {
        FloatSearchSurveyFromContent();
    } else {
        MoveSearchSurveyIntoContent();
    }
}

// Move the search survey below into the content above the heading.
function MoveSearchSurveyIntoContent() {
    if ($("#GSASurveyPlaceholder").length == 0) {
        var gsaSearchSurveyDropzone = $("#GSASurveylayer").parent().attr("id");
        $(gsaSurveyPlaceholder).insertBefore($("#" + gsaSearchSurveyDropzone));
        $("#GSASurveylayer").parent().prependTo($(".content-main-wrap li").first());
        $("#GSASurveylayer").css("position", "");
        $("#GSASurveylayer").addClass("GSASurvey");
        $("#GSASurveylayer").parent().css("padding-left", searchSurveyPositionInContentPaddingLeft);
    }
}

// Re-position the floating search survey to be in-line to the left when survey is positioned in the content.
function RepositionFloatingSearchSurvey() {
    // Set search survey Y offset position for responsive view & standard desktop view
    var setSearchSurveyPositionYOffest = ($(window).width() <= responsiveWindowWidth) ? $(".content-main-wrap h1").offset().left : searchSurveyPositionYOffest;
    $("#GSASurveylayer").css("left", setSearchSurveyPositionYOffest);
}

// Sets the focus on the search survey for keyboard accessibility.
function SetFocusToSurvey(focusOnFirstItem) {
    window.scrollTo(searchSurveyPositionInContent.top, false);

    var focusToSurveyTimeout = window.setTimeout(function () {
        clearTimeout(focusToSurveyTimeout);

        var searchSurveyElementToFocus = $("#GSASurveylayer").find("input, a, button, textarea").filter(":visible");
        searchSurveyElementToFocus = (focusOnFirstItem) ? $(searchSurveyElementToFocus).first() : $(searchSurveyElementToFocus).last();
        $(searchSurveyElementToFocus).focus();

    }, focusToSurveyTimeoutValue);
}

function checkSearchCookie(cname) {
    var exmins = 1;
    var queryValue = getCookieValue(cname);

    if (queryValue != "") {

        $('#txt_searchterm').val(queryValue);
        $('#txt_Url').val($(location).attr('href'));

        //display feedback form on content pages only
        $('#trtextbox').hide();

        $('#Yesbutton').click(function (event) {
            event.preventDefault();
            $("input.rbYesSurvey").trigger("click");
        });

        $('#Nobutton').click(function () {
            $("input.rbNoSurvey").trigger("click");
        });


        $('input[type="radio"]').click(function (event) {
            event.preventDefault();

            $(this).prop("checked", true);

            if ($(this).attr('value') == 'Yes') {
                $(this).closest("form").submit();
            }
            else {
                $('#trQ1').hide();
                $('#trtextbox').show();
            }
        });
        // set cookie to null so the feedback form is not repeatedly shown
        setCookie(cname, "ATOGSA", exmins)
    }
    else {
        $('#tbGSAfeedback').hide();
    }
}


function getCookieValue(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exmins) {
    var d = new Date();
    d.setTime(d.getTime() + (exmins * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}


function showIt() {
    if (dom) {
        if ($("#GSASurveylayer").length > 0) {
            $("#GSASurveylayer").show();
        }
    }
}

function placeIt() {
    var layvis;
    if ($("#GSASurveylayer").length > 0) {
        if (dom && !document.all) { document.getElementById("GSASurveylayer").style.top = window.pageYOffset + (window.innerHeight - (window.innerHeight - y1)) + "px"; }
        if (document.all) {
            if (document.getElementById("GSASurveylayer"))
            { layvis = document.getElementById("GSASurveylayer").style.visibility; }
            else { layvis = null; }

            if (layvis == "visible") {
                document.getElementById("GSASurveylayer").style.top = document.documentElement.scrollTop + (document.documentElement.clientHeight - (document.documentElement.clientHeight - y1)) + "px";
            }
        }
    }
    window.setTimeout("placeIt()", 10);
}

jQuery.fn.exists = function () {
    return jQuery(this).length > 0;
};
