var sv;
var subView = {
    title: 'Training',
    require: 'Training',
    rel: 'TrainingContent',
    onLoaded: function(){
        sv = this;

        Training.setBreadcrumb(['Training', 'CSS & JQuery']);
    }
}