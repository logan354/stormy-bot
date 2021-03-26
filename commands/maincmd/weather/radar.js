const Discord = require('discord.js');

module.exports = {
    name: 'radar',
    aliases: [],
    category: 'Weather',
    utilisation: '{prefix}radar',

    async execute(client, message, args) {

        // var d = new Date();
        // localTime = d.getTime();
        // localOffset = d.getTimezoneOffset() * 60000;
        // utc = localTime + localOffset;

        // offset = 13;  
        // bombay = utc + (3600000*offset);
        // nd = new Date(bombay);

        // console.log(d.getTimezoneOffset())
        // console.log(d.toLocaleTimeString());
        // console.log(d.toLocaleString());
        // console.log(d.toLocaleDateString());

        //https://www.metservice.com/publicData/rainRadar/image/Bay-of-Plenty/300K/2021-02-14T21:28:00+13:00.png
        //https://www.metservice.com/publicData/rainRadar/image/Bay-of-Plenty/300K/2021-03-13T13:13:00+13:00.png

        var d = new Date();
        let currentTime = d.toLocaleTimeString();
        let hours = d.getHours();
        hours = hours + 13
        if (hours > 24) hours = hours - 24
        if (hours === 24) hours = 0
        let realHours = hours;
        let minutes = d.getMinutes();

        // if time = pm + 12 if time = am - 12

        for (var i = 0; i < 9; i++) {

            let realMinutes = minutes - i;
            if (realMinutes < 10) realMinutes = "0" + realMinutes
            if (realHours === 0) realHours = "0" + realHours  
            
            let radarImage = `https://www.metservice.com/publicData/rainRadar/image/Bay-of-Plenty/300K/2021-03-13T${realHours}:${realMinutes}:00+13:00.png`

                const radarEmbed = new Discord.MessageEmbed()
                    .setAuthor(`Bay of Plenty Radar image at ${realHours}:${realMinutes}:00`)
                    .setColor(0x111111)
                    .setImage(radarImage) 

                    message.channel.send(radarEmbed)

            if (realMinutes === 0) realHours = realHours - 1;
            if (realMinutes === 0) minutes = 60 + i;

            //  client.on('message', (message) => { 

            //      let num = 0;
            //      console.log(message.embeds)
            //      num = num + 1;

            //  })
        }
    }
}