// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

var schoolYear = [];
var BMI = [];
function searchStudent() {
  var typedID = document.getElementById("idNum").value;
  
  $.post("/getBMI", {idNum: typedID}, function(data){
    var i;
      //if(typedID.isEmpty()){
          // TO DO: display error message if walang ininput na id number si user
      //}

    for(i = 0; i < data.length; i++){
      schoolYear.push(data[i].schoolYear);
      BMI.push(parseFloat(data[i].bmi));
      //console.log(data[i].bmi);
    }
    
    growthChart(schoolYear, BMI);
  });
}

function growthChart(schoolYear, BMI){
// Area Chart Example
  var ctx = document.getElementById("myAreaChart");
  var myLineChart = new Chart(ctx, {  // line chart
    type: 'line',
    data: {
      labels: schoolYear, // x-axis
      datasets: [{
        label: "BMI",
        lineTension: 0.3,
        backgroundColor: "rgba(78, 115, 223, 0.05)",
        borderColor: "rgba(78, 115, 223, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(78, 115, 223, 1)",
        pointBorderColor: "rgba(78, 115, 223, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
        pointHoverBorderColor: "rgba(78, 115, 223, 1)",
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: BMI,
      }],
    },
    plugins: [ChartDataLabels],
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 25,
          top: 25,
          bottom: 0
        }
      },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'top',
          formatter: Math.round,
          font: {
            weight: 'bold'
          }
        },
        title: {
          display: true,
          text: 'Growth Chart by BMI per School'
        }
      },
      scales: {
        x: {
          title: {
              display: true,
              text: 'School Year'
          }
        },
        y: {
            title: {
                display: true,
                text: 'BMI'
            }
        }
      },
      legend: {
        display: false
      }
    }
  });
}



