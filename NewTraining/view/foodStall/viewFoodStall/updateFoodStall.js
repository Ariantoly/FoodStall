var psv;
var popupSubView = {
    campusID: 0,
    onLoaded: function () {
        psv = this;

        $.when(psv.loadCampus()).
        then(function() {
            $.when(psv.loadPayment()).
            then(function(){
                psv.loadFoodStallDetail();
            })
        })

        psv.handleSubmitFoodStall();
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
                psv.campusID = foodStall.CampusID;
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
    handleSubmitFoodStall: function() {
        $('#form-update-foodStall').submit(function(event) {
            event.preventDefault();

            if($('#ddlPayment').val() == -1) {
                alert('Please select the payment!');
                return;
            }

            if($('#ddlCampus').val() == -1) {
                alert('Please select the campus!');
                return;
            }

            let data = $('#form-update-foodStall').serializeJSON();
            data.foodStallID = sv.foodStallID;

            let formData = new FormData();

            formData.append('foodStall', JSON.stringify(data));
            
            BM.ajax({
                url: BM.serviceUri + "foodStall/updateFoodStall",
                type: "POST",
                data: formData,
                contentType: false,
                processData: false,
                success: function(response) {
                    if(response[0].Success == 1) {
                        $('.has-success').show();
                        sv.loadFoodStall(psv.campusID);
                    }
                },
                error: function() {
                    alert('Error updating food stall!')
                }
            })
        })
    }
}