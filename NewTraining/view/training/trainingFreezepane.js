var sv;
var subView = {
	title: 'Freezepane - Binusmaya',
	require: 'training',
	rel: 'trainingWrapper',
	data: [],
	onLoaded: function () {

		window.document.title = this.title;
		sv = this;

		$('.body-navigation ul li').removeClass('current');
		$('#nav-freezepane').addClass('current');

		training.setBreadcrumb(['Training', 'Freezepane']);

		sv.loadTables();
	},

	loadTables: function () {

		BM.ajax({
			url: BM.serviceUri + "training/test",
			type: "GET",
			success: function (data) {
				for (var i = 0; i < data.length; i++) {
					var template = $('.loopTemplate', '#tblTemplate')
						.clone()
						.removeClass('loopTemplate')
						.addClass('training-item')
						.data("training", data[i])
						.show();

					$('.iNo', template).text(data[i].AssignmentID);
					$('.iName', template).text(data[i].AssignmentName);
					$('#tblTraining tbody').append(template);
				}

				$('table#tblTraining tr.training-item i.has-tooltip').binus_tooltip();

				$('#headTableTraining').binus_freeze_pane({
					fixed_left: 1,
					collapse: true,
					scorllX: false
				});
			},
			error: function (err) {
				console.log(err);
			}
		});
	},
};	