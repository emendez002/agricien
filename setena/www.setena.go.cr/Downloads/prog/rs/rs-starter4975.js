
	$(function () {
		var $galleryElements = $('.tw-gallery');

		$.each($galleryElements, function () {
			var $galleryElement = $(this),
				galleryXml = "/GalleryConfig/" + $(this).attr("tw-gallery-file"),
				galleryConfig = "/gallery/rs/" + $galleryElement.attr("tw-param-file"),
				galleryWidth = $galleryElement.attr('tw-gallery-w'),
				galleryHeight = $galleryElement.attr('tw-gallery-h');
				
			$galleryElement.addClass('royalSlider');
			$.when($.ajax(galleryXml), $.getJSON(galleryConfig)).then(function (galleryXml, galleryConfig) {

				var imageAnchors = '';
				var $item = null;

				$.each($('img', galleryXml[0]), function () {
					$item = $(this);                
					imageAnchors += '<a class="rsImg" href="' + this.src + '" alt="' + $item.attr('title') + '" />';				
				});            

				galleryConfig = galleryConfig[0];
				
				if (galleryConfig.themes) {
					var themes = galleryConfig.themes.split(' ');

					if ($.isArray(themes)) {
						for (var i = 0; i < themes.length; i++) {
							$galleryElement.addClass(themes[i]);
						}
						
					} else {
						$galleryElement.addClass(themes);
					}
				}
				
				galleryConfig.slides = imageAnchors;
				if(!galleryConfig.autoScaleSliderWidth && galleryWidth) {
					galleryConfig.autoScaleSliderWidth = galleryWidth;
				}
				
				if(!galleryConfig.autoScaleSliderHeight && galleryHeight) {
					galleryConfig.autoScaleSliderHeight = galleryHeight;
				}
				
				 $galleryElement.royalSlider(galleryConfig);						
			});
		});
	}());
