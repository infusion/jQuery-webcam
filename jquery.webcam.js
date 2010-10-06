/**
* jQuery webcam
* Copyright (c) 2010, Robert Eisele (robert@xarg.org)
* Dual licensed under the MIT or GPL Version 2 licenses.
* Date: 09/12/2010
*
* @author Robert Eisele
* @version 1.0
*
* @see http://www.xarg.org/project/jquery-webcam-plugin/
**/

(function ($) {

    var webcam = {

	id: null,

	width: 320,
	height: 240,

	mode: "callback", // callback | save | stream

	swffile: "jscam.swf",
	quality: 85,

	debug:	    function () {},
	onCapture:  function () {},
	onTick:	    function () {},
	onSave:	    function () {},
	onLoad:	    function () {}
    };

    window.webcam = webcam;

    $.fn.webcam = function(options) {

	if (typeof options === "object") {
	    for (var ndx in webcam) {
		if (typeof options[ndx] !== "undefined") {
		    webcam[ndx] = options[ndx];
		}
	    }
	}

	var source = '<object id="webcam-object" type="application/x-shockwave-flash" data="'+webcam.swffile+'" width="'+webcam.width+'" height="'+webcam.height+'"><param name="movie" value="'+webcam.swffile+'" /><param name="FlashVars" value="mode='+webcam.mode+'&amp;quality='+webcam.quality+'" /></object>';

	if (null !== webcam.id) {
	    $('#' + webcam.id).html(source);
	} else {
	    this.append(source);
	}

	(_register = function(run) {

	    var cam = document.getElementById('webcam-object');

	    if (typeof cam.capture !== "undefined") {

		/* Simple callback methods are not allowed :-/ */
		webcam.capture = function(x) {
		    try {
			return cam.capture(x);
		    } catch(e) {}
		}
		webcam.save = function(x) {
		    try {
			return cam.save(x);
		    } catch(e) {}
		}
		webcam.setCamera = function(x) {
		    try {
			return cam.setCamera(x);
		    } catch(e) {}
		}
		webcam.getCameraList = function() {
		    try {
			return cam.getCameraList();
		    } catch(e) {}
		}

		webcam.onLoad();
	    } else if (0 == run) {
		webcam.debug("error", "Flash movie not yet registered!");
	    } else {
		/* Flash interface not ready yet */
		window.setTimeout(_register, 1000 * (4 - run), run - 1);
	    }
	})(3);
    }

})(jQuery);
