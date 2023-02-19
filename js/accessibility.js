//code here to implement accessibilty functionality.
/*------------------------------------------------------------
	Document Text Sizer- Copyright 2003 - Taewook Kang.  All rights reserved.
	Coded by: Taewook Kang (txkang.REMOVETHIS@hotmail.com)
	Web Site: http://txkang.com
	Script featured on Dynamic Drive (http://www.dynamicdrive.com)
	
	Please retain this copyright notice in the script.
	License is granted to user to reuse this code on 
	their own website if, and only if, 
	this entire copyright notice is included.
--------------------------------------------------------------*/

//Specify affected tags. Add or remove from list:
var tgs = new Array( 'content');

//Specify spectrum of different font sizes:
var szs = new Array( '80%','90%','100%','110%','120%','130%','140%' );
var startSz = 3;

function textSize( trgt,inc ) {
	if (!document.getElementById) return
	var d = document,cEl = null,sz = startSz,i,j,cTags;
	
	sz += inc;
	if ( sz < 0 ) sz = 0;
	if ( sz > 6 ) sz = 6;
	startSz = sz;
		
	if ( !( cEl = d.getElementById( trgt ) ) ) cEl = d.getElementsByTagName( trgt )[ 0 ];
	
	if (cEl)
	{
		cEl.style.fontSize = szs[ sz ];

			for ( i = 0 ; i < tgs.length ; i++ ) {
					cTags = cEl.getElementsByTagName( tgs[ i ] );
							for ( j = 0 ; j < cTags.length ; j++ ) cTags[ j ].style.fontSize = szs[ sz ];
			}
	}
}

/* This sets the high and low contrast versions of the site, as well as disables the CSS.
The script is the ubiquitous style-sheet switcher from "A List Apart" http://www.alistapart.com/articles/alternate/
*/
function setActiveStyleSheet(title) {
    if (title == 'Low Contrast') {
        title = 'CSSFile';
    }

    if (title == 'High Contrast') {
        title = 'CSSContrastFile';
    }

    if (title == 'Text Only') {
        title = 'CSSPlainTextFile';
    }

    var i, a, main;
    for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
        if (a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
          a.disabled = true;
          if (a.getAttribute("title") == title) a.disabled = false;
      }    
    }

  createCookie("atogovStyle", title, 365);  
}

function getActiveStyleSheet() {
  var i, a;
  for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
      if (a.getAttribute("rel") && a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title") && !a.disabled) return a.getAttribute("title");
  }
  return null;
}

function getTextSize()
{
 return startSz;
}

function setTextSize(objTarget, nIndex)
{
 if (isNaN(nIndex) == true)
 {
  nIndex = 3;
 }
 
 nIndex = parseInt(nIndex, 10);
 
 if (nIndex < 0)
 {
 	nIndex = 0;
 }
 else if (nIndex > (szs.length - 1))
 {
 	  nIndex = szs.length - 1;
 }

 startSz = nIndex;
 textSize(objTarget, 0);
}

function createCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
    
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function InitPage()
{
  var sTextSize = readCookie("atogovTextsize");
  sTextSize = sTextSize ? sTextSize : 2;
  setTextSize("wrapper", sTextSize);

  var cookie = readCookie("atogovStyle");
  var title = (cookie == null || cookie == "null") ? 'CSSFile' : cookie;

  setActiveStyleSheet(title);
}

window.onunload = function(e) {
  var title = getActiveStyleSheet();
  var nTextSize = getTextSize();
  createCookie("atogovStyle", title, 365);
  createCookie("atogovTextsize", nTextSize, 365);
}

$(document).ready(function() {
    InitPage();
});