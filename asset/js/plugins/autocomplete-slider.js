/*
 * Created by	: Hengky Chandra
 * Date 		: 12-01-2016
 * Description	: AutoComplete berupa slider
 */

(function($) {

	$.fn.binus_autocomplete_slider = function(options) {
		
		return $(this).each(function($index, $object) {
			if ($(this).data('has-init') == 'yes')
				return;
			__create_element(this);
		});

		function __create_element($element) {
			
			var $object = $($element);

			$object.on('click', '.item-wrap > .head', function($e) {
				$e.preventDefault();

				var $obj    = $(this);
				var $parent = $obj.parent();

				if ($parent.hasClass('current')) {
					$parent.find('.body').stop().slideUp('medium', function() {
						$parent.removeClass('current');
					});
				} else {
					$parent.find('.body').stop().slideDown('medium', function() {
						$parent.addClass('current');
						if(options.url != "")
						{
							$val = $.getScript('view/' + options.url + '.js', function() {
								$.get('view/' + options.url + '.html', function(data) {
									$parent.find('.body').html(data);
									if (typeof autocompleteView == "object") {
										autocompleteView.onLoaded();
									}
								}, 'html');
							});
						}
					});
				}
			});

			$object.on('click', '.select', function() {
				var $parent = $object.find('.item-wrap');
				
				$object.find('.body').stop().slideUp('medium', function() {
					$parent.removeClass('current');
				});
				
				$.isFunction( options.onSelect ) && options.onSelect.call( this );
			});

			$object.data('has-init', 'yes');
		}
	};

})(jQuery);
