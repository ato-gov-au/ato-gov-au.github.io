// Current page content 
function addCurrentPageBreadcrumb() {

    // 1) Get the title from current page 
    // 2) Append title string to end of breadcrumbs 

    var pageInfo = $(document).find("title").text();     //this will return document title + " |Australian Taxation office"
    var notNeeded;
    var title;
    var breadcrumbWrapper = $(".breadcrumbs ul");

    // Define what to get rid of 
    notNeeded = pageInfo.indexOf("|");

    // Cut the unecessary text out and get title only
    title = pageInfo.slice(0, notNeeded);


    //---------------Special Clause for SBN Event Template pages----------------------
    //these pages use special calender event as the page title
    var locationPath = window.location.pathname.toLowerCase();  //to check were on key dates page
    var inKeyDatePage = $('body').hasClass("calEventDetails");  //to check if its event template page
    var sbnTitleElement = $(".sbNewsroom #contentWrap #contentWrapArticle h1");
    //check the url to make sure we are on SBN newsroom keydates page and also check if the calEventDetails class exists on this page
    if(locationPath.indexOf('/newsroom/smallbusiness/key-dates/') >=0 && inKeyDatePage == true)
    {
        //if true, then we are on sbn event template page, so title variable becomes the sbn cal h1
        title = sbnTitleElement.text();
    }
    

    // Append current page title to a new list item in the ul breadcrumb list
    breadcrumbWrapper.append('<li class="breadcrumb">' + title + '</li>');
};

// Mobile Navigation update
function setMobileCrumb() {

    // Variables
    var breadcrumbsHrefArray = []; // href values
    var breadcrumbsTextArray = []; // link text values

    // For secondary content
    var isSecondaryContent = false; // default false. Can become true later
    var inDetail = 'In detail'; // Use this to check secondary content status

    // Desktop breadcrumbs
    var breadcrumbItem = $(".breadcrumbs ul li");

    // Mobile breadcrumbs 
    var mobileBreadcrumbs = $(".mobileBreadcrumbs");
    var topicReturnText = 'Back';
    var homeReturnText = 'Home';


    // Loop through current breadcrumbs, push href and text values to arrays
    breadcrumbItem.each(function (i, li) {
        href = $(this).find('a').attr('href');
        value = $(this).text();

        breadcrumbsHrefArray.push(href);
        breadcrumbsTextArray.push(value);

        if (value.indexOf(inDetail) > -1) {
            isSecondaryContent = true;
        }
    });

    // Set variables based on what we found
    var isPrimaryContent = (breadcrumbsTextArray.length == 3);

    var segmentIndex = 1;
    var topicIndex = 2;

    // Function to set mobile breadcrumbs content
    setMobileCrumbs = function (href, text) {
        if (href == undefined) {
            // Catch any pages missing the breadcrumbs completely 
            href = '/';
        }
        mobileBreadcrumbs.html('<a href="' + href + '">' + text + '</a>');
    };


    // Checks current length of the array. Determines page type. 

    // 1) IF 'isSecondaryContent' == true, we know already it is a secondary content page
    // 2) ELSE IF length of array == 3, user must be on primary tax topic page
    // 3) ELSE IF length array > 3, user is on a NESTED content page 

    if (isSecondaryContent) {
        // Use the tax topic href with static text value for mobile crumb
        setMobileCrumbs(breadcrumbsHrefArray[topicIndex], topicReturnText);

        // Add something we can use to style differently
        mobileBreadcrumbs.addClass('secondary');
    }
    else if (isPrimaryContent) {
        // Parent Primary content 

        // Use the segment href and text value for mobile crumb
        setMobileCrumbs(breadcrumbsHrefArray[segmentIndex], breadcrumbsTextArray[segmentIndex]);
    }
    else if (breadcrumbsTextArray.length > 3) {
        // Nested primary content
        var linkText = breadcrumbsTextArray[segmentIndex].replace('>', '');

        // Use the segment href and trimmed text value for mobile crumb
        setMobileCrumbs(breadcrumbsHrefArray[segmentIndex], linkText);
    }
    else {
        // Fallback - set link to Home; should not occur 
        setMobileCrumbs(breadcrumbsHrefArray[0], homeReturnText);
    }

};

$(document).ready(function () {
    addCurrentPageBreadcrumb();
    setMobileCrumb();
});
