const weather = require('weather-js');

const Discord = require('discord.js');

module.exports = {
    name: 'weather',
    aliases: [],
    category: 'Weather',
    utilisation: '{prefix}weather',

    async execute(client, message, args) {

        weather.find({ search: args.join(" "), degreeType: 'C' }, function (error, result) {
            // 'C' can be changed to 'F' for farneheit results
            if (error) return message.channel.send(error);
            if (!args[0]) return message.channel.send(`${client.emotes.error} - Please specify a location`)

            if (result === undefined || result.length === 0) return message.channel.send(`${client.emotes.error} - Invalid location`);

            var current = result[0].current;
            var location = result[0].location;
            var forecast = result[0].forecast;

            let weatherEmoji = '';

            let Met_Fine = "https://about.metservice.com/assets/img/icon-exp/_resampled/resizedimage5555-ic-condition-fine-tiny-2.png";
            let Met_Partly_Cloudy = "https://about.metservice.com/assets/img/icon-exp/ic-condition-partly-cloudy-tiny-2.png";
            let Met_Cloudy_Mostly_Cloudy = "https://about.metservice.com/assets/img/icon-exp/ic-condition-cloudy-tiny.png";
            let Met_Few_Showers = "https://about.metservice.com/assets/img/icon-exp/ic-condition-few-showers-tiny-2.png";
            let Met_Showers = "https://about.metservice.com/assets/img/icon-exp/ic-condition-showers-tiny.png";
            let Met_Rain = "https://about.metservice.com/assets/img/icon-exp/ic-condition-rain-tiny-2.png";
            let Met_Drizzle = "https://about.metservice.com/assets/img/icon-exp/ic-condition-drizzle-tiny-2.png";
            let Met_Fog = "https://about.metservice.com/assets/img/icon-exp/ic-condition-fog-tiny.png";
            let Met_Snow = "https://about.metservice.com/assets/img/icon-exp/ic-condition-snow-tiny.png";
            let Met_Wind = "https://about.metservice.com/assets/img/icon-exp/ic-condition-wind-tiny-2.png";
            let Met_Wind_Rain = "https://about.metservice.com/assets/img/icon-exp/ic-condition-wind-and-rain-tiny-2.png";
            let Met_Thunder = "https://about.metservice.com/assets/img/icon-exp/ic-condition-thunder-tiny-2.png";
            let Met_Hail = "https://about.metservice.com/assets/img/icon-exp/ic-condition-hail-tiny-2.png";
            let Met_Frost = "https://about.metservice.com/assets/img/icon-exp/ic-condition-frost-tiny.png";

            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/1.gif') { weatherEmoji = Met_Thunder; client.channels.cache.get('795173942293692447').send("Image 1") } //Checked
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/2.gif') { weatherEmoji = Met_Thunder; client.channels.cache.get('795173942293692447').send("Image 2") } //Checked 
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/3.gif') { weatherEmoji = Met_Thunder; client.channels.cache.get('795173942293692447').send("Image 3") } //Checked
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/4.gif') { weatherEmoji = Met_Thunder; client.channels.cache.get('795173942293692447').send("Image 4") } //Checked
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/5.gif') { weatherEmoji = Met_Snow; client.channels.cache.get('795173942293692447').send("Image 5") }
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/6.gif') { weatherEmoji = Met_Hail; client.channels.cache.get('795173942293692447').send("Image 6") }
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/7.gif') { weatherEmoji = Met_Hail; client.channels.cache.get('795173942293692447').send("Image 7") }
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/8.gif') { weatherEmoji = Met_Snow; client.channels.cache.get('795173942293692447').send("Image 8") }
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/9.gif') { weatherEmoji = Met_Showers; client.channels.cache.get('795173942293692447').send("Image 9") }
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/10.gif') { weatherEmoji = Met_Hail; client.channels.cache.get('795173942293692447').send("Image 10") }
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/11.gif') { weatherEmoji = Met_Rain; client.channels.cache.get('795173942293692447').send("Image 11") }
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/12.gif') { weatherEmoji = Met_Rain; client.channels.cache.get('795173942293692447').send("Image 12") }
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/13.gif') { weatherEmoji = Met_Snow; client.channels.cache.get('795173942293692447').send("Image 13") } //Checked But Divided
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/14.gif') { weatherEmoji = Met_Snow; client.channels.cache.get('795173942293692447').send("Image 14") } //Checked
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/15.gif') { weatherEmoji = Met_Wind; client.channels.cache.get('795173942293692447').send("Image 15") } //Checked But Divided
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/16.gif') { weatherEmoji = Met_Snow; client.channels.cache.get('795173942293692447').send("Image 16") } //Checked
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/17.gif') { weatherEmoji = Met_Thunder; client.channels.cache.get('795173942293692447').send("Image 17") } //Checked
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/18.gif') { weatherEmoji = Met_Hail; client.channels.cache.get('795173942293692447').send("Image 18") }
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/19.gif') { weatherEmoji = Met_Fog; client.channels.cache.get('795173942293692447').send("Image 19") } //Checked But Divided
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/20.gif') { weatherEmoji = Met_Fog; client.channels.cache.get('795173942293692447').send("Image 20") } //Checked
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/21.gif') { weatherEmoji = Met_Fog; client.channels.cache.get('795173942293692447').send("Image 21") } //Checked But Divided
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/22.gif') { weatherEmoji = Met_Fog; client.channels.cache.get('795173942293692447').send("Image 22") } //Checked But Divided
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/23.gif') { weatherEmoji = Met_Wind; client.channels.cache.get('795173942293692447').send("Image 23") } //Checked
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/24.gif') { weatherEmoji = Met_Wind; client.channels.cache.get('795173942293692447').send("Image 24") } //Checked
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/25.gif') { weatherEmoji = Met_Frost; client.channels.cache.get('795173942293692447').send("Image 25") } //Checked
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/26.gif') { weatherEmoji = Met_Cloudy_Mostly_Cloudy; client.channels.cache.get('795173942293692447').send("Image 26") } //Checked
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/27.gif') { weatherEmoji = Met_Cloudy_Mostly_Cloudy; client.channels.cache.get('795173942293692447').send("Image 27") } //Checked
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/28.gif') { weatherEmoji = Met_Cloudy_Mostly_Cloudy; client.channels.cache.get('795173942293692447').send("Image 28") } //Checked
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/29.gif') { weatherEmoji = Met_Partly_Cloudy; client.channels.cache.get('795173942293692447').send("Image 29") } //Checked
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/30.gif') { weatherEmoji = Met_Partly_Cloudy; client.channels.cache.get('795173942293692447').send("Image 30") } //Checked
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/31.gif') { weatherEmoji = Met_Fine; client.channels.cache.get('795173942293692447').send("Image 31") } //Checked
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/32.gif') { weatherEmoji = Met_Fine; client.channels.cache.get('795173942293692447').send("Image 32") } //Checked
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/33.gif') { weatherEmoji = Met_Partly_Cloudy; client.channels.cache.get('795173942293692447').send("Image 33") } //Checked
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/34.gif') { weatherEmoji = Met_Partly_Cloudy; client.channels.cache.get('795173942293692447').send("Image 34") } //Checked
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/35.gif') { weatherEmoji = Met_Thunder; client.channels.cache.get('795173942293692447').send("Image 35") } //Checked
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/36.gif') { weatherEmoji = Met_Fine; client.channels.cache.get('795173942293692447').send("Image 36") } //Checked
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/37.gif') { weatherEmoji = Met_Thunder; client.channels.cache.get('795173942293692447').send("Image 37") } //Checked But Divided
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/38.gif') { weatherEmoji = Met_Thunder; client.channels.cache.get('795173942293692447').send("Image 38") } //Checked But Divided
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/39.gif') { weatherEmoji = Met_Few_Showers; client.channels.cache.get('795173942293692447').send("Image 39") }
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/40.gif') { weatherEmoji = Met_Rain; client.channels.cache.get('795173942293692447').send("Image 40") }
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/41.gif') { weatherEmoji = Met_Snow; client.channels.cache.get('795173942293692447').send("Image 41") } //Checked But Divided
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/42.gif') { weatherEmoji = Met_Snow; client.channels.cache.get('795173942293692447').send("Image 42") } //Checked But Divided
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/43.gif') { weatherEmoji = Met_Snow; client.channels.cache.get('795173942293692447').send("Image 43") } //Checked But Divided
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/44.gif') { weatherEmoji = ''; client.channels.cache.get('795173942293692447').send("Image 44") }
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/45.gif') { weatherEmoji = Met_Few_Showers; client.channels.cache.get('795173942293692447').send("Image 45") }
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/46.gif') { weatherEmoji = Met_Snow; client.channels.cache.get('795173942293692447').send("Image 46") } //Checked But Divided
            if (current.imageUrl === 'http://blob.weather.microsoft.com/static/weather4/en-us/law/47.gif') { weatherEmoji = Met_Thunder; client.channels.cache.get('795173942293692447').send("Image 47") } //Checked But Divided

            // if (message.channel.id === '795144435851067392') {
            //     message.guild.setIcon(weatherEmoji)
            // }

            const weatherinfo = new Discord.MessageEmbed()
                .setDescription(`**${current.skytext}**`)
                .setAuthor(`Weather in ${current.observationpoint}`)
                //.setThumbnail(current.imageUrl)
                .setThumbnail(weatherEmoji)
                .setColor(0x111111)
                .addField('Temperature', `${current.temperature}°`, true)
                .addField('Wind', current.winddisplay, true)
                .addField('Humidity', `${current.humidity}%`, true)
                .addField('Feels like', `${current.feelslike}°`, true)
                .addField('Timezone', `UTC${location.timezone}`, true)
                .addField('Degree Type', 'Celsius', true)
                .setFooter(`Weather Observation ${current.date} | ${current.observationtime}\nWinds and Temperatures may slightly differ from actual conditions`)
            //.setFooter(`Winds and Temperatures may slightly differ from actual conditions\nWeather Observation ${current.date} | ${current.observationtime}`)




            message.channel.send(weatherinfo)
        })
    }
}