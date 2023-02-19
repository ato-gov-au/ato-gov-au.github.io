//depends on jQuery and xxx_search_config.js

//build: Wed Jan 04 2017 15:30:00 GMT+1100 (AUS Eastern Daylight Time): try catch GA init error.
//build: Mon Nov 02 2016 15:30:00 GMT+1100 (AUS Eastern Daylight Time): enabled Faceted search(A/B Testing)
//build: Tue Oct 18 2016 18:00:00 GMT+1100 (AUS Eastern Daylight Time): add protection for ctype null case
//build: Tue Oct 04 2016 18:16:00 GMT+1100 (AUS Eastern Daylight Time): fixing tag manager conflict issue.
//build: Fri Jul 08 2016 14:26:00 GMT+1100 (AUS Eastern Daylight Time): fixing event tracking for QC search
//build: Wed Jun 29 2016 10:22:00 GMT+1100 (AUS Eastern Daylight Time): rename namespace for ga functions
//define namespace
var ato = ato || {};
ato.spa = ato.spa || {};
ato.spa.gsa = ato.spa.gsa || {};
ato.spa.gsa.ga = ato.spa.gsa.ga || {};
ato.spa.gsa.settings = ato.spa.gsa.settings || {};

//store the previous url
ato.spa.gsa.ga.lastURL = '';

ato.spa.gsa.ga.eventToSend = null;//{p1: null, p2: null, p3: null, p4: null, p5: null, p6:null};

ato.spa.gsa.ga.otherTrackers = new Array();	

ato.spa.gsa.ga.navigationElementSelector = ".searchFooter .pagination";
ato.spa.gsa.ga_dimension_start_index = "1";
ato.spa.gsa.ga_category_prefix = "ElasticSearch-";
ato.spa.gsa.settings.gsa_page_size = 10;
ato.spa.gsa.settings.gsa_container_id = "results_container";
ato.spa.gsa.ga_nopageview_for_default = false;
ato.spa.gsa.ga_account = "UA-72006902-1";
if(ato.spa.gsa.ga.newFrontend == undefined){
	ato.spa.gsa.ga.newFrontend = false;
}

ato.spa.gsa.ga.init = function(context){
	ato.spa.gsa.ga.context = context;
	
	if(window.ga) {
		ga('create', ato.spa.gsa.ga_account, 'auto');
		ato.spa.gsa.ga._init(context);
	} else if (ato.spa.gsa.ga_account != null && ato.spa.gsa.ga_account != ''){
		try{
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
				  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
				  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
				  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
				  
			     ga('create', ato.spa.gsa.ga_account, 'auto');
			     ato.spa.gsa.ga._init(context);
		}catch(e){
			console.log("GA init failed");
		}
		

	}
};

ato.spa.gsa.ga._init = function(context) {
	ato.spa.gsa.ga.lastURL = ""; // record first pageview to include q filter parameters
    //bind event for links
	context.registerPostAction(ato.spa.gsa.ga.trackLink);
	
	context.registerPostAction(ato.spa.gsa.ga.handleURLChange);
	context.registerPostAction(ato.spa.gsa.ga.sendPostResultEvent);
};

ato.spa.gsa.ga.getLastFilter = function() {
	
	var filterCode = ato.spa.search.getCurrentFilter();
	if(ato.spa.search.current_site == "legaldb"){
		return "Legal database";
	}

	if (filterCode == "") {
	   return "All Results";
	}
	
	return ato.spa.config.marketSegmentLookup(filterCode);
};

ato.spa.gsa.ga.getLastDateFilter = function() {

	var dateFilter = ato.spa.search.current_dateFilterValue;
	
	switch(dateFilter) {
	case "":
		return "All";
	case "c":
		return "Current";
	case "p":
		return "Previous Years";
	}

};

ato.spa.gsa.ga.getLastQuery = function() {
	return ato.spa.search._getQFromUI();
	//return ato.spa.gsa.ga.getParameterFromURL("q");
};

ato.spa.gsa.ga.getParameterFromURL = function(name, url) {
	if (!url) {
		url = ato.spa.search.getLastRequestFromHash();
	}

	return ato.spa.gsa.getParameterByNameInURL(name, url);
};

ato.spa.gsa.ga.doGA = function(method, p1, p2, p3, p4, p5, p6){
	switch ( method ) {
		case 'create':
			ato.spa.gsa.ga.doGACreate();
			break;
		case 'set':
			ato.spa.gsa.ga.doGASet(p1, p2);
			break;
		case 'send':
			ato.spa.gsa.ga.doGASend(p1,p2,p3,p4,p5, p6);
			break;
		default:
			break;
	}
};

//to support multi accounts
ato.spa.gsa.ga.doGASet = function(key, value){ 
	//get dimension index
	var dimensionIndexes = ato.spa.gsa.ga_dimension_start_index.split(',');
	var startIndex = parseInt(dimensionIndexes[0]); 
	var newKey = ato.spa.gsa.ga._resetDimensionIndex(key,startIndex);
	ga('set', newKey, value);
	for(var i = 0; i < ato.spa.gsa.ga.otherTrackers.length; i++){
		startIndex = parseInt(dimensionIndexes[i+1]); 
		newKey = ato.spa.gsa.ga._resetDimensionIndex(key,startIndex);
		var tracker = ato.spa.gsa.ga.otherTrackers[i];
		ga(tracker + '.set', newKey, value);
	}//end for
};

ato.spa.gsa.ga._resetDimensionIndex = function(dimensionKey, startIndex){
	if(dimensionKey.indexOf('dimension') == 0){
		var currentIndex = parseInt(dimensionKey.substr('dimension'.length));
		// check for constants which stay the same for all properties
		if (ato.spa.gsa.ga_dimension_constants && ato.spa.gsa.ga_dimension_constants != "") {
			var constants = ato.spa.gsa.ga_dimension_constants.split(',');
			if ($.inArray(currentIndex + "", constants) >= 0) {
				return dimensionKey;
			}
		}
		
		return 'dimension' + (startIndex + currentIndex - 1);
	}else{
		return dimensionKey;
	}
	
};


//'send', 'event', 'category', 'action', 'label', value
//to support multi accounts
ato.spa.gsa.ga.doGASend = function(event, category,action,label,value, options){
//	// try set dl parameters
//	ga('set', 'location', location.href);
//	for(var i = 0; i < ato.spa.gsa.ga.otherTrackers.length; i++){
//		var tracker = ato.spa.gsa.ga.otherTrackers[i];
//		ga(tracker + '.set', 'location', location.href);
//	}//end for

	if (value instanceof Object) {
		options = value;
	}
	
	var newCategory = category;
	var dimensionIndexes = ato.spa.gsa.ga_dimension_start_index.split(',');
	
	if(category != null && event != 'pageview'){
		newCategory = ato.spa.gsa.ga_category_prefix + newCategory;
	}
	if( event != 'pageview' || (category != '' && category != null) || (event == 'pageview' && ato.spa.gsa.ga_nopageview_for_default == false)){
        var startIndex = parseInt(dimensionIndexes[0]); 
		
		var newOptions = {};
		if (options) {
			$.each(options, function(name, value) {
				if (name.indexOf("dimension") == 0) {
					var newKey = ato.spa.gsa.ga._resetDimensionIndex(name, startIndex);
					newOptions[newKey] = value;
				} else {
					newOptions[name] = value;
				}
			});
		}
		
		if (value instanceof Object) {
			ga('send', event, newCategory,action,label, newOptions);
		} else {
			ga('send', event, newCategory,action,label,value, newOptions);
		}
		
	}
	
	for(var i = 0; i < ato.spa.gsa.ga.otherTrackers.length; i++){
		var startIndex = parseInt(dimensionIndexes[i+1]); 
		
		var newOptions = {};
		if (options) {
			$.each(options, function(name, value) {
				if (name.indexOf("dimension") == 0) {
					var newKey = ato.spa.gsa.ga._resetDimensionIndex(name, startIndex);
					newOptions[newKey] = value;
				} else {
					newOptions[name] = value;
				}
			});
		}
		
		
		var tracker = ato.spa.gsa.ga.otherTrackers[i];
		if (value instanceof Object) {
			ga(tracker + '.send', event, newCategory,action,label, newOptions);
		} else {
			ga(tracker + '.send', event, newCategory,action,label,value, newOptions);
		}
		
	}//end for
};

ato.spa.gsa.ga.handleURLChange = function(){
	var url = location.pathname + location.search + location.hash;
	if(ato.spa.gsa.ga.isSameStr(url,ato.spa.gsa.ga.lastURL) == false){
		
		ga('set', 'page',location.pathname + "?q=" + ato.spa.gsa.ga.getLastQuery() + "&filter=" + ato.spa.gsa.ga.getLastFilter());
		//ato.spa.gsa.ga.doGASet('location', location.href + "?q=" + ato.spa.gsa.ga.getLastQuery() + "&filter=" + ato.spa.gsa.ga.getLastFilter());
		ga('send', 'pageview');
	}
	ato.spa.gsa.ga.lastURL = url;
};

ato.spa.gsa.ga.isSameStr = function(stringA, stringB){
	stringA = stringA == null ? '' : stringA.trim();
	stringB = stringB == null ? '' : stringB.trim();
	return stringA == stringB;
};


ato.spa.gsa.ga.sendPostResultEvent = function() {
	
	// if no result, send unsuccessful result event
	var query = ato.spa.gsa.ga.getLastQuery();
	
	//var as_sitesearch = ato.spa.gsa.ga.getParameterFromURL("as_sitesearch");
	
	if (ato.spa.gsa.ga.is_zero_result(query)) {

		var options = {nonInteraction: true, 'dimension1': ato.spa.gsa.ga.getLastFilter(), 'dimension2':  ato.spa.gsa.ga.getLastDateFilter()};

		ato.spa.gsa.ga.doGA('send', 'event','No Results', 'Unsuccessful Search', query, options);
		
	} 
	
	if (ato.spa.gsa.ga.isSuccessfulSearch(query)) {
		
		if (ato.spa.gsa.ga.eventToSend != null && ato.spa.gsa.ga.eventToSend.p1 != null) {
			var event = ato.spa.gsa.ga.eventToSend;
			
			ato.spa.gsa.ga.doGA('send', event.p1, event.p2, event.p3, event.p4, event.p5, event.p6);
			
			ato.spa.gsa.ga.eventToSend = null;
		}
	}
	
};

//
ato.spa.gsa.ga.triggerDropdownFilter = function(filterType, filterDisplayValue) {

	var query = ato.spa.gsa.ga.getParameterFromURL("q");

	var start = ato.spa.gsa.ga.getParameterFromURL("start");
	var startInt = 0;
	if(start != null && start != ''){
		startInt = parseInt(start);
	};
	//get page
	var num = ato.spa.gsa.ga.getParameterFromURL("num");
	//set default page size
	if(num == null || num == ''){
		num = ato.spa.gsa.settings.gsa_page_size;
	}
	
	var page = startInt / parseInt(num) + 1 ;
	
	var filter = ato.spa.gsa.ga.getLastFilter();
	
	var dateFilter = ato.spa.gsa.ga.getLastDateFilter();
	var p3;
	if (filterType == "filter") {
		filter = filterDisplayValue;
		p3 = "Filter Click";
	} else if (filterType == "date_filter") {
	    dateFilter = filterDisplayValue;
	    p3 = "Date Filter Click";
	}
	
	ato.spa.gsa.ga.eventToSend = {
		    p1: "event", 
		    p2: "Results",
		    p3: p3,
		    p4: query,
		    p5: page,
		    p6: {'dimension1': filter, 'dimension2': dateFilter, 'dimension3' : ato.spa.gsa.ga.newFrontend}
	};
};

ato.spa.gsa.ga.triggerInitialSearch = function(query, fromSuggest, url) {
	//tracking load action
	var page = 1;
    if (url) {
    	var start = ato.spa.gsa.ga.getParameterFromURL("start", url);
    	var startInt = 0;
    	if(start != null && start != ''){
    		startInt = parseInt(start);
    	};
    	//get page
    	var num = ato.spa.gsa.ga.getParameterFromURL("num", url);
    	//set default page size
    	if(num == null || num == ''){
    		num = ato.spa.gsa.settings.gsa_page_size;
    	}
    	
    	page = startInt / parseInt(num) + 1 ;
    }
	
	
	var filter = ato.spa.gsa.ga.getLastFilter();
	
	var dateFilter = ato.spa.gsa.ga.getLastDateFilter();
	
	var action = "Successful Search" + (fromSuggest? " - Suggest" : "");
	ato.spa.gsa.ga.eventToSend = {
		    p1: "event", 
		    p2: "Results",
		    p3: action,
		    p4: query,
		    p5: page,
		    p6: {nonInteraction: true, 'dimension1': filter, 'dimension2': dateFilter, 'dimension3' : ato.spa.gsa.ga.newFrontend}
	};

};

ato.spa.gsa.ga.trackLink = function(){
	$("a", $("#" + ato.spa.gsa.settings.gsa_container_id)).each(function(){
		$(this).click(function(){
			var cdata = $(this).attr("cdata");
			var ctype = $(this).attr("ctype");
			var rank = $(this).attr("rank");
			var src_id = $(this).attr("src_id");
			/*
			if (!ctype) {
				// handle filters/dynamic nav
				if ($(this).hasClass(ato.spa.gsa.settings.gsa_filter_search_css)) {
					ctype = 'filter';
					cdata = $(this).attr('v');
				} else {
					ctype = "OTHER";
				}
			    
			// unknown link type
			}
			*/
			
			if (ctype == "nav.page") {
				cdata = $(this).text();
			}
			
			var url = $(this).attr("href");
			
			var site = ato.spa.search.current_site;
			
			var query = ato.spa.gsa.ga.getParameterFromURL("q", url);

			var start = ato.spa.gsa.ga.getParameterFromURL("start", url);
			
				
			// Calls Analytics Event Tracking code
			ato.spa.gsa.ga.cl_analytics_clk(url, query, ctype, cdata, rank, start, site, src_id);
		});//click
	});//each

};


ato.spa.gsa.ga.is_zero_result = function(query){
		if(query == '' || query == 'undefined'){
			//query is empty, then there is no search
			return false;
		}else{	
			if($(ato.spa.gsa.ga.navigationElementSelector).length == 0) {
				return true;
			}else{
				return false;
			}
		}
  	};
  	
ato.spa.gsa.ga.isSuccessfulSearch = function(query){
	if(query == '' || query == 'undefined'){
		//query is empty, then there is no search
		return false;
	}else{
		if($(ato.spa.gsa.ga.navigationElementSelector).length == 0) {
			return false;
		}else{
			return true;
		}
	}
};

/**
 * Function that logs the click to be hit with Google Analytics
 * 
 * Uses all the same parameters as search reporting click logger.
 * 
 * @return {Boolean} true if we think we logged the click.
 */
ato.spa.gsa.ga.cl_analytics_clk = function(url, query, ctype, cdata, rank, start, site, src_id) {
	if(query == null || query  ==''){
		query = ato.spa.gsa.ga.getLastQuery();
	}
	if(ctype == null){
		ctype = "";
	}
	ctype = ctype.toString();
	if(ctype == 'filter'){
		return;
	}
	var pageSize = ato.spa.gsa.settings.gsa_page_size;
	if(start == '' || start == null){
		start = 0;
	}else{			
		start = parseInt(start);
	}
	var totalRank = 0;
	if(rank != null && rank != ''){
		totalRank = start + parseInt(rank);
	}
	
	//custom dimension3- Rank of Selected Results
	var totalRankStr = "";
	if(totalRank){
		totalRankStr = totalRank;
	}
	
	if(totalRank < 10 && totalRank > 0){ //if it 
		totalRankStr = "0" + totalRank;
	}
	
	var page = start / pageSize + 1;
	
	var filter = ato.spa.gsa.ga.getLastFilter();
	var dateFilter = ato.spa.gsa.ga.getLastDateFilter();
	var dimensions = {'dimension1': filter, 'dimension2': dateFilter, 'dimension3' : ato.spa.gsa.ga.newFrontend}
	
	var dimensionsNonInteraction = {nonInteraction: true, 'dimension1': filter, 'dimension2': dateFilter, 'dimension3' : ato.spa.gsa.ga.newFrontend};
	
	//Sample
	//ga('send', 'event', 'category', 'action');
	//ga('send', 'event', 'category', 'action', 'label');
	//ga('send', 'event', 'category', 'action', 'label', value);  // value is a number.
    
    switch (ctype) {
	    case "nav.next":
	    	ato.spa.gsa.ga.eventToSend = {
			    p1: "event", 
			    p2: "Results",
			    p3: 'Next Results Page Click',
			    p4: query,
			    p5: page,
			    p6: dimensions
		    };

	        break;
	    case "nav.page":
	    	ato.spa.gsa.ga.eventToSend = {
			    p1: "event", 
			    p2: "Results",
			    p3: 'Specific Page Number Click',
			    p4: query,
			    p5: page,
			    p6: dimensions
		    };
	    	
	        break;
	    case "nav.prev":
	    	ato.spa.gsa.ga.eventToSend = {
			    p1: "event", 
			    p2: "Results",
			    p3: 'Previous Results Page Click',
			    p4: query,
			    p5: page,
			    p6: dimensions
		    };
	    	
	        break;
	        
	    case "spell":
	    	ato.spa.gsa.ga.eventToSend = {
			    p1: "event", 
			    p2: "Results",
			    p3: "Successful Search",
			    p4: query,
			    p5: page,
			    p6: dimensionsNonInteraction
			    /*p5: {nonInteraction: true, 'dimension6': lastFilter + " - Spelling", 'dimension5': 1}
			     */
			   
		    };
	        break;
	        
	    case "synonym":
	    	ato.spa.gsa.ga.eventToSend = {
			    p1: "event", 
			    p2: "Results",
			    p3: "Successful Search",
			    p4: query,
			    p5: page,
			    p6: dimensionsNonInteraction
			    /*p5: {nonInteraction: true, 'dimension6': lastFilter + " - Synonym", 'dimension5': 1}
		        */
		    };
	        break;
	        
	    case "collection_filter":
	    	//set filter
	    	ato.spa.gsa.ga.eventToSend = {
			    p1: "event", 
			    p2: "Results",
			    p3: "Collection Filter Click",
			    p4: query,
			    p5: page,
			    p6: dimensions
		    };
	    	
	    	break;
	    case "date_filter":
	    	//set filter
	    	ato.spa.gsa.ga.eventToSend = {
			    p1: "event", 
			    p2: "Results",
			    p3: "Date Filter Click",
			    p4: query,
			    p5: page,
			    p6: dimensions
		    };
	    	
	    	break;
	    case "sitesearch":
	    	
	    	ato.spa.gsa.ga.eventToSend = {
			    p1: "event", 
			    p2: "Results",
			    p3: "More results from... Link Click",
			    p4: query,
			    p5: page,
			    p6: dimensions
		    };
	        break;
	    
	    case "showomitted":
	    	ato.spa.gsa.ga.eventToSend = {
			    p1: "event", 
			    p2: "Results",
			    p3: "Include Omitted Result... Link Click",
			    p4: query,
			    p5: page,
			    p6: dimensions
		    };
	        break;
	    case "c":
	    	ato.spa.gsa.ga.doGA('send', 'event','Results Clicks', 'Page Result Click', query, totalRank, dimensions);
	    	//set result type:
	    	/*
	    	if(cdata != null && cdata.length > 0){
	    		ato.spa.gsa.ga.doGA('send', 'event','Results Clicks', 'Page Result Click', query, totalRank, {'dimension3': totalRankStr, 'dimension5': page, 'dimension4': url, 'dimension7': cdata});
	    	} else {
	    		ato.spa.gsa.ga.doGA('send', 'event','Results Clicks', 'Page Result Click', query, totalRank, {'dimension3': totalRankStr, 'dimension5': page, 'dimension4': url});
	    	}*/
	    	// GSA_Rank GSA_Page only to 'Page Result Click' event - UOM-76
	    	//Custom dimention 5 - Page of Selected Results
	    	
	        break;
	    case "keymatch":
	    	ato.spa.gsa.ga.doGA('send', 'event','Results Clicks', 'Keymatch Result Click', query, dimensions);
	    	/*
	    	if(cdata != null && cdata.length > 0){
	    		ato.spa.gsa.ga.doGA('send', 'event','Results Clicks', 'Keymatch Result Click', query, {'dimension4': url, 'dimension5': page, 'dimension7': cdata});
	    	} else {
	    		ato.spa.gsa.ga.doGA('send', 'event','Results Clicks', 'Keymatch Result Click', query, {'dimension4': url, 'dimension5': page});
	    	}*/
	    	
	        break;
	    case "qlk":
	    	ato.spa.gsa.ga.doGA('send', 'event','Results Clicks', 'Keymatch Quicklink Click', query, dimensions);
	    	/*
	    	if(cdata != null && cdata.length > 0){
	    		ato.spa.gsa.ga.doGA('send', 'event','Results Clicks', 'Keymatch Result Click', query, {'dimension4': url, 'dimension5': page, 'dimension7': cdata});
	    	} else {
	    		ato.spa.gsa.ga.doGA('send', 'event','Results Clicks', 'Keymatch Result Click', query, {'dimension4': url, 'dimension5': page});
	    	}*/
	    	
	        break;
	        
	    default:
	    	ato.spa.gsa.ga.eventToSend = {
			    p1: "event", 
			    p2: "Results",
			    p3: "Unknown Result Type",
			    p4: query,
			    p5: page,
			    p6: dimensions
		    };

	        break;
    }
    return new Boolean(true);
};
