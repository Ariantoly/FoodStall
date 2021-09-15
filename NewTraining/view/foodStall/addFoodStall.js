var sv;
var subView = {
	title : 'Add Food Stall - Binusmaya',
	require : 'foodStall',
	rel : 'trainingWrapper',
	onLoaded : function(){
		
		window.document.title = this.title;
        sv = this;

        $('.custom-chosen').binus_advanced_combobox();
        sv.loadPayment();
        sv.loadCampus();
        sv.handleSubmitFoodStall();

    },
    loadPayment: function(){
        BM.ajax({
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
		BM.ajax({
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
        $('#form-add-foodStall').submit(function(event) {
            event.preventDefault();

            if($('#ddlPayment').val() == -1) {
                alert('Please select the payment!');
                return;
            }

            if($('#ddlCampus').val() == -1) {
                alert('Please select the campus!');
                return;
            }

            let data = $('#form-add-foodStall').serializeJSON();

            let formData = new FormData();

            formData.append('foodStall', JSON.stringify(data));
            
            BM.ajax({
                url: BM.serviceUri + "foodStall/insertFoodStall",
                type: "POST",
                data: formData,
                contentType: false,
                processData: false,
                success: function(response) {
                    if(response[0].Success == 1) {
                        $('.has-success').show();

                        $('#form-add-foodStall input[type="text"]').val('');
                        $('#ddlPayment').val(-1);
                        $('#ddlPayment').trigger('chosen:updated');
                        $('#ddlCampus').val(-1);
                        $('#ddlCampus').trigger('chosen:updated');
                    }
                },
                error: function() {
                    alert('Error adding food stall!')
                }
            })
        })
    }
}