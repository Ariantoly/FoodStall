// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Month');
    data.addColumn('number', 'Form Terjual');
    data.addColumn('number', 'Pendaftar');
    data.addColumn('number', 'Peserta Test Masuk');
    data.addColumn('number', 'Peserta Lulus');
    data.addColumn('number', 'Peserta Daftar Ulang');
    data.addRows([
      ['Jan', 400,300,300,200,150],
      ['Feb', 420,400,350,200,200],
      ['Mar', 450,130,300,200,150],
      ['Apr', 470,200,350,200,200],
      ['May', 420,230,300,200,180],
      ['Jun', 440,310,350,200,150],
      ['Jul', 430,320,200,200,200]
    ]);

    var options = {
                   'width':635,
                   'height':265,
                   'background.stroke':'#c6c6c6',
                   'colors':['#d3361b','#f4b000','#a8ce44','#1b5cd3','#b71bd3'],
                   'fontName':'Interstate Light',
                   'legend':{position: 'none'},
                    'chartArea':{left:35,top:10,width:600,height:210},
                    'backgroundColor':'#F6F6F6',
                    'hAxis':{baselineColor: '#c6c6c6',textStyle:{color:'#666666'}}
               };

    var chart = new google.visualization.LineChart(document.getElementById('student-regis-graph'));
    
    data = google.visualization.arrayToDataTable([
        ['Month', 'Point',  'KPI'],
        ['Jan',  165, 614.6],
        ['Feb',  135, 682],
        ['Mar',  157, 623],
        ['Apr',  139, 609.4],
        ['May',  136, 569.6]
      ]);
    chart.draw(data, options);
    options = {
                   'width':655,
                   'height':265,
                   'background.stroke':'#c6c6c6',
                   'colors':['#477bda','#ff6f1c'],
                   'fontName':'Interstate Light',
                   'legend':{position: 'none'},
                    'chartArea':{left:35,top:10,width:600,height:210},
                    'backgroundColor':'#F6F6F6',
                    'hAxis':{baselineColor: '#c6c6c6',textStyle:{color:'#666666'}},
                    'seriesType': "bars",
                    'series': {0: {type: "line"}}
               };

    chart = new google.visualization.ComboChart(document.getElementById('regist-by-program-chart'));
    chart.draw(data, options);
}