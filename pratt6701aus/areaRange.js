
const chart1 = (chartWeatherData)=>{

const requiredData = chartWeatherData.map((ele)=>{
  return {
    x:new Date(ele.startTime).getTime(),
    low: ele.values.temperatureMin,
    high:ele.values.temperatureMax
  }
})

  Highcharts.chart('arearangechart', {
    chart: {
      type: 'arearange'
    },
  
    title: {
      text: 'Temperature Ranges (Min,Max)'
    },
  
    legend:{
      enabled:false
    },
  
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        day: '%e %b'
      },
      title: {
        text: null
      },
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
  
    yAxis: {
      title: {
        text: null
      },
      labels: {
        style: {
          fontSize: '12px' 
        }
      }
    },
  
    tooltip: {
      crosshairs: true,
      shared: true,
      valueSuffix: '°F',
      xDateFormat: '%A, %b %e'
    },
  
    series: [{
      name: 'Temperatures',
      data: requiredData,
      lineColor: 'orange',
      fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1 
          },
          stops: [
            [0, 'rgba(255, 165, 0, 0.6)'],
            [1, 'rgba(135, 206, 250, 0.6)']
          ],
          lineWidth: 2
      },
      marker: {
        enabled: true,
        fillColor: 'rgb(78, 178, 255)',
      }
    }]
  });


}


const chart2=(hourlyData)=>{

  let temperature = hourlyData['intervals'].map((ele)=>{
      return {
          x: new Date(ele.startTime).getTime(),
          y:Number(ele.values.temperature.toFixed(0))
      }
  })

  let pressure = hourlyData['intervals'].map((ele)=>{
      return {
          x: new Date(ele.startTime).getTime(),
          y:ele.values.pressureSeaLevel
      }
  })

  let humidity = hourlyData['intervals'].map((ele)=>{
      return {
          x: new Date(ele.startTime).getTime(),
          y:Math.floor(ele.values.humidity)
      }
  })

  let windSpeedDirectionData = hourlyData['intervals'].map((ele)=>{
    return {
        x: new Date(ele.startTime).getTime(),
        value:Math.floor(ele.values.windSpeed),
        direction:Math.floor(ele.values.windDirection),
    }
  })

  Highcharts.chart('container-hourly', {
      chart: {
          marginBottom: 70,
          marginRight: 40,
          marginTop: 50,
          plotBorderWidth: 1,
          events: {
              load: function() {
                  const chart = this;
                  const xAxis = chart.xAxis[0];

                  for (
                      let pos = xAxis.min, max = xAxis.max, i = 0;
                      pos <= max + 36e5; pos += 36e5, i += 1
                  ) {
                      const isLast = pos === max + 36e5,
                          x = Math.round(xAxis.toPixels(pos)) + (isLast ? 0.5 : -0.5);

                      const isLong = this.resolution > 36e5 ?
                          pos % this.resolution === 0 :
                          i % 2 === 0;

                      chart.renderer
                          .path([
                              'M', x, chart.plotTop + chart.plotHeight + (isLong ? 0 : 28),
                              'L', x, chart.plotTop + chart.plotHeight + 32,
                              'Z'
                          ])
                          .attr({
                              stroke: chart.options.chart.plotBorderColor,
                              'stroke-width': 1
                          })
                          .add();
                  }

                  if (chart.get('windbarbs')) {
                      chart.get('windbarbs').markerGroup.attr({
                          translateX: chart.get('windbarbs').markerGroup.translateX + 3
                      });
                  }
              }
          }
      },
      title: {
          text: 'Hourly Weather (For next 5 days)',
      },
      
      xAxis: [{
              type: 'datetime',
              tickInterval: 8 * 36e5,
              minorTickInterval:  36e5,
              tickLength: 0,
              gridLineWidth: 1,
              gridLineColor: 'rgba(128, 128, 128, 0.5)',
              startOnTick: false,
              endOnTick: false,
              minPadding: 0,
              maxPadding: 0,
              offset: 35,
              showLastLabel: true,
              labels: {
                  format: '{value:%H}'
              },
              crosshair: true,
          },
          {
              linkedTo: 0,
              type: 'datetime',
              tickInterval: 24 * 3600 * 1000,
              labels: {
                  format: '{value:<span style="font-size: 12px; font-weight: ' +
                      'bold">%a</span> %b %e}',
                  align: 'left',
                  x: 3,
                  y: -3
              },
              opposite: true,
              tickLength: 20,
              gridLineWidth: 1,
              gridLineColor: 'rgba(255,255, 255, 0.1)',
      }],
      yAxis: [
          {
              title: {
                  text: null
              },
              labels: {
                  format: '{value}°',
                  style: {
                      fontSize: '10px'
                  },
                  x: -3
              },
              plotLines: [{
                  value: 0,
                  color: '#BBBBBB',
                  width: 1,
                  zIndex: 2
              }],
              gridLineColor: 'rgba(128, 128, 128, 0.1)',
              maxPadding: 0.3,
              tickInterval: 7,
              min:0,
          }, 

          //Humidity
          {
              title: {
                  text: null
              },
              labels: {
                  enabled: false
              },
              gridLineWidth: 0,
              tickLength: 0,
              tickInterval: 35,
              min: 0,
          },

          //Pressure
          {
              allowDecimals: false,
              title: { 
                  text: 'inHg',
                  offset: 0,
                  align: 'high',
                  rotation: 0,
                  style: {
                      fontSize: '10px',
                      color: 'orange'
                  },
                  textAlign: 'left',
                  x: 3
              },
              labels: {
                  style: {
                      fontSize: '8px',
                      color: 'orange'
                  },
                  y: 2,
                  x: 3
              },
              gridLineWidth: 0,
              opposite: true,
              showLastLabel: false,
          }
      ],

      plotOptions: {
          series: {
              pointPlacement: 'between'
          }
      },

      series: [
          // Temperature
          {
              name: 'Temperature',
              data: temperature,
              type: 'spline',
              marker: {
                  enabled: false,
                  states: {
                      hover: {
                          enabled: true
                      }
                  }
              },
              tooltip: {
                  pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                      ' ' +
                      '{series.name}: <b>{point.y}°F</b><br/>'
              },
              zIndex: 1,
              yAxis: 0,
              color: '#FF3333',
              negativeColor: '#48AFE8'
          },

          // Air pressure
          {
              type: 'spline',
              name: 'Air pressure',
              color: 'orange',
              data: pressure,
              marker: {
                  enabled: false,
                  symbol: 'circle',
                  states: {
                      hover: {
                          enabled: true,
                      }
                  },
              },
              shadow: false,
              tooltip: {
                  valueSuffix: ' inHg'
              },
              dashStyle: 'shortdot',
              yAxis: 2,
              zIndex: 1,  
          },

          // .... Humidity ...
          {
              name: 'Humidity',
              data: humidity,
              type: 'column',
              color: 'rgb(135,206,255)',
              yAxis: 1,
              groupPadding: 0,
              pointPadding: 0,
              grouping: false,
              dataLabels: {
                  enabled: true,
                  format: '{y}',
                  verticalAlign: 'bottom'  ,
                  style: {
                      fontSize: '10px',
                      fontWeight: '900',
                      color: 'gray',
                      textOutline: '2px black'
                  }
              },
              tooltip: {
                  valueSuffix: '%'
              }
          },

          // ..... Wind ....
          {
              name: 'Wind',
              type: 'windbarb',
              id: 'windbarbs',
              color: Highcharts.getOptions().colors[1],
              lineWidth: 2,
              data: windSpeedDirectionData,
              vectorLength: 10,
              tooltip: {
                  valueSuffix: ' mph'
              }
          }
      ],

      tooltip: {
          shared: true
      },
      
      legend:{
          enabled:false
      }
  });

}
