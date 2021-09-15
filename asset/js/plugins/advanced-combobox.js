(function($) {

	$.fn.binus_advanced_combobox = function() {

		return $(this).each(function($index, $object) {
			if ($($object).data('has-init') == 'yes'){
				$($object).find('select').trigger("chosen:updated");
				return;
			}

			$($object).find('select').chosen();
			$($object).find('select').trigger("chosen:updated");
			$($object).data('has-init', 'yes');
		});

	};

})(jQuery);