$(function () {
	$('.navmenu-h').wrap('<div class="collapse navbar-collapse" id="navbar-1"></div>');
	/*$('.main-nav.navbar').prepend('<div class="navbar-header"><button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-1"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a class="navbar-brand hidden-lg hidden-md hidden-sm" href="#">Menu</a></div>');*/
	$('.main-nav.navbar').prepend('<div class="navbar-header"><button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-1"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a class="navbar-brand hidden-lg hidden-md hidden-sm" href="https://www.setena.go.cr/es/Inicio"><p class="logo-hamburguesa"><img src="/Downloads/Logo/logo-menu.png" alt="" width="320" height="92"></p></a></div>');

	$('.thumbnails').waitForImages(function() {
		$('.thumbnails img').each(function() {
			$(this).addClass(this.width > this.height ? 'landscape' : 'portrait').fadeTo("slow", 1);
		});
	});
	
	$('.thumbnails-news').waitForImages(function() {
		$('.thumbnails-news img').each(function() {
			$(this).addClass(this.width > this.height ? 'landscape' : 'portrait').fadeTo("slow", 1);
		});
	});
	
	$('.social-likes-tips').socialLikes({    				
		counters: true
	});
	
	$('#zoom-product').zoom();
	
	$("form input[id*=238_Name3]").wrap('<div id="sandbox-container"></div>');
	$("form input[id*=238_Name4]").wrap('<div id="sandbox-container"></div>');
	
	$('#sandbox-container input').datepicker({					
	});
	
	$("#owl-demo").owlCarousel({
		pagination: false,
		navigation: true,
		navigationText: [
			"<span class='glyphicon glyphicon-chevron-left icon-white' aria-hidden='true'></span>",
			"<span class='glyphicon glyphicon-chevron-right icon-white' aria-hidden='true'></span>"
		]
	});

	$(".royalSliderCT").royalSlider({
		autoPlay: {
			enabled: true,
			pauseOnHover: true,
			delay: 3000
		},
		fullscreen: {
			enabled: true,
			nativeFS: true
		},
		controlNavigation: 'none',
		autoScaleSlider: true,  
		autoScaleSliderWidth: '900',
		autoScaleSliderHeight: '500',
		loop: true,
		imageScaleMode: 'fit',
		imageScalePadding: 0, 
		navigateByClick: true,
		numImagesToPreload: 3,
		arrowsNavAutoHide: true,
		arrowsNavHideOnTouch: true,
		keyboardNavEnabled: true,
		fadeinLoadedSlide: true,
		globalCaption: false,
		globalCaptionInside: false,
		thumbs: {
			firstMargin: true,
			paddingBottom: 0,
			spacing: 0
		},		
		thumbsFitInViewport: false,
		transitionType: 'move',
		socialSharing: true
	}); 
});