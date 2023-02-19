
// Resets search fields to their default state should a user enter values into a search field
// on another search view. Added to avoid conflicting search values being submitted
$("#wrapper").ready(function () {
    $("#search_container").ready(function () {
        BindBannerSearchEvents();       
    });
});


// resets search fields to the default value
function Reset_Fields(container, defaultText) {
    var resetValue = "";
    resetValue = $("input[id$=hdn_search_Text_Basic]").val();
    $(container).find("input[type=text]").val(resetValue);
}


// <summary>
// Event handler for XSLT generated search buttons. 
// </summary>
// <param name="default_text" type="String">Default text that appears in search field</param>
// <param name="blnSearchWithinResults" type="boolean">filter an existing result set</param>
// <param name="iFormNum" type="Integer">Determines whether search was top (0) or bottom (1)</param>
// <param name="primaryCollection" type="String">primary GSA collection</param>
// <param name="dcDateFilter" type="String">Constant to be used with date filtering</param>
// <param name="dcSearchable" type="String">Constant used to to identify searchable pages</param>
// <param name="dcIndex" type="String">Constant used to to identify searchable pages</param>
// <param name="resultPage" type="String">the .aspx page on which results are displayed</param>
// <returns></returns>
// <remarks></remarks>
function Parse_Banner_Search(defaultText, primaryCollection, dcDateFilter, gsaSearchable, resultPage) {
    var url = new StringBuilder();
    var Search = $("#search_container");
    var query = Search.find("input[type=text]").val();

    if (query == defaultText) {
        query = "";
        url.append("/");
        url.append(resultPage);
        url.append("?");
    } else {
        // create a query string and navigate to the Results page
        url.append("/");
        url.append(resultPage);
        url.append("?");

        // replace the spaces with '+'
        url.append("q=");
        url.append(escape(query.replace(/ /g, "+")));
        // replace '|' character with double encoded version
        url.append("&site=");
        url.append(primaryCollection);
        url.append("&start=0")
        window.location = url.toString();
    }
    window.location = url.toString();
}

//// Performs a search when the Enter key is pressed
function checkEnterKeyPress(e, iFormNum) {
    if (e.keyCode == 13) {
        document.forms[iFormNum].btnSearch.focus();
    }
}

// Initializes a new instance of the StringBuilder class
// and appends the given value if supplied
function StringBuilder(value) {
    this.strings = new Array("");
    this.append(value);
}

// Appends the given value to the end of this instance.
StringBuilder.prototype.append = function (value) {
    if (value) {
        this.strings.push(value);
    }
}

// Clears the string buffer
StringBuilder.prototype.clear = function () {
    this.strings.length = 1;
}

// Converts this instance to a String.
StringBuilder.prototype.toString = function () {
    return this.strings.join("");
}