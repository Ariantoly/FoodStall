function get_application_url()
{
	var getUrl = window.location;
	
	if(getUrl.pathname.split('/')[1] == 'malang' || getUrl.pathname.split('/')[1] == 'bandung')
		return getUrl .protocol + "//" + getUrl.host + "/binusmayaoffline/" + getUrl.pathname.split('/')[1];
	else
		return getUrl .protocol + "//" + getUrl.host + "/binusmayaoffline";
}

var BMC = {
	instId : '01',
	baseUri: get_application_url()+'/',
	loginUri: get_application_url()+'/login.html',
	logoutUri: get_application_url()+'/services/ci/index.php/login/logout',
	imageUri: get_application_url()+'/asset/images/',
	serviceUri: get_application_url()+'/services/ci/index.php/',
	uploadUri: get_application_url()+'/useruploads/',
	uploadGLSUri: get_application_url()+'/gls/useruploads/',
	months: ['','January','February','March','April','May','June','July','August','September','October','November','December'],
	shortMonths: ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
	downloadThesisUri: 'https://newcontent.binus.ac.id/studentthesis/',
	downloadCenterUri: 'https://newcontent.binus.ac.id/data_content/thesis_files/',
	newcontent: 'https://newcontent.binus.ac.id/Testing/'
	
}
jQuery.extend(BM, BMC);