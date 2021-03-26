module.exports = (client) => {

    // Weather Command 
    var d = new Date();

   //console.log(d.toLocaleTimeString());
   //console.log(d.toLocaleString());
   //console.log(d.toLocaleDateString());

   var update_loop = setInterval(Main, 1000);

   Main();

   function Main() { 
    var d = new Date();
    var time = d.toLocaleTimeString();

    const region = 'Hamilton NZ'

    //console.log(time);

    if (time === '2:00:00 PM') {
        //-------'3:00:00 AM NZDT'
        client.channels.cache.get('795144435851067392').send('```3AM WEATHER UPDATE```')
    }

    if (time === '5:00:00 PM') {
        //-------'6:00:00 AM NZDT'
        client.channels.cache.get('795144435851067392').send('```6AM WEATHER UPDATE```')
    }

    if (time === '8:00:00 PM') {
        //-------'9:00:00 AM NZDT'
        client.channels.cache.get('795144435851067392').send('```9AM WEATHER UPDATE```')
    }

    if (time === '11:00:00 PM') {
        //-------'12:00:00 PM NZDT'
        client.channels.cache.get('795144435851067392').send('```12PM WEATHER UPDATE```')
    }

    if (time === '2:00:00 AM') {
        //-------'3:00:00 PM NZDT'
        client.channels.cache.get('795144435851067392').send('```3PM WEATHER UPDATE```')
    }

    if (time === '5:00:00 AM') {
        //-------'6:00:00 PM NZDT'
        client.channels.cache.get('795144435851067392').send('```6PM WEATHER UPDATE```')
    }

    if (time === '8:00:00 AM') {
        //-------'9:00:00 PM NZDT'
        client.channels.cache.get('795144435851067392').send('```9PM WEATHER UPDATE```')
    }

    if (time === '11:00:00 AM') {
        //-------'12:00:00 AM NZDT'
        client.channels.cache.get('795144435851067392').send('```12AM WEATHER UPDATE```')
    }
    

    if (time === '2:00:00 PM' || time === '5:00:00 PM' || time === '8:00:00 PM' || time === '11:00:00 PM' || time === '2:00:00 AM' || time === '5:00:00 AM' || time === '8:00:00 AM' || time === '11:00:00 AM') {
        //-------'3:00:00 AM NZDT'--------'6:00:00 AM NZDT'--------'9:00:00 AM NZDT'--------'12:00:00 PM NZDT'--------'3:00:00 PM NZDT'--------'6:00:00 PM NZDT'--------'9:00:00 PM NZDT'--------'12:00:00 AM NZDT'
        client.channels.cache.get('795144435851067392').send(`${client.config.discord.prefix}weather ${region}`).then(message => { message.delete() })
    }

}
}
