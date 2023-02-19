// --- All jquery initialization scripts

$(document).ready(function () {
    // --- Banner Content Slider scripts
    // --- Only used on home page and market segment pages
    // ---
    setTimeout(function () {
        $('#slider li').fadeIn(200); // force slider to show only once JS has loaded and not before CSS set as display: none;
    }, 1100);

    $('#slider')
	.anythingSlider({
	    // Appearance
	    expand: true,    // If true, the entire slider will expand to fit the parent element
	    resizeContents: true,      // If true, solitary images/objects in the panel will expand to fit the viewport

	    // Navigation
	    startPanel: 1,         // This sets the initial panel
	    hashTags: false,      // Should links change the hashtag in the URL?
	    buildArrows: false,      // If true, builds the forwards and backwards buttons
	    buildNavigation: true,      // If true, buildsa list of anchor links to link to each panel
	    navigationFormatter: null,      // Details at the top of the file on this use (advanced use)

	    // Slideshow options
	    autoPlay: true,      // This turns off the entire slideshow FUNCTIONALY, not just if it starts running or not
	    startStopped: false,     // If autoPlay is on, this can force it to start stopped
	    pauseOnHover: true,      // If true & the slideshow is active, the slideshow will pause on hover
	    stopAtEnd: false,     // If true & the slideshow is active, the slideshow will stop on the last page
	    playRtl: false,     // If true, the slideshow will move right-to-left
	    startText: "Play",   // Start button text
	    stopText: "Pause",    // Stop button text
	    delay: $('#slider').attr('duration'), //$('duration') ,//6000, //,      // How long between slideshow transitions in AutoPlay mode (in milliseconds)
	    animationTime: $('#slider').attr('Interval'), // $('Interval'),       // How long the slideshow transition takes (in milliseconds)
	    easing: "swing",   // Anything other than "linear" or "swing" requires the easing plugin
	    delayBeforeAnimate: 300    //300-orig     // How long to pause slide animation before going to the desired slide (used if you want your "out" FX to show).
	}).anythingSliderFx({
	    // base FX definitions can be mixed and matched in here too. 
	    '.fade': ['fade'],

	    // for more precise control, use the "inFx" and "outFx" definitions 
	    // inFx = the animation that occurs when you slide "in" to a panel 
	    inFx: {
	        '#slider h1': { opacity: 1, duration: 600 },
	        '#slider p': { opacity: 1, duration: 300 },
	        '#slider .bannerImage': { opacity: 1, duration: 600 },
	        '#slider .cta': { opacity: 1, duration: 300 }
	    },
	    // out = the animation that occurs when you slide "out" of a panel 
	    // (it also occurs before the "in" animation) 
	    outFx: {
	        '#slider h1': { opacity: 0, duration: 200 },
	        '#slider p': { opacity: 0, duration: 200 },
	        '.bannerImage': { opacity: 0, duration: 200 }
	    }
	});
   
});
