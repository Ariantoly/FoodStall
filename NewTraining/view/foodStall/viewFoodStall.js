var sv;
var subView = {
	title: 'View Food Stall - Binusmaya',
	require: 'foodStall',
	rel: 'trainingWrapper',
	foodStallID: 0,
	onLoaded: function () {

		window.document.title = this.title;
		sv = this;

		$('.tabulation').binus_tabulation();

		sv.loadCampus();
		sv.handleTabChange();
	},
	loadCampus: function () {
		BM.ajax({
			url: BM.serviceUri + "foodStall/getCampus",
			type: "GET",
			success: function (response) {
				response.forEach(element => {
					let listCampus = $('<li></li>');
					listCampus.append(`<a href="#" campus-id="${element.CampusID}">${element.CampusName}</a>`);
					listCampus.addClass('tab-head-item');
					$('#list-campus').append(listCampus);

					let tabBodyItem = $('.item-template').clone().removeClass('item-template').addClass(`foodStall-body-${element.CampusID}`);
					tabBodyItem.prepend(`<h1>${element.CampusName}</h1>`);
					$('.tab-body').append(tabBodyItem);
				})

				$('.tab-head-item a').first().click()
			},
			error: function () {
				alert('Error loading campus!')
			}
		});
	},
	handleTabChange: function () {
		$('.tab-head').on('click', '.tab-head-item', function (event) {
			let CampusID = $(event.target).attr('campus-id');
			sv.loadFoodStall(CampusID);
		});
	},
	loadFoodStall: function (CampusID) {
		let table = $(`.foodStall-body-${CampusID} table`);

		table.DataTable();

		BM.ajax({
			url: BM.serviceUri + "foodStall/getFoodStall",
			type: "GET",
			data: {
				CampusID: CampusID
			},
			success: function (response) {

				table.dataTable().fnClearTable();
				table.dataTable().fnDestroy();

				table.find('.foodStall-row-item').remove();
				response.forEach((foodStall, index) => {
					let foodStallItem = $('.foodStall-template').clone().removeClass('foodStall-template').addClass('foodStall-row-item').show();

					foodStallItem.find('.no').text(index + 1);
					foodStallItem.find('.name').text(foodStall.FoodStallName);

					foodStallItem.find('.has-tooltip').binus_tooltip();

					foodStallItem.find('.view').click(function(event) {
						sv.foodStallID = foodStall.FoodStallID;
					})

					foodStallItem.find('.edit').click(function(event) {
						sv.foodStallID = foodStall.FoodStallID;
					})

					foodStallItem.find('.delete').click(function (event) {
						let formData = new FormData();
						formData.append('FoodStallID', foodStall.FoodStallID);
						BM.ajax({
							url: BM.serviceUri + "foodStall/deleteFoodStall",
							type: "POST",
							data: formData,
							contentType: false,
							processData: false,
							success: function (response) {
								if (response[0].Success == 1) {
									alert('Delete Success!')
									sv.loadFoodStall(CampusID);
								}
							},
							error: function () {
								alert('Error deleting food stall')
							}
						})
					})

					table.find('tbody').append(foodStallItem);
				})

				table.DataTable();

			},
			error: function () {
				alert('Error loading food stall!');
			}
		})
	},
};