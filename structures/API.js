const fetch = require("node-fetch");

function getHourlyForecast(client) {
    const city = "Hamilton";

    fetch("http://metservice.com/publicData/localForecast" + city)
        .then(res => res.json())
        .then(json => {
            client.channels.cache.get("").send({
                embed: {
                    color: "BLACK",
                    author: "Forecast for " + city,
                    description: json.days[0].forecast,
                    thumbnail: getDayIcon(json.days[0].forecastWord),
                }
            });
        });
}

function getDailyForecast(client) {
    const city = "Hamilton";

    fetch("http://metservice.com/publicData/localForecast" + city)
        .then(res => res.json())
        .then(json => {
            client.channels.cache.get("").send({
                embed: {
                    color: "BLACK",
                    author: "Forecast for " + city,
                    description: json.days[0].forecast,
                    thumbnail: getDayIcon(json.days[0].forecastWord),
                }
            });
        });
}

function get5DayForecast(client) {
    const city = "Hamilton";

    fetch("http://metservice.com/publicData/localForecast" + city)
        .then(res => res.json())
        .then(json => {
            client.channels.cache.get("").send({
                embed: {
                    color: "BLACK",
                    author: "5 Day Forecast for " + city,
                    fields: [
                        { name: getDayIcon(json.days[0].forecastWord) + " " + json.days[0].dow, value: json.days[0].forecast },
                        { name: getDayIcon(json.days[1].forecastWord) + " " + json.days[1].dow, value: json.days[1].forecast },
                        { name: getDayIcon(json.days[2].forecastWord) + " " + json.days[2].dow, value: json.days[2].forecast },
                        { name: getDayIcon(json.days[3].forecastWord) + " " + json.days[3].dow, value: json.days[3].forecast },
                        { name: getDayIcon(json.days[4].forecastWord) + " " + json.days[4].dow, value: json.days[4].forecast }
                    ]
                }
            });
        });
}

module.exports = { getHourlyForecast, getDailyForecast, get5DayForecast }