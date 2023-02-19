var BLUR_TIMEOUT = 100;
var HIDDEN_FOR_MOBILE_PREFIX_ID = 'HiddenForMobile_';
var searchboxContainer, rightAreaArticle1;

// jQuery version 1.10+ functions, use variable jq1102 instead of the $ as the $ is now used for jQuery version 1.7.2 used by Ektron
jq1102(document).ready(function () {
    if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
        var msViewportStyle = document.createElement('style')
        msViewportStyle.appendChild(
		document.createTextNode(
		  '@-ms-viewport{width:auto!important}'
		)
	  )
        document.querySelector('head').appendChild(msViewportStyle)
    }
});

// jQuery version 1.7.2 functions
$(document).ready(function () {
    // Set text limitation for browsers (such as IE 8) that do no support maxlength of text area fields.
    $("textarea input").bind('paste', function (e) {
        if ($(e.currentTarget).attr("maxlength") != undefined) {
            window.setTimeout(function () {
                var maxLength = $(e.currentTarget).attr("maxlength");
                var textAreaCurrentValue = e.currentTarget.value;
                if (textAreaCurrentValue.length > maxLength) {
                    e.currentTarget.value = textAreaCurrentValue.substring(0, maxLength);
                }
            }, 0);
        }
    }).keypress(function () {
        $(this).trigger("paste");
    });

    jQuery.fn.exists = function () {
        return jQuery(this).length > 0;
    };

    SetAriaForScreenReaders();

    $(".ektron-social.DoSet").attr("data-url", window.location.href);
    $(".ektron-social.DoSet").ekSocial({ classToRemove: 'DoSet' });
    SetMailToLinkForSBN();

    //Toogle off canvas menu
    $('[data-toggle=offcanvas]').click(function () {
        $('.row-offcanvas').toggleClass('active');
        $('#navBarTop').toggleClass('affix');
        $('#marketSegmentBar').toggleClass('menuMargin');
        $('#btnMenu').toggleClass('now');
        $('#leftArea, .slider-arrow').toggleClass('hide');
        $('.btnViewSearch, .btnViewLogin, .btnViewMore').popover('hide').removeClass('now');
        window.scrollTo(0, 0);

        if ($('.row-offcanvas').hasClass('active')) {
            $('#menuTitle').focus();
        }

        //Set or reset keyboard accessibility for Off Canvasa Menu - mobile view
        if ($('#globalNavContainer,#accessibilityLinks').find('a,button').attr('tabindex') == -1) {

            $('#globalNavContainer,#accessibilityLinks').find('a,button').attr('tabindex', 1);

        } else {
            $('#globalNavContainer,#accessibilityLinks').find('a,button').prop('tabindex', -1);
        }

        if ($('#btnMenu').attr('tabindex') == 1) {
            $('#btnMenu').removeAttr('tabindex');
        } else {
            $('#btnMenu').prop('tabindex', 1);
        }

        return false; // Prevents collapsing second-level tabs that are already open by the user.
    });

    // Sets the highlighting of the second-level tabs when user clicks on it.
    $('.dropdown-toggle').click(function () {
        var currentTabIsHighlightedShowingMenu = $(this).parent().hasClass('mm-shadow open');

        if (!currentTabIsHighlightedShowingMenu) {
            var currentTabIsNotHighlighted = $(this).parent().hasClass('light');

            if (currentTabIsNotHighlighted) {
                $('li.light').addClass('mm-shadow').removeClass('light');
            } else {
                var currentTabIsHighlighted = $(this).parent().hasClass('mm-shadow');

                if (!currentTabIsHighlighted) {
                    var currentTabIsShowingMenu = $(this).parent().hasClass('open');

                    if (currentTabIsShowingMenu) {
                        $('li.light').addClass('mm-shadow').removeClass('light');
                    } else {
                        $('li.mm-shadow').addClass('light').removeClass('mm-shadow');
                    }
                }
            }
        }
    });

    //Keyboard accessibility - close off canvas menu if focus in to Home and Login button
    $('#btnHome, #btnLogin').focusin(function () {
        $('.row-offcanvas').removeClass('active');
        $('#navBarTop').addClass('affix');
        $('#btnMenu').removeClass('now').prop('tabindex', 1);
        $('#globalNavContainer,#accessibilityLinks').find('a,button').prop('tabindex', -1);
    });

    //Off canvas menu close button - set focus back to menu button
    $('#menuClose').click(function () {
        $('#btnMenu').focus();
    });

    //Close off canvas menu if clicking inside main content area	
    $('#logoSearch, #contentContainer, #footerWrapper, #footersocialBarContainer').click(function () {
        $('.row-offcanvas').removeClass('active');
        $('#navBarTop').addClass('affix');
        $('#marketSegmentBar').addClass('menuMargin');
        $('#btnMenu').removeClass('now');
        $('#leftArea, .slider-arrow').removeClass('hide');
    });

    //Go to homepage for home button in the top nav menu - mobile view
    $('#btnHome').click(function () {
        document.location.href = '/';
    });

    $('#btnHomeSBN').click(function () {
        document.location.href = '/newsroom/smallbusiness/';
    });


    $('.btnSubscriptions').click(function () {
        document.location.href = '/newsroom/smallbusiness/subscriptions/';
    });

    //Close all popups on click and allows for only one popup to be open at a time
    $('body').on('click', function (e) {
        $('[data-toggle="popover"]').each(function () {
            //the 'is' for buttons that trigger popups
            //the 'has' for icons within a button that triggers a popup
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide');

                if ($('.btnViewSearch, .btnViewLogin, .btnViewMore').hasClass('now')) {
                    $(this).removeClass('now');
                }
            }
        });
    });

    //Clicking away from the second-level tab will set the current tab as highlighted.
    $('.dropdown-toggle').blur(function () {
        window.setTimeout(function () {
            var dropDownHasFocus = $('.dropdown-toggle').is(':focus'); // Check if the focus is a drop-down.

            // Only set the current tab highlighted if the focus is not set on a drop-down.
            if (!dropDownHasFocus) {
                $('li.dropdown.light').removeClass('light').addClass('mm-shadow');
            }
        }, BLUR_TIMEOUT);
    });

    //Close all popover's with the Esc key
    $(document).keyup(function (e) {

        if (e.keyCode == 27) {
            $('.row-offcanvas').removeClass('active');
            $('#btnMenu').removeClass('now');
            $('[data-toggle="popover"]').popover('hide');
            $('.btnViewSearch, .btnViewLogin, .btnViewMore').removeClass('now');

            //Set or reset keyboard accessibility for Off Canvasa Menu - mobile view
            if ($('#globalNavContainer,#accessibilityLinks').find('a,button').attr('tabindex') == -1) {
                $('#globalNavContainer,#accessibilityLinks').find('a,button').prop('tabindex', 1);
            } else {
                $('#globalNavContainer,#accessibilityLinks').find('a,button').prop('tabindex', -1);
            }
            if ($('#btnMenu').attr('tabindex') == 1) {
                $('#btnMenu').prop('tabindex', -1);
            } else {
                $('#btnMenu').prop('tabindex', 1);
            }
        }
    });

    //Search Popup
    $('.btnViewSearch').popover({
        animation: false,
        html: true,
        container: '#aspnetForm',
        title: 'Search',
        template: '<div id="searchPopOver" class="popover"><div class="arrow"></div><h3 class="popover-title" tabindex="-1"></h3><button id="searchClose" class="btn pull-right" onclick="$(\'.btnViewSearch\').popover(\'hide\');$(\'#btnSearch\').focus();" type="button"><span class="sr-only">Close search</span><span class="glyphicon glyphicon-remove-circle"></span></button><div id="searchboxContainer" class="popover-content"></div></div>',
        content: function () {
            return $(searchboxContainer).html();
        }
    }).click(function () {
        if ($('#searchPopOver.popover').hasClass('in') == true) {
            BindBannerSearchEvents();
            BindAdvancedLinkEvent();
        }
        $(this).toggleClass('now');
        $('.popover-title').focus();
        //Keyboard accessibility for Off Canvasa Menu - mobile view
        $('#btnHome, #btnLogin').focusin(function () {
            $('.btnViewSearch').popover('hide').removeClass('now');
        });
    });

    //Login Popup
    $('.btnViewLogin').popover({
        animation: false,
        html: true,
        container: '#aspnetForm',
        title: 'Online services',
        template: '<div id="loginPopOver" class="popover"><div class="arrow"></div><h3 class="popover-title" tabindex="-1"></h3><button id="loginClose" class="btn pull-right" onclick="$(\'.btnViewLogin\').popover(\'hide\');$(\'#btnLogin\').focus();" type="button"><span class="sr-only">Close online services</span><span class="glyphicon glyphicon-remove-circle"></span></button><div id="rightAreaArticle1" class="popover-content"></div></div>',
        content: function () {
            return $(rightAreaArticle1).html();
        }
    }).click(function () {
        $(this).toggleClass('now');
        if ($('#loginPopOver.popover').hasClass('in') == true) {
            $("#urlList").change(function () {
                ShowMyGovLogoForIndividual();
            });
        }
        $('.popover-title').focus();
        //Keyboard accessibility for Off Canvasa Menu - mobile view
        $('#btnSearch, #ATOLogoLink').focusin(function () {
            $('.btnViewLogin').popover('hide').removeClass('now');
        });
    });

    //Footer Links Popup's 
    $('.btnViewMore').popover({
        animation: false,
        html: true,
        template: '<div class="popover"><div class="arrow"></div><div class="popover-content"></div></div>',
        content: function () {
            return $(this).next('.popup').html();
        }
    }).click(function () {
        $(this).toggleClass('now');
    });

    //Print Popup
    $('#iconPrintPopup').popover({
        animation: false,
        html: true,
        container: 'body',
        template: '<div class="popover" style=""><div class="arrow"></div><div class="popover-content"></div></div>',
        content: function () {
            return $('#printPopupWrap').html();
        }
    });

    $('.popUpClose').click(function () {
        $('[data-toggle="popover"]').popover('hide');
    });

    //Content left hand menu slider and  button
    $('.slider-arrow').click(function () {

        if ($(this).hasClass('show1')) {
            $('#localNav,#relatedNav').find('a').removeAttr('tabindex');

            $(".leftSidePanel").animate({
                width: "+=230"
            }, 200, function () {
                // Animation complete.
            });
            $(this).animate({
                left: "+=230"
            }, 200, function () {
                // Animation complete.
            });
            $(this).removeClass('show1').addClass('hide2');
            $('.sArrow').removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-left');
        }
        else {

            $('#localNav,#relatedNav').find('a').prop('tabindex', -1);

            $(".leftSidePanel").animate({
                width: "-=230"
            }, 200, function () {
                // Animation complete.
            });
            $(this).animate({
                left: "-=230"
            }, 200, function () {
                // Animation complete.
            });
            $(this).removeClass('hide2').addClass('show1');
            $('.sArrow').removeClass('glyphicon-chevron-left').addClass('glyphicon-chevron-right');
        }
    });

    // Keyboard accessibility for left hand menu - mobile view 
    $("#leftArea").find("*").blur(function () {

        window.setTimeout(function () {
            // Checks the left hand menu div container's child elements has focus.
            var childElementsHasFocus = $("#leftArea").find("*").is(":focus");

            if (!childElementsHasFocus) {
                // Set focus back on the button that opens the left hand menu
                $('#leftHandMenuBtn').focus();
            }
        }, BLUR_TIMEOUT);
    });

    //Screen dynamic resize
    $(window).resize(function () {
        var inputFieldsHaveFocus = CheckChildElementsHaveFocus('#searchboxContainer, #loginWrapper');
        if (!inputFieldsHaveFocus) {
            $('.btnViewSearch,.btnViewLogin').popover('hide').removeClass('now');
        }
        $('.btnViewMore,#iconPrintPopup').popover('hide').removeClass('now');
        if ($('#leftArea,.slider-arrow').hasClass('hide')) {
            $('#leftArea,.slider-arrow').removeClass('hide');
        }

        //IE10 specific to stop flicker difference between media queries viewport width and browser viewport width
        if ($.browser.msie && $.browser.version == 10) {

            if ($(this).width() < 767) {
                // Mobile view for IE10 
                if ($('#searchboxContainer').length > 0 && ($('#searchPopOver.popover').hasClass('in') == false)) {
                    searchboxContainer = $('#searchboxContainer');
                    $('#searchboxContainer').remove();
                }
                if ($('#rightAreaArticle1').length > 0 && $('#loginPopOver.popover').hasClass('in') == false) {
                    rightAreaArticle1 = $('#rightAreaArticle1');
                    $('#rightAreaArticle1').remove();
                }
                $('#accessibilityContainer').insertAfter('#navWrap').addClass('show');
                $('#globalNavContainer').insertAfter('#navBarTop');
                $('#navbar-collapse-grid').removeClass('collapse');
                $('#leftArea').addClass('leftSidePanel');

                //Keyboard accessibility for Off Canvasa Menu - mobile view
                $('#globalNavContainer,#accessibilityLinks,#localNav,#relatedNav').find('a,button').prop('tabindex', -1);

                //Market segment menu items
                if ($('body').hasClass('ind')) {
                    $('#navbar-collapse-grid').appendTo('#menuInd');
                }
                if ($('body').hasClass('bus')) {
                    $('#navbar-collapse-grid').appendTo('#menuBus');
                }
                if ($('body').hasClass('npr')) {
                    $('#navbar-collapse-grid').appendTo('#menuNpr');
                }
                if ($('body').hasClass('spr')) {
                    $('#navbar-collapse-grid').appendTo('#menuSpr');
                }
                if ($('body').hasClass('txp')) {
                    $('#navbar-collapse-grid').appendTo('#menuTxp');
                }
                if ($('body').hasClass('corp')) {
                    $('#navbar-collapse-grid').appendTo('#menuCorp');
                }
            } else {
                // Desktop view IE10
                $(searchboxContainer).insertAfter('#ATOContainer1');
                BindBannerSearchEvents();
                $(rightAreaArticle1).insertBefore('#rightAreaArticle2');
                $("#urlList").change(function () {
                    ShowMyGovLogoForIndividual();
                });
                $('#accessibilityContainer').insertAfter('#navBarTop');
                $('#globalNavContainer').insertAfter('#logoSearch');
                $('#navbar-collapse-grid').appendTo('#sidebarSub');
                $('#navbar-collapse-grid').addClass('collapse');
                $('#leftArea').removeClass('leftSidePanel');

                // Close search and login popover when not in mobile view
                $('.btnViewSearch,.btnViewLogin').popover('hide').removeClass('now');

                //Remove tabindex to default to normal tab order - tablet and desktop views
                $('#globalNavContainer,#accessibilityLinks,#localNav,#relatedNav').find('a,button').removeAttr('tabindex');

                $('#leftArea,.slider-arrow').removeAttr('style');
                $('.slider-arrow').removeClass('hide2').addClass('show1');
                $('.sArrow').removeClass('glyphicon-chevron-left').addClass('glyphicon-chevron-right');

                if ($('#leftArea,.slider-arrow').hasClass('hide')) {
                    $('#leftArea,.slider-arrow').removeClass('hide');
                }
            }

        } else if ($(this).width() < 751) {
            //All other browsers Mobile view
            if ($('#searchboxContainer').length > 0 && ($('#searchPopOver.popover').hasClass('in') == false)) {
                searchboxContainer = $('#searchboxContainer');
                $('#searchboxContainer').remove();
            }
            if ($('#rightAreaArticle1').length > 0 && $('#loginPopOver.popover').hasClass('in') == false) {
                rightAreaArticle1 = $('#rightAreaArticle1');
                $('#rightAreaArticle1').remove();
            }
            $('#accessibilityContainer').insertAfter('#navWrap').addClass('show');
            $('#globalNavContainer').insertAfter('#navBarTop');
            $('#navbar-collapse-grid').removeClass('collapse');
            $('#leftArea').addClass('leftSidePanel');

            //Keyboard accessibility for Off Canvasa Menu - mobile view
            $('#globalNavContainer,#accessibilityLinks,#localNav,#relatedNav').find('a,button').prop('tabindex', -1);

            //Market segment menu items
            if ($('body').hasClass('ind')) {
                $('#navbar-collapse-grid').appendTo('#menuInd');
            }
            if ($('body').hasClass('bus')) {
                $('#navbar-collapse-grid').appendTo('#menuBus');
            }
            if ($('body').hasClass('npr')) {
                $('#navbar-collapse-grid').appendTo('#menuNpr');
            }
            if ($('body').hasClass('spr')) {
                $('#navbar-collapse-grid').appendTo('#menuSpr');
            }
            if ($('body').hasClass('txp')) {
                $('#navbar-collapse-grid').appendTo('#menuTxp');
            }
            if ($('body').hasClass('corp')) {
                $('#navbar-collapse-grid').appendTo('#menuCorp');
            }
        } else {
            // All other browsers desktop view
            $(searchboxContainer).insertAfter('#ATOContainer1');
            BindBannerSearchEvents();
            $(rightAreaArticle1).insertBefore('#rightAreaArticle2');
            $("#urlList").change(function () {
                ShowMyGovLogoForIndividual();
            });
            $('#accessibilityContainer').insertAfter('#navBarTop');
            $('#globalNavContainer').insertAfter('#logoSearch');
            $('#navbar-collapse-grid').appendTo('#sidebarSub');
            $('#navbar-collapse-grid').addClass('collapse');
            $('#leftArea').removeClass('leftSidePanel');

            // Close search and login popover when not in mobile view
            $('.btnViewSearch,.btnViewLogin').popover('hide').removeClass('now');

            //Remove tabindex to default to normal tab order - tablet and desktop views
            $('#globalNavContainer,#accessibilityLinks,#localNav,#relatedNav').find('a,button').removeAttr('tabindex');

            $('#leftArea,.slider-arrow').removeAttr('style');
            $('.slider-arrow').removeClass('hide2').addClass('show1');
            $('.sArrow').removeClass('glyphicon-chevron-left').addClass('glyphicon-chevron-right');

            if ($('#leftArea,.slider-arrow').hasClass('hide')) {
                $('#leftArea,.slider-arrow').removeClass('hide');
            }
        }

        if ($(this).width() > 1199) {
            $('#footersocialBarContainer').insertBefore('#footerLinksContainer').removeClass('SBN-footer');
            $('#socialInnerWrap').removeClass('row-offcanvas row-offcanvas-left');
            $('#footerLinksContainer').removeClass('SBN-foot-links');
        } else {
            $('#footersocialBarContainer').insertAfter('#footerWrapper').addClass('SBN-footer');
            $('#socialInnerWrap').addClass('row-offcanvas row-offcanvas-left');
            $('#footerLinksContainer').addClass('SBN-foot-links');
        }
    });

    //Screen width on page load
    //IE10 specific to stop flicker difference between media queries viewport width and browser viewport width
    if ($.browser.msie && $.browser.version == 10) {

        if ($(window).width() < 767) {
            // Mobile view for IE10 
            if ($('#searchboxContainer').length > 0 && ($('#searchPopOver.popover').hasClass('in') == false)) {
                searchboxContainer = $('#searchboxContainer');
                $('#searchboxContainer').remove();
            }
            if ($('#rightAreaArticle1').length > 0 && $('#loginPopOver.popover').hasClass('in') == false) {
                rightAreaArticle1 = $('#rightAreaArticle1');
                $('#rightAreaArticle1').remove();
            }

            $('#accessibilityContainer').addClass('show');
            $('#globalNavContainer').insertAfter('#navBarTop');
            $('#accessibilityContainer').insertAfter('#navWrap');
            $('#navbar-collapse-grid').removeClass('collapse');
            $('#leftArea').addClass('leftSidePanel');

            //Keyboard accessibility for Off Canvasa Menu - mobile view
            $('#globalNavContainer,#accessibilityLinks,#localNav,#relatedNav').find('a,button').prop('tabindex', -1);

            //Market segment menu items
            if ($('body').hasClass('ind')) {
                $('#navbar-collapse-grid').appendTo('#menuInd');
            }
            if ($('body').hasClass('bus')) {
                $('#navbar-collapse-grid').appendTo('#menuBus');
            }
            if ($('body').hasClass('npr')) {
                $('#navbar-collapse-grid').appendTo('#menuNpr');
            }
            if ($('body').hasClass('spr')) {
                $('#navbar-collapse-grid').appendTo('#menuSpr');
            }
            if ($('body').hasClass('txp')) {
                $('#navbar-collapse-grid').appendTo('#menuTxp');
            }
            if ($('body').hasClass('corp')) {
                $('#navbar-collapse-grid').appendTo('#menuCorp');
            }

        } else {
            // Desktop view IE10            
            $('#globalNavContainer').insertAfter('#logoSearch');
            $('#accessibilityContainer').insertAfter('#navBarTop');

            //Remove tabindex to default to normal tab order - tablet and desktop views
            $('#globalNavContainer,#accessibilityLinks,#localNav,#relatedNav').find('a,button').removeAttr('tabindex');

            if ($('#leftArea,.slider-arrow').hasClass('hide')) {
                $('#leftArea,.slider-arrow').removeClass('hide');
            }
        }

    } else if ($(window).width() < 751) {
        //All other browsers Mobile view
        if ($('#searchboxContainer').length > 0 && ($('#searchPopOver.popover').hasClass('in') == false)) {
            searchboxContainer = $('#searchboxContainer');
            $('#searchboxContainer').remove();
        }
        if ($('#rightAreaArticle1').length > 0 && $('#loginPopOver.popover').hasClass('in') == false) {
            rightAreaArticle1 = $('#rightAreaArticle1');
            $('#rightAreaArticle1').remove();
        }
        $('#accessibilityContainer').addClass('show');
        $('#globalNavContainer').insertAfter('#navBarTop');
        $('#accessibilityContainer').insertAfter('#navWrap');
        $('#navbar-collapse-grid').removeClass('collapse');
        $('#leftArea').addClass('leftSidePanel');

        //Keyboard accessibility for Off Canvasa Menu - mobile view
        $('#globalNavContainer,#accessibilityLinks,#localNav,#relatedNav').find('a,button').prop('tabindex', -1);

        //Market segment menu items
        if ($('body').hasClass('ind')) {
            $('#navbar-collapse-grid').appendTo('#menuInd');
        }
        if ($('body').hasClass('bus')) {
            $('#navbar-collapse-grid').appendTo('#menuBus');
        }
        if ($('body').hasClass('npr')) {
            $('#navbar-collapse-grid').appendTo('#menuNpr');
        }
        if ($('body').hasClass('spr')) {
            $('#navbar-collapse-grid').appendTo('#menuSpr');
        }
        if ($('body').hasClass('txp')) {
            $('#navbar-collapse-grid').appendTo('#menuTxp');
        }
        if ($('body').hasClass('corp')) {
            $('#navbar-collapse-grid').appendTo('#menuCorp');
        }

    } else {
        // All other browsers desktop view
        $('#globalNavContainer').insertAfter('#logoSearch');
        $('#accessibilityContainer').insertAfter('#navBarTop');

        //Remove tabindex to default to normal tab order - tablet and desktop views
        $('#globalNavContainer,#accessibilityLinks,#localNav,#relatedNav').find('a,button').removeAttr('tabindex');

        if ($('#leftArea,.slider-arrow').hasClass('hide')) {
            $('#leftArea,.slider-arrow').removeClass('hide');
        }
    }

    if ($(this).width() > 1199) {
        $('#footersocialBarContainer').insertBefore('#footerLinksContainer').removeClass('SBN-footer');
        $('#socialInnerWrap').removeClass('row-offcanvas row-offcanvas-left');
        $('#footerLinksContainer').removeClass('SBN-foot-links');
    } else {
        $('#footersocialBarContainer').insertAfter('#footerWrapper').addClass('SBN-footer');
        $('#socialInnerWrap').addClass('row-offcanvas row-offcanvas-left');
        $('#footerLinksContainer').addClass('SBN-foot-links');
    }
});

$("#wrapper").ready(function () {
    $("#search_container").ready(function () {
        if ($("#search_container").exists()) {
            var Search = $("#search_container");
            BindBannerSearchEvents();
        }
    });
});

function BindBannerSearchEvents() {
    var Search = $("#search_container");
    var Input = Search.find("input[type=text]");

    Input.focus(function () {
        if (Input.val() == Input.prop('defaultValue')) {
            Input.val("");
        }
    }).blur(function () {
        if (Input.val().length != 0) {
            Input.addClass("inputBlurFilled");
        }
        if (Input.val().length == 0) {
            Input.val(Input.prop('defaultValue')).removeClass("inputBlurFilled");
        }
    }).keyup(function handler(event) {
        Reset_Fields("#adv_container", "");
        Reset_Fields("#results_container", "default");
    }).keypress(function handler(event) {
        if (event.keyCode == 13) {
            (event.preventDefault) ? event.preventDefault() : event.returnValue = false;
            (event.stopPropagation) ? event.stopPropagation() : event.cancelBubble = true;
            Search.find("input[type = submit]").click();
        }
    });
}

function BindAdvancedLinkEvent() {
    if ($("#search_linker a").exists()) {
        var Search = $("#search_container");
        var checkbox = Search.find("#chk_banner_segment")[0];
        var market = checkbox.value;
        var urlString = "/" + advancedSearchPage;

        $("#search_linker a").click(function (e) {
            if (market.search("|") > -1) {
                market = market.split('|')[0];
            }
            urlString = urlString + "?ms=" + market;
            window.location = urlString;
        });
    }
}

//Checks child elements have focus and returns true or false.
function CheckChildElementsHaveFocus(parentContainerElementIds) {
    var hasFocus = false;

    $(parentContainerElementIds).find('input, textarea, select').each(function () {
        if (document.activeElement.id == $(this).attr('id')) {
            hasFocus = true;
        }
    });

    return hasFocus;
}

// Sets the ARIA attributes to the elements for the screen readers.
function SetAriaForScreenReaders() {
    $("select, input, textarea").each(function () {
        // Set the ARIA required attribute.
        if ($(this).data("customValidate") != undefined) {
            ($(this).data("customValidate").options.mandatoryMessage != "") ? $(this).attr("aria-required", true) : $(this).attr("aria-required", false);
        }
    });
}

// Sets the mail to link containing the subject & message body.
function SetMailToLink(mailToClass, subject, body) {
    var href = "mailto:?subject=" + subject + "&" + "body=" + body;
    $("." + mailToClass).attr("href", href);
}

// Sets the social sharing mail link containing the subject & message for Small Business Newsroom microsite.
function SetMailToLinkForSBN() {
    if (window.MAIL_TO_SUBJECT === undefined) {
        window.MAIL_TO_SUBJECT = "An ATO Small Business Newsroom link has been shared with you.";
    }
    if (window.MAIL_TO_BODY === undefined) {
        window.MAIL_TO_BODY = "Read this article to get the latest news for small business:%0A%0A" + window.location.href + "%0A%0ASubscribe to the Small Business Newsroom: http://www.ato.gov.au/sbnewssubscribe%0AATO Small Business Newsroom: http://www.ato.gov.au/sbnews";
    }

    SetMailToLink("mailTo", window.MAIL_TO_SUBJECT, window.MAIL_TO_BODY);
}

