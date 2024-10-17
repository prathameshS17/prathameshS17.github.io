from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/index.html')
def defaultIndex():
    return app.send_static_file('index.html')

@app.route('/getWeatherData/<recUserLocation>', methods=['GET'])
def get_weather_data(recUserLocation):
    # recUserLocation = "34.0522,-118.2437"
    fieldsString = "temperature,temperatureApparent,temperatureMin,temperatureMax,windSpeed,windDirection,humidity,pressureSeaLevel,uvIndex,weatherCode,precipitationProbability,precipitationType,sunriseTime,sunsetTime,visibility,moonPhase,cloudCover"
    loc = recUserLocation.split(',')
    url = f"https://api.tomorrow.io/v4/timelines?location={loc[0]},{loc[1]}&fields={fieldsString}&timesteps=1d&units=imperial&timezone=America/Los_Angeles&apikey=XXTh8upbfipnNPN969YcW9xM6ABSBKcm"
    response = requests.get(url).json()
    
    if response and 'data' in response:
        result = {
            # "data":result['data']['timelines'] if result else {},
            "data":response['data']['timelines'] ,
            "message": "success"
        }
        return jsonify(result),200
    else:
        result = {
            "data":{},
            "message": "No record have been found."
        }
        return jsonify(result),404

@app.route('/getHourlyData/<locationForHourly>', methods=['GET'])
def getHourlyData(locationForHourly):
    # locationForHourly = "34.0522,-118.2437"
    fieldsString = "temperature,windSpeed,windDirection,humidity,pressureSeaLevel"
    loc = locationForHourly.split(',')
    url = f"https://api.tomorrow.io/v4/timelines?location={loc[0]},{loc[1]}&fields={fieldsString}&timesteps=1h&startTime=now&endTime=nowPlus5d&units=imperial&timezone=America/Los_Angeles&apikey=XXTh8upbfipnNPN969YcW9xM6ABSBKcm"
    response = requests.get(url).json()

    if response and 'data' in response:
        result = {
            # "data":result['data']['timelines'] if result else {},
            "data":response['data']['timelines'] ,
            "message": "success"
        }
        return jsonify(result),200
    else:
        result = {
            "data":{},
            "message": "No record have been found."
        }
        return jsonify(result),404

if __name__ == "__main__":
    app.run()