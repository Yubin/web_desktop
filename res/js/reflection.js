/*!
	reflection.js for jQuery v1.11
	(c) 2006-2013 Christophe Beyls <http://www.digitalia.be>
	MIT-style license.
*/

(function($) {

$.fn.extend({
	reflect: function(options) {
		options = $.extend({
			length: 1/3,
			opacity: 0.5,
			margin_top: 0
		}, options);

			var img = this;
			if (/^img$/i.test(img.tagName)) {
				function doReflect() {
					var imageWidth = options.width  ? options.width: img.width,
						imageHeight  = options.height ? options.height: img.height,
						reflection,
						reflectionHeight,
						margin_top = options.margin_top,
						wrapper,
						context,
						gradient;
					reflectionHeight = Math.floor((options.length > 1) ? Math.min(imageHeight, options.length) : imageHeight * options.length);

					reflection = $("<canvas />")[0];
					debugger;
					if (reflection.getContext) {
						context = reflection.getContext("2d");
						try {
							$(reflection).attr({width: imageWidth, height: reflectionHeight + margin_top});
							if (margin_top) {
								$(reflection).css('margin-top', margin_top);
							}
							context.save();
							context.translate(0, imageHeight-1);
							context.scale(1, -1);
							context.drawImage(img, 0, 0, imageWidth, imageHeight);
							context.restore();
							context.globalCompositeOperation = "destination-out";

							gradient = context.createLinearGradient(0, 0, 0, reflectionHeight);
							gradient.addColorStop(0, "rgba(255, 255, 255, " + (1 - options.opacity) + ")");
							gradient.addColorStop(1, "rgba(255, 255, 255, 1.0)");
							context.fillStyle = gradient;
							context.rect(0, 0, imageWidth, reflectionHeight);
							context.fill();
						} catch(e) {
							return;
						}
					} else {
						if (!window.ActiveXObject) return;
						reflection = $("<img />").attr("src", img.src).css({
							width: imageWidth,
							height: imageHeight,
							marginBottom: reflectionHeight - imageHeight,
							filter: "FlipV progid:DXImageTransform.Microsoft.Alpha(Opacity=" + (options.opacity * 100) + ", FinishOpacity=0, Style=1, StartX=0, StartY=0, FinishX=0, FinishY=" + (reflectionHeight / imageHeight * 100) + ")"
						})[0];
					}
					$(reflection).css({display: "block", border: 0});

					wrapper = $(/^a$/i.test(img.parentNode.tagName) ? "<span />" : "<div />").insertAfter(img).append([img, reflection])[0];
					wrapper.className = img.className;
					$.data(img, "reflected", wrapper.style.cssText = img.style.cssText);
					$(wrapper).css({width: imageWidth, height: imageHeight + reflectionHeight + margin_top, overflow: "hidden"});
					img.style.cssText = "display: block; border: 0px";
					img.className = "reflected";
				}

				if (img.complete) doReflect();
				else $(img).load(doReflect);
			}
	},

	unreflect: function() {
		return this.unbind("load").each(function() {
			var img = this, reflected = $.data(this, "reflected"), wrapper;

			if (reflected !== undefined) {
				wrapper = img.parentNode;
				img.className = wrapper.className;
				img.style.cssText = reflected;
				$.removeData(img, "reflected");
				wrapper.parentNode.replaceChild(img, wrapper);
			}
		});
	}
});

})(jQuery);
