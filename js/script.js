var TILT_LIMIT = 30;
var initialBeta;
var controlTypes = ['FULLTILT DeviceOrientation', 'Raw DeviceOrientation'];
var currentControlType = 0;

$(function() {
	// jQuery Selections
	var $html = $('html'),
		$container = $('#ad-viewport');

	// // Hide browser menu.
	// (function() {
	// 	setTimeout(function(){window.scrollTo(0,0);},0);
	// })();

	setTimeout(function() {
		$('.indicate-move__text').fadeIn(100);
	}, 2000);

	// Setup FastClick.
	FastClick.attach(document.body);

	// Add touch functionality.
	if (Hammer.HAS_TOUCHEVENTS) {
		$container.hammer({drag_lock_to_axis: true});
		_.tap($html, 'a,button,[data-tap]');
	}

	// Add touch or mouse class to html element.
	$html.addClass(Hammer.HAS_TOUCHEVENTS ? 'touch' : 'mouse');

	// // Resize handler.
	(resize = function() {
		$.each($('.screen__block>ul'), function(i,v) {
			v.style.width = window.innerWidth + 'px';
			v.style.height = window.innerHeight + 'px';
		})
	})();

	// Attach window listeners.
	window.onresize = _.debounce(resize, 200);
	window.onscroll = _.debounce(resize, 200);

	$('.screen__block>ul>li').addClass('layer');
	// $('.screen__block>ul').parallax();

	$.each($('.screen__block>ul'), function(i,v) {
		new Parallax(v, {
			invertX: true
		});
	});
	$('.button_test_api').click(function(e) {
		e.preventDefault();
		e.stopPropagation();
		DeviceOrientationEvent.requestPermission().then(function(result) {
			if (result == 'granted') {
				$('.button_test_api').hide(300);
			}
		});
	})

	

	function setResult(result) {

	}

	if (!window.DeviceOrientationEvent) {

	} else {
		testDeviceOrientation();
		var deltaFixX = null;
		var x1 = 0;
		window.addEventListener('deviceorientation', function(event) {
			detected = true;
			
			if (detected) {
				$('.button_test_api').hide(300);

				var promise = FULLTILT.getDeviceOrientation({ 'type': 'game' });

				promise.then(function(orientationControl) {

					orientationControl.listen(function() {

						var euler;
						
						switch (currentControlType) {
							case 1:
								euler = orientationControl.getLastRawEventData();
								break;
							default:
								euler = orientationControl.getScreenAdjustedEuler();
						}
						if (euler.beta > 85 && euler.beta < 95) {
							return;
						}
						var tiltX = euler.gamma*-1;
						// $('#debug').html(tiltX+'<br>'+$('#debug').html().substr(0,100));
						var thresholdX=40;
						var deltaX=tiltX;
						if (deltaFixX==null) {
							deltaFixX=tiltX-thresholdX/2;
						}
						x = (deltaX - deltaFixX)/thresholdX;
						if (x > 1) {
							 x = 1;
							 deltaFixX = deltaX-thresholdX;
						}
						if (x < 0) {
							 x = 0;
							 deltaFixX = deltaX;
						}
						x=1-x;
						x=Math.round(x*100)/100;
						if (Math.abs(x1-x)>0.025) {
							$('.screen').css({transform: 'translate3d(' + 66*(x-0.5) + '%,0,0)'})
							// $('#debug').html(Math.round(tiltX*100)/100+' '+Math.round(x*100)/100+'<br>'+$('#debug').html().substr(0,100));
							x1=x;
						}
						// if(-15<tiltX && tiltX<15) {
							// $('#debug').html(x+'<br>'+$('#debug').html().substr(0,100));
							// var $panorama=$('#ad-viewport');
							// var $panorama_img=$panorama.find('.screen');
							// var pan_width=$panorama.outerWidth();
							// var img_width=$panorama_img.outerWidth();
							// var pos=x*(pan_width - img_width);
						//	 // TweenMax.to($panorama_img, 1.5, {
						//	 //	 x: pos,
						//	 // });
							// $('.screen').css({transform: 'translate3d(0%,0,0) translateX(-50%)'});
							// $('#debug').html(x+' '+'<br>'+$('#debug').html().substr(0,100));
							// x1=x;
						// } else if(-90<tiltX && tiltX<-30) {
						// 	$('.screen').css({transform: 'translate3d(33.3333%,0,0) translateX(-50%)'});
						// } else if(30<tiltX && tiltX<90) {
						// 	$('.screen').css({transform: 'translate3d(-33.3333%,0,0) translateX(-50%)'});
						// }
						// else if(60<tiltX) {
						//	 $('.screen').css({transform: 'translate3d(-33.3333%,0,0) translateX(-50%)'});
						// }

					});
				});
			}
		});

	}

	var vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${vh}px`);
	window.addEventListener('resize', function() {
		var vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
	});
});