let weatherSymbolCode = {
    "4201":{img:"./Images/Symbols/rain_heavy.svg",title:"Heavy Rain"},
    "4001":{img:"./Images/Symbols/rain.svg",title:"Rain"},
    "4200":{img:"./Images/Symbols/rain_light.svg",title:"Light Rain"},
    "6201":{img:"./Images/Symbols/freezing_rain_heavy.svg",title:"Heavy Freezing Rain"},
    "6001":{img:"./Images/Symbols/freezing_rain.svg",title:"Freezing Rain"},
    "6200":{img:"./Images/Symbols/freezing_rain_light.svg",title:"Light Freezing Rain"},
    "6000":{img:"./Images/Symbols/freezing_drizzle.svg",title:"Freezing Drizzle"},
    "4000":{img:"./Images/Symbols/drizzle.svg",title:"Drizzle"},
    "7101":{img:"./Images/Symbols/ice_pellets_heavy.svg",title:"Heavy Ice Pellets"},
    "7000":{img:"./Images/Symbols/ice_pellets.svg",title:"Ice Pellets"},
    "7102":{img:"./Images/Symbols/ice_pellets_light.svg",title:"Light Ice Pellets"},
    "5101":{img:"./Images/Symbols/snow_heavy.svg",title:"Heavy Snow"},
    "5000":{img:"./Images/Symbols/snow.svg",title:"Snow"},
    "5100":{img:"./Images/Symbols/snow_light.svg",title:"Light Snow"},
    "5001":{img:"./Images/Symbols/flurries.svg",title:"Flurries"},
    "8000":{img:"./Images/Symbols/tstorm.svg",title:"Thunderstrom"},
    "2100":{img:"./Images/Symbols/fog_light.svg",title:"Light Fog"},
    "2000":{img:"./Images/Symbols/fog.svg",title:"Fog"},
    "1001":{img:"./Images/Symbols/cloudy.svg",title:"Cloudy"},
    "1102":{img:"./Images/Symbols/mostly_cloudy.svg",title:"Mostly Cloudy"},
    "1101":{img:"./Images/Symbols/partly_cloudy_day.svg",title:"Partly Cloudy"},
    "1100":{img:"./Images/Symbols/mostly_clear_day.svg",title:"Mostly Clear"},
    "1000":{img:"./Images/Symbols/clear_day.svg",title:"Clear"}
}

const formatDate=(dt)=>{
    let date = new Date(dt);
    const format = {
        weekday: 'long',
        year: 'numeric',
        day: 'numeric',
        month: 'short'
    };
    let formattedDate = date.toLocaleDateString('en-US', format);
    let [weekday, month, day, year] = formattedDate.replace(/,/g,'').split(" ");
    return `${weekday}, ${day} ${month} ${year}`
}

function createWeatherCard(weatherData,addr) {
    let node = document.createElement('div')
    node.setAttribute('id','first-card')
    node.innerHTML=`<div class="first-card-container">
                <div class="first-card-address">
                    ${addr}
                </div>
                <div class="first-card-weather">
                    <div class="first-card-image"> 
                        <div>      
                            <img alt="" src=${weatherSymbolCode[String(weatherData.values.weatherCode)].img} class="weather-code-image-head">
                            <div class="image-title">
                                ${weatherSymbolCode[String(weatherData.values.weatherCode)].title}
                            </div>
                        </div>
                    </div>
                    <div class="first-card-weather-value">
                        ${weatherData.values.temperature.toFixed(1)}&deg;
                    </div>
                </div>
                <div class="first-card-other">
                    <div class="first-card-humidity">
                        <div>
                            Humidity
                        </div>
                        <div>
                            <img alt="" src="./Images/humidity.png" class="first-card-images"/>
                        </div>
                        <div>
                            ${weatherData.values.humidity}%
                        </div>
                    </div>
                    <div class="first-card-pressure">
                        <div>
                            Pressure
                        </div>
                        <div>
                            <img alt="" src="./Images/Pressure.png" class="first-card-images"/>
                        </div>
                        <div>
                            ${weatherData.values.pressureSeaLevel}inHg
                        </div>
                    </div>
                    <div class="first-card-wind">
                        <div>
                            Wind Speed
                        </div>
                        <div>
                            <img alt="" src="./Images/Wind_Speed.png" class="first-card-images"/>
                        </div>
                        <div>
                             ${weatherData.values.windSpeed}mph
                        </div>
                    </div>
                    <div class="first-card-visibility">
                        <div>
                            Visibility
                        </div>
                        <div>
                            <img alt="" src="./Images/Visibility.png" class="first-card-images"/>
                        </div>
                        <div>
                             ${weatherData.values.visibility}mi
                        </div>
                    </div>
                    <div class="first-card-cloud">
                        <div>
                            Cloud Cover
                        </div>
                        <div>
                            <img alt="" src="./Images/Cloud_Cover.png" class="first-card-images"/>
                        </div>
                        <div>
                             ${weatherData.values.cloudCover}%
                        </div>
                    </div>
                    <div class="first-card-uv">
                        <div>
                            UV Level
                        </div>
                        <div>
                            <img alt="" src="./Images/UV_Level.png" class="first-card-images"/>
                        </div>
                        <div>
                             ${weatherData.values.uvIndex}
                        </div>
                    </div>
                </div>
            </div>
    `
    document.body.appendChild(node)
}

function createWeatherTable(intervals){
    let node = document.createElement('div')
    node.setAttribute('id','table-card-1')
    node.innerHTML = `
        <div class="table-head-1">
            <div class="column-1">
                <div class="date-1">
                    Date
                </div>
                <div class="status-1">
                    Status
                </div>
            </div>
            <div class="column-2">
                <div class="temp-high">
                    Temp High
                </div>
                <div class="temp-low">
                    Temp Low
                </div>
                <div class="wind-speed-1">
                    Wind Speeds
                </div>
            </div>
        </div>
    `
    intervals.forEach((interval,index)=>{

        let date = formatDate(interval.startTime)

        let child = document.createElement('div')
        child.setAttribute('class','table-data-1')
        child.addEventListener('click', ()=>dailyWeather(index));

        child.innerHTML = `
            <div class="column-1">
                <div class="date-1">
                   ${date}
                </div>
                <div class="status-1">
                    <img src=${weatherSymbolCode[String(interval.values.weatherCode)].img} class="table-status"/> 
                    <span style="margin-left: 0.5rem;">${weatherSymbolCode[String(interval.values.weatherCode)].title}</span>
                </div>
            </div>
            <div class="column-2">
                <div class="temp-high">
                    ${interval.values.temperatureMax}
                </div>
                <div class="temp-low">
                    ${interval.values.temperatureMin}
                </div>
                <div class="wind-speed-1">
                    ${interval.values.windSpeed}
                </div>
            </div>
        `
        node.appendChild(child)
    })
    document.body.appendChild(node)
}

function createChartSummary(selectedCardWeatherData){
    
    let node = document.createElement('div')
    node.setAttribute('id','daily-container')

    let date = formatDate(selectedCardWeatherData.startTime)

    let date1 = new Date(selectedCardWeatherData.values.sunriseTime);
    let date2= new Date(selectedCardWeatherData.values.sunsetTime);

    let formatedDate1=date1.toLocaleString('en-US', {timeZone: 'America/Los_Angeles',hour: '2-digit',minute: '2-digit',hour12: true });
    let formatedDate2=date2.toLocaleString('en-US', {timeZone: 'America/Los_Angeles',hour: '2-digit',minute: '2-digit',hour12: true });
    
    node.innerHTML=`
        <div class="daily-title">
            Daily Weather Details
            <hr style="color: rgba(255, 255, 255, 0.6); margin: 0.7rem 0rem;"/>
        </div>

        <div class="daily-card">
            <div class="daily-card-upper">
                <div class='daily-card-title'>
                    <div class="daily-date">
                        ${date}
                    </div>
                    <div class="daily-weather">
                    ${weatherSymbolCode[String(selectedCardWeatherData.values.weatherCode)].title}
                    </div>
                    <div class="daily-temperature">
                        ${selectedCardWeatherData.values.temperatureMax}&degF/${selectedCardWeatherData.values.temperatureMin}&degF
                    </div>
                </div>
                <div class="daily-card-image-container">
                    <img alt="" src=${weatherSymbolCode[String(selectedCardWeatherData.values.weatherCode)].img} class="daily-card-image"/>
                </div>
            </div>
            <div class="daily-card-inner">
                <div class="daily-card-inner-container">
                    <div class="daily-key">
                        Precipitation:
                    </div>
                    <div class="daily-value">
                        ${selectedCardWeatherData.values.precipitationType==0?'N/A':
                            selectedCardWeatherData.values.precipitationType==1?'Rain':
                            selectedCardWeatherData.values.precipitationType==2?'Snow':
                            selectedCardWeatherData.values.precipitationType==3?'Freezing Rain':
                            'Ice Pellets'
                        }
                    </div>
                </div>
                <div class="daily-card-inner-container">
                    <div class="daily-key">
                        Chance of Rain:
                    </div>
                    <div class="daily-value">
                        ${selectedCardWeatherData.values.precipitationProbability}%
                    </div>
                </div>
                <div class="daily-card-inner-container">
                    <div class="daily-key">
                        Wind Speed:
                    </div>
                    <div class="daily-value">
                        ${selectedCardWeatherData.values.windSpeed} mph
                    </div>
                </div>
                <div class="daily-card-inner-container">
                    <div class="daily-key">
                        Humidity:
                    </div>
                    <div class="daily-value">
                        ${selectedCardWeatherData.values.humidity}%
                    </div>
                </div>
                <div class="daily-card-inner-container">
                    <div class="daily-key">
                        Visibility:
                    </div>
                    <div class="daily-value">
                        ${selectedCardWeatherData.values.visibility} mi
                    </div>
                </div>
                <div class="daily-card-inner-container">
                    <div class="daily-key">
                        Sunrise/Sunset:
                    </div>
                    <div class="daily-value">
                        ${formatedDate1.replace(/\s/,"")}/${formatedDate2.replace(/\s/,"")}
                    </div>
                </div>
            </div>
        </div>
    `
    let nextNode = document.createElement('div')
    nextNode.setAttribute('id','chart-entry-title')
    nextNode.innerHTML = `
         <div>
            Weather Charts
            <hr style="color: rgba(255, 255, 255); margin: 0.7rem 0rem 0.2rem 0rem;"/>
        </div>
        <img src="./Images/point-down-512.png" class="point-down" id="down-image" alt=""/>
    `
    nextNode.children[1].addEventListener('click',()=>showCharts())
    document.body.appendChild(node)
    document.body.appendChild(nextNode)
}


