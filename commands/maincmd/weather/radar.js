const Discord = require('discord.js');

module.exports = {
    name: 'radar',
    aliases: [],
    category: 'Weather',
    utilisation: '{prefix}radar',

    async execute(client, message, args) {

        //https://www.metservice.com/publicData/rainRadar/image/Bay-of-Plenty/300K/2021-02-14T21:28:00+13:00.png
        //https://www.metservice.com/publicData/rainRadar/image/Bay-of-Plenty/300K/2021-03-13T13:13:00+13:00.png

        //Find date
        var d = new Date();
        let currentTime = d.toLocaleTimeString();

        let year = d.getUTCFullYear();
        let month = d.getUTCMonth() + 1;
        let date = d.getUTCDate();
        let hours = d.getUTCHours() + 13;
        let minutes = d.getUTCMinutes();

        let k = 0

        while (k < 11) {

            //Set minutes
            if (minutes < 10 && minutes >= 0 && minutes.toString().length !== 2) minutes = '0' + minutes
            if (minutes < 0) {
                minutes = 59
                hours = hours - 1
            } 

            //Set hours
            if (hours > 23) {
                hours = hours - 24
                date = date + 1
            }
            if (hours < 10 && hours >= 0 && hours.toString().length !== 2) hours = '0' + hours

            //Set date
            if (date < 10 && date >= 0 && date.toString().length !== 2) date = '0' + date

            //Set month
            if (month < 10 && month >= 0 && month.toString().length !== 2) month = '0' + month


            //Print Image
            //message.channel.send(```Bay of Plenty Radar image at ${year}-${month}-${date}T${hours}:${minutes}:00```)
            let radarImage = `https://www.metservice.com/publicData/rainRadar/image/Bay-of-Plenty/300K/${year}-${month}-${date}T${hours}:${minutes}:00+13:00`
            //message.channel.send(radarImage)

            const radarEmbed = new Discord.MessageEmbed()
                .setAuthor(`Bay of Plenty Radar image at ${year}-${month}-${date}T${hours}:${minutes}:00`)
                .setColor(0x111111)
                .setImage(radarImage)

            message.channel.send(radarEmbed)

            //Loop minutes
            minutes = minutes - 1;
            k = k + 1

            //Log message
            // client.on('message', async (message) => { 
            //     console.log(message)
            // })
        }
    }
}