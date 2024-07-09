let weatherChart = null;
document.addEventListener('htmx:afterOnLoad', function(evt) {
    if (evt.detail.elt.id === 'main-content') {
        const namePlaceholder = document.querySelector('#name-placeholder');
        if (namePlaceholder) {
            const params = new URLSearchParams(window.location.search);
            const name = params.get('name');
            if (name) {
                namePlaceholder.textContent = name;
            }
        }
    }

    if (evt.detail.target.id === 'weather-result') {
        const forecastDataDiv = document.getElementById('forecast-data');
        if (forecastDataDiv) {
            const forecastEntries = forecastDataDiv.querySelectorAll('.forecast-entry');
            const labels = [];
            const temperatures = [];
            const humidities = [];
            
            forecastEntries.forEach(entry => {
                labels.push(entry.getAttribute('data-datetime'));
                temperatures.push(parseFloat(entry.getAttribute('data-temp')));
                humidities.push(parseFloat(entry.getAttribute('data-humidity')));
            });
            console.log("canvas")
            // Check if weatherChart instance exists and destroy it
            if (weatherChart) {
                console.log(weatherChart)
                weatherChart.destroy();
            }

            // Create new weatherChart instance
            weatherChart = createWeatherChart(labels, temperatures, humidities);
        }
    }
});



function createWeatherChart(labels, temps, humidities) {
    const ctx = document.getElementById('weatherChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: temps,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    yAxisID: 'y-temp'
                },
                {
                    label: 'Humidity (%)',
                    data: humidities,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    yAxisID: 'y-humidity'
                }
            ]
        },
        options: {
            scales: {
                'y-temp': {
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        callback: function(value) {
                            return value + '°C';
                        }
                    }
                },
                'y-humidity': {
                    type: 'linear',
                    position: 'right',
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            if (tooltipItem.dataset.label === 'Temperature (°C)') {
                                return tooltipItem.raw + '°C';
                            } else if (tooltipItem.dataset.label === 'Humidity (%)') {
                                return tooltipItem.raw + '%';
                            }
                        }
                    }
                }
            }
        }
    });

    return chart;  // Return the chart instance
}


gsap.from('.header', {duration: 1, y : '-100%',ease: 'bounce'})
gsap.from('.header button', {duration: 1, opacity : 0, delay: 1, stagger: 0.5})
gsap.from('.footer', {duration: 2, y : '100%',ease: 'cubic', opacity: 0})