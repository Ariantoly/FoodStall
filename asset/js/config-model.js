var BMC = {
	instId : '01',
	baseUri: 'http://localhost:8088/BM5/',
	loginUri: 'http://localhost:8088/login.html',
	logoutUri: 'http://localhost:8088/BM5/services/ci/index.php/login/logout',
	imageUri: 'http://localhost:8088/staff/images/',
	serviceUri: 'http://localhost:8088/BM5/services/ci/index.php/',
	newuploadUri: 'https://newcontent.binus.ac.id/testing/',
	uploadUri: 'http://localhost:8088/useruploads/',
	months: ['','January','February','March','April','May','June','July','August','September','October','November','December'],
	shortMonths: ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
}
jQuery.extend(BM, BMC);