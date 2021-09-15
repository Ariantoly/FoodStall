(function($) {

	var $container;

	function __perfect_layout() {

		var $window = $(window);

		$container.height($window.height());

		/* centering login screen */
		var $obj = $('.login');
		var $height = $obj.height();

		$obj.css('margin-top', '-' + ($height / 2) + 'px');
	}

	$(document).ready(function() {

		$container = $('#page');

		$(window).load(__perfect_layout).resize(__perfect_layout);

	});

})(jQuery);