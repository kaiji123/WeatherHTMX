import os
from flask import Flask, render_template, request, jsonify
import requests
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
API_KEY = os.getenv('WEATHER_API_KEY')



@app.route('/')
def index():
    return render_template('index.html')

@app.route('/welcome')
def welcome():
    return render_template('welcome.html')



@app.route('/form')
def form():
    return render_template('form.html')

@app.route('/submit-form', methods=['POST'])
def submit_form():
    name = request.form.get('name')
    print(name)
    return render_template('result.html', name=name)
@app.route('/weather')
def weather():
    return render_template('weather.html')


@app.route('/get-weather', methods=['POST'])
def get_weather():
    latitude = request.form.get('latitude')
    longitude = request.form.get('longitude')

    if not latitude or not longitude:
        return render_template('result.html', 
                               city='Unknown', 
                               country='Unknown', 
                               temp='N/A', 
                               description='Invalid coordinates', 
                               humidity='N/A', 
                               wind_speed='N/A')
    
    response = requests.get(
        f'http://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&appid={API_KEY}'
    )
    forecast_response = requests.get(
        f'http://api.openweathermap.org/data/2.5/forecast?lat={latitude}&lon={longitude}&appid={API_KEY}&units=metric'
    )

    weather_data = response.json()
    forecast_data = forecast_response.json()

    if response.status_code == 200:
        weather_info = {
            'city': weather_data.get('name', 'Unknown Location'),
            'country': weather_data['sys'].get('country', 'Unknown'),
            'temp': weather_data['main']['temp'],
            'description': weather_data['weather'][0]['description'],
            'humidity': weather_data['main']['humidity'],
            'wind_speed': weather_data['wind']['speed'],
            'forecast': [
                {
                    'datetime': entry['dt_txt'],
                    'temp': entry['main']['temp'],
                    'humidity': entry['main']['humidity']
                }
                for entry in forecast_data['list']
            ]
        }
        return render_template('weather_result.html', weather_info=weather_info)
    else:
        return render_template('weather_result.html', 
                               city='Unknown', 
                               country='Unknown', 
                               temp='N/A', 
                               description='Error retrieving weather data', 
                               humidity='N/A', 
                               wind_speed='N/A')

if __name__ == '__main__':
    app.run(debug=True)
