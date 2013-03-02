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

	$.fn.webcam = function(options) {

		var webcam = {
			extern: null, // external select token to support jQuery dialogs
			append: true, // append object instead of overwriting

			width: 320,
			height: 240,

			mode: "callback", // callback | save | stream

			swffile: "jscam.swf",
			quality: 85,

			debug:		function () {},
			onCapture:  function () {},
			onTick:		function () {},
			onSave:		function () {},
			onLoad:		function () {}
		};

		if (typeof options === "object") {
			for (var ndx in webcam) {
				if (options[ndx] !== undefined) {
					webcam[ndx] = options[ndx];
				}
			}
		}

		var uniqid = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for( var i=0; i < 6; i++ ){
			uniqid += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		var webcam_id = "webcam" + uniqid,
			object_id = "XwebcamXobjectX" + uniqid;

		var source = '<object id="'+object_id+'" type="application/x-shockwave-flash" data="'+webcam.swffile+'" width="'+webcam.width+'" height="'+webcam.height+'"><param name="movie" value="'+webcam.swffile+'" /><param name="FlashVars" value="mode='+webcam.mode+'&amp;quality='+webcam.quality+'&amp;webcam='+webcam_id+'" /><param name="allowScriptAccess" value="always" /></object>';

		if (null !== webcam.extern) {
			$(webcam.extern)[webcam.append ? "append" : "html"](source);
		} else {
			this[webcam.append ? "append" : "html"](source);
		}

		(_register = function(run) {

			var cam = document.getElementById(object_id);

			if (cam.capture !== undefined) {
				/* Simple callback methods are not allowed :-/ */
				webcam.capture = function(x) {
					try {
					return cam.capture(x, webcam_id);
					} catch(e) {}
				};
				webcam.save = function(x) {
					try {
					return cam.save(x, webcam_id);
					} catch(e) {}
				};
				webcam.setCamera = function(x) {
					try {
					return cam.setCamera(x);
					} catch(e) {}
				};
				webcam.getCameraList = function() {
					try {
					return cam.getCameraList();
					} catch(e) {}
				};

				webcam.onLoad();
			} else if (0 == run) {
				webcam.debug("error", "Flash movie not yet registered!");
			} else {
				/* Flash interface not ready yet */
				window.setTimeout(_register, 1000 * (4 - run), run - 1);
			}
		})(3);

		window[webcam_id] = webcam;

		return window[webcam_id];
	};

})(jQuery);
