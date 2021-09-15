var psv;
var popupSubView = {
    onLoaded: function () {
        psv = this;

        $.when(psv.loadCampus()).
        then(function() {
            $.when(psv.loadPayment()).
            then(function(){
                psv.loadFoodStallDetail();
            })
        })
    },
    loadFoodStallDetail: function () {
        return BM.ajax({
            url: BM.serviceUri + "foodStall/getFoodStallDetail",
            type: "GET",
            data: {
                FoodStallID: sv.foodStallID
            },
            success: function (response) {
                let foodStall = response[0];
                $('#txtName').val(foodStall.FoodStallName);
                $('#txtDescription').val(foodStall.FoodStallDescription);

                $('#ddlCampus').val(foodStall.CampusID);
                $('#ddlCampus').trigger('chosen:updated');
                $('#ddlPayment').val(foodStall.PaymentID);
                $('#ddlPayment').trigger('chosen:updated');
            },
            error: function () {
                alert('Error loading food stall!');
            }
        })
    },
    loadPayment: function(){
        return BM.ajax({
            url: BM.serviceUri + "foodStall/getPayment",
			type: "GET",
			success: function(response) {
				response.forEach(element => {
                    $('#ddlPayment').append(`<option value="${element.PaymentID}">${element.PaymentName}</option>`)
                    
                    $('#ddlPayment').trigger('chosen:updated');
				})
			},
			error: function() {
				alert('Error loading payment!')
			}
        });
    },
    loadCampus: function() {
		return BM.ajax({
            url: BM.serviceUri + "foodStall/getCampus",
			type: "GET",
			success: function(response) {
				response.forEach(element => {
                    $('#ddlCampus').append(`<option value="${element.CampusID}">${element.CampusName}</option>`)
                    
                    $('#ddlCampus').trigger('chosen:updated');
				})
			},
			error: function() {
				alert('Error loading campus!')
			}
		});
    },
}