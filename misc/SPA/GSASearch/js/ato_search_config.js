//build: Mon Nov 02 2016 15:30:00 GMT+1100 (AUS Eastern Daylight Time): enabled Faceted search(A/B Testing)
//build: Thu Feb 16 2015 13:24:00 GMT+1100 (AUS Eastern Daylight Time): add parameter ato_search_description_meta_tag to show snippet from metatag
//build: Thu Feb 12 2015 12:01:00 GMT+1100 (AUS Eastern Daylight Time): fix segment market search issue for banner search/filter display for banner search if segment is checked
//build: Thu Feb 05 2015 10:47:05 GMT+1100 (AUS Eastern Daylight Time): change ato_search_max_recommendation from 2 to 4
//build: Thu Feb 04 2015 16:50:05 GMT+1100 (AUS Eastern Daylight Time): change breadcrumbs/add advanced search
//build: Thu Feb 03 2015 11:40:05 GMT+1100 (AUS Eastern Daylight Time): Fixed legal db search issue for banner search
//build: Thu Feb 02 2015 17:06:05 GMT+1100 (AUS Eastern Daylight Time): use placeholder for banner search/apply to current ATO site behaviour
//build: Thu Jan 29 2015 10:50:05 GMT+1100 (AUS Eastern Daylight Time): add event tracking for filter/date_filter/result click/recommendation click/quick link/cluster/pagin
//version 20150128-1500 fix suggest display issue on firefox and IE
//version 20150123-1600 encode url for event tracking/show top when clicks page navigation
//version 20150123-1000 change filter html structure/add spinning wheel
//version 20150122-1620 support EventTracking
var ato = ato || {}; //define namespace
ato.spa = ato.spa || {};
ato.spa.gsa = ato.spa.gsa || {};
ato.spa.gsa.ga = ato.spa.gsa.ga || {};
(function () {
    ato.spa.config = ato.spa.config || {};
    var data = new Array();
    data['gsa_searchable'] = ''; //GSAPrimarySearchable - (ROBOTS:INDEX)
    data['criteria_error_message'] = 'You need to enter a keyword for your search.'; //searchCriteriaWarning
    data['legal_nonindexed'] = 'ROBOTS:Index%20Only'; //LegalNonIndexed
    data['legal_searchable'] = 'ROBOTS:Not%20Searchable'; //LegalSearchable
    
    data['atogov_dns'] = 'https://www.ato.gov.au'; //AtoGovDNS

    //data['atogov_dns'] = 'https://www.ato.gov.au'; // test

    data['legal_dns'] = 'http://law.ato.gov.au'; //LegalDNS
    data['search_tips_url'] = 'searchhelp'; //SearchTipsPage
    data['search_default_value'] = 'Enter search term'; //defalut search value
    data['search_default_value_new'] = 'Enter search term here';//default search value for faceted search
    data['advanced_page_url'] = 'AdvancedSearch.aspx'; //AdvancedSearchPage
    //data['results_page_url'] = 'spasearchtest.aspx'; //ResultsPage, //no used anymore
    data['atogov_collection'] = 'ATOGOV_Ektron'; //AtoGovCollection
    data['legaldb_collection'] = 'legaldb'; // LegalDatabaseCollection
    //the url must contain the question mark '?' or '&'
    //data['ato_search_spa_page'] = '/search?client=ato_html&output=xml_no_dtd&proxystylesheet=ato_html&proxycustom=<HOME/>&'; // To be confirmed with ATO team
    data['ato_search_spa_page'] = '/results.aspx?'; //only used for top search
	data['ato_search_spa_aliasname'] = '/search/';
    data['ato_search_frontend'] = 'ATOGOV_EKTRON';
    data['ato_search_frontend_b'] = 'ATOGOV_FACETED';
    data['ato_search_filter_frontend'] = 'ato_filter';
    data['ato_search_filter_show_count'] = true;
    //It is for TOD keymatches
    data['ato_search_max_definition'] = 2;
    //It is for QLK and REC keymatches
    data['ato_search_max_recommendation'] = 4;
    //It is for all keymatches. That is to say, data['ato_search_max_definition'] + data['ato_search_max_recommendation'] <= data['ato_search_max_keymatches']
    data['ato_search_max_keymatches'] = 10;

    data['ato_search_ui_hourglass_img'] = '/misc/spa/GSASearch/images/ajax-loading.gif';

    //for Event Tracking
    data['ato_search_event_suggest'] = 's_suggest';
    data['ato_search_event_search'] = 's_search';
    data['ato_search_event_filter'] = 's_filter';
    data['ato_search_event_date_filter'] = 's_date_filter';
    data['ato_search_event_result_click'] = 's_result_click';
    data['ato_search_event_recommendation'] = 's_recommendation';
    data['ato_search_event_quicklink'] = 's_quicklink';
    data['ato_search_event_cluster'] = 's_cluster';
    data['ato_search_event_paging'] = 's_paging';

    data['ato_search_event_p_tsv'] = 'tsv'; // total search result number, if no result. then 0

    data['ato_search_description_meta_tag'] = 'DCTERMS_description'; // if it set to empty, then default GSA snippet will be displayed in search result

    data['ato_abr_search_by_acn_url'] = "http://abr.business.gov.au/SearchByAbn.aspx?SearchText=";
    data['ato_abr_search_by_name_url'] = "http://abr.business.gov.au/SearchByName.aspx?SearchText=";
    data['ato_abr_search_by_abn_url'] = "http://abr.business.gov.au/SearchByAbn.aspx?abn=";
    data['ato_form_search_url'] = "https://www.ato.gov.au/Forms/?sorttype=Search&PageSize=10";
    data['ato_ct_search_url'] = "https://www.ato.gov.au/calculators-and-tools/?sorttype=Search&PageSize=10";
    data['ato_trc_search_url'] = "https://www.ato.gov.au/rates/?sorttype=Search&PageSize=10";	
    data['ato_pp_search_url'] = "https://www.ato.gov.au/print-publications/?sorttype=Search&PageSize=10";
    data['ato_mc_search_url'] = "https://www.ato.gov.au/Media-centre/?marketsegment=Entire%20Website&sorttype=Search&PageSize=10";
    
	ato.spa.config.getConfigValue = function (key) {
        var result = data[key];
        if (result) {
            return result;
        } else {
            return '';
        }
    };
    ato.spa.config.getMaxKeyMatches = function () {
        return data['ato_search_max_keymatches'];
    };
    ato.spa.config.getSearchPage = function () {
        return data['ato_search_spa_page'];
    };
	ato.spa.config.getAliasName = function(){
		return data['ato_search_spa_aliasname'];
	};

    ato.spa.config.getDefaultSite = function () {
        return ato.spa.config.getConfigValue("atogov_collection");
    };

	ato.spa.config.getSearchPlaceholder = function(){
		if(ato.spa.gsa.ga.newFrontend){
			return ato.spa.config.getConfigValue("search_default_value_new");
		}else{
			return ato.spa.config.getConfigValue("search_default_value");
		}
	};
	
	ato.spa.config.getDefaultFrontend = function(){
		var NEW_FRONTEND = "NEW_FRONTEND";
		var OLD_FRONTEND = "NEW_FRONTEND";
		var FRONTEND_COOKIE_NAME = "ATO_GSA_FRONTEND_CHOOSER";
		//check cookie
		var chooser = $.cookie(FRONTEND_COOKIE_NAME);
		if(!chooser) {
			var random = Math.floor(Math.random() * 100 + 1);
			var date = new Date();
	        var m = 60*24*30; //keep it for one month
	        date.setTime(date.getTime() + (m * 60 * 1000));

			if (random <= 5) {
				$.cookie(FRONTEND_COOKIE_NAME, NEW_FRONTEND,{ expires: date });
			} else {
				$.cookie(FRONTEND_COOKIE_NAME, OLD_FRONTEND,{ expires: date });
			}
			
			chooser = $.cookie(FRONTEND_COOKIE_NAME);
		}
		
		if (chooser == NEW_FRONTEND) {
			ato.spa.gsa.ga.newFrontend = true;
			return ato.spa.config.getDefaultFrontendB();
			
		} else {
			ato.spa.gsa.ga.newFrontend = false;
			return ato.spa.config.getDefaultClient();
		}
		
	};
	
    ato.spa.config.showFilterCount = function(){
		if(ato.spa.gsa.ga.newFrontend && ato.spa.config.getConfigValue("ato_search_filter_show_count")){
			return true;
		}else{
			return false;
		}
	};
    
	ato.spa.config.getDefaultClient = function(){
		return ato.spa.config.getConfigValue("ato_search_frontend");
	};
	
	ato.spa.config.getDefaultFrontendB = function(){
		return ato.spa.config.getConfigValue("ato_search_frontend_b");
	};
	
	ato.spa.config.getFilterFrontend = function(){
		return ato.spa.config.getConfigValue("ato_search_filter_frontend");
	};

    //key: id, value : label
    var marketSegmentlookupTable = new Array();
    marketSegmentlookupTable.push(['146', 'About ATO']);
    marketSegmentlookupTable.push(['210', 'Business']);
    marketSegmentlookupTable.push(['1004', 'Calculators and tools']);
    marketSegmentlookupTable.push(['1005', 'Forms']);
    marketSegmentlookupTable.push(['1006', 'General']);
    marketSegmentlookupTable.push(['1470', 'Individuals']);
    marketSegmentlookupTable.push(['1829', 'Media centre']);
    marketSegmentlookupTable.push(['1842', 'Non-profit']);
    marketSegmentlookupTable.push(['2026', 'Print publications']);
    marketSegmentlookupTable.push(['2027', 'Rates']);
    marketSegmentlookupTable.push(['2040', 'Super']);
    marketSegmentlookupTable.push(['2216', 'Tax professionals']);

    //ING
    var marketSegmentExcudelookupTable = new Array();
    marketSegmentExcudelookupTable.push('146'); //About
    marketSegmentExcudelookupTable.push('210'); //Business

    ato.spa.config.isExcludingGSACode = function (gsaCode) {
        return $.inArray(gsaCode, marketSegmentExcudelookupTable) != -1;
    };

    //usage sample: ato.spa.config.marketSegmentlookupTable["xxxx"]()
    ato.spa.config.marketSegmentLookup = function (ms) {
        //check if it is the key
        for (var i = 0; i < marketSegmentlookupTable.length; i++) {
            var tempArray = marketSegmentlookupTable[i];
            if (tempArray[0] == ms) {
                return tempArray[1];
            } else if (tempArray[1] == ms) {
                return tempArray[0];
            }
        }
        return ms;
    };

    function _getSegmentList() {
        var temp = '';
        for (var i = 0; i < marketSegmentlookupTable.length; i++) {
            if (i == 0) {
                temp = marketSegmentlookupTable[i][0];
            } else {
                temp += ',' + marketSegmentlookupTable[i][0];
            }
        } //end for
        ato.spa.config.MarketSegmentList = temp;
    }
    _getSegmentList();

})();

/*!
 * jQuery Cookie Plugin v1.3.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	//if (typeof define === 'function' && define.amd) {
		// AMD. Register as anonymous module.
//		define(['jquery'], factory);
	//} else {
		// Browser globals.
		factory(jQuery);
	//}
}(function ($) {

	var pluses = /\+/g;

	function raw(s) {
		return s;
	}

	function decoded(s) {
		return decodeURIComponent(s.replace(pluses, ' '));
	}

	function converted(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}
		try {
			return config.json ? JSON.parse(s) : s;
		} catch(er) {}
	}

	var config = $.cookie = function (key, value, options) {

		// write
		if (value !== undefined) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			value = config.json ? JSON.stringify(value) : String(value);

			return (document.cookie = [
				config.raw ? key : encodeURIComponent(key),
				'=',
				config.raw ? value : encodeURIComponent(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// read
		var decode = config.raw ? raw : decoded;
		var cookies = document.cookie.split('; ');
		var result = key ? undefined : {};
		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = decode(parts.join('='));

			if (key && key === name) {
				result = converted(cookie);
				break;
			}

			if (!key) {
				result[name] = converted(cookie);
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) !== undefined) {
			// Must not alter options, thus extending a fresh object...
			$.cookie(key, '', $.extend({}, options, { expires: -1 }));
			return true;
		}
		return false;
	};

}));

ato.spa.config.getDefaultFrontend();