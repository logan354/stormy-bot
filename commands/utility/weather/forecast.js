const weather = require('weather-js');

const Discord = require('discord.js');

module.exports = {
    name: 'forecast',
    aliases: ['f'],
    category: 'Weather',
    utilisation: '{prefix}forecast',

    async execute (client, message, args){

    weather.find({search: args.join(" "), degreeType: 'C'}, function (error, result){
        // 'C' can be changed to 'F' for farneheit results
        if(error) return message.channel.send(error);
        if(!args[0]) return message.channel.send(`${client.emotes.error} - Please specify a location`)

        if(result === undefined || result.length === 0) return message.channel.send(`${client.emotes.error} - Invalid location`);

        var current = result[0].current;
        var location = result[0].location;
        var forecast = result[0].forecast;

        const weatherinfo = new Discord.MessageEmbed()
        .setDescription(`**${forecast.skytextday}**`)
        .setAuthor(`Forecast for ${forecast.day} in ${current.observationpoint}`)
        .setThumbnail(current.imageUrl)
        .setColor(0x111111)
        //.addField('Temperature', `${current.temperature}°`, true)
        .addField(' H/L Temperature', `${client.emotes.H}${forecast.high}°/${forecast.low}°${client.emotes.L}`, true)
        .addField('Current Wind', current.winddisplay, true)
        .addField('Current Humidity', `${current.humidity}%`, true)
        //.addField('Feels like', `${current.feelslike}°`, true)
        .addField('Timezone', `UTC${location.timezone}`, true)
        .addField('Degree Type', 'Celsius', true)
        .setFooter(`Weather Observation ${current.date} | ${current.observationtime}`)
        



        message.channel.send(weatherinfo)
        })        
    }
}