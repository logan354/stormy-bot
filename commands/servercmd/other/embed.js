module.exports = {
    name: 'embed',
    aliases: [],
    category: 'Private',
    utilisation: '{prefix}embed',

    execute(client, message) {

        if (message.author.id === '499372750171799554') {

//message.channel.send({
    //embed: {
        //color: 'RED',
        //author: { name: 'RULES' },
        //fields: [
            //{ name: '1) This server is exclusively for support regarding Titanium Bot and its usage.', value: 'We do not provide support for anything outside of Titanium Bot. Questions which include but are not limited to: basic Discord functions, other bots, device usage (mobile vs PC), or Discord bugs will be ignored/redirected to an appropriate resource outside the server.' },
            //{ name: '2) Use channels appropriately.', value: 'Check the pinned posts for channel guidelines before posting. Do not misuse/abuse channels or their functions. Command use and emoji testing is to be kept in <#788157905718214687>.' },
            //{ name: '3) Do not Ping or DM anyone; including in replies or quotes.', value: 'No one is required to help you. All resources used to provide support are available to users through <#786780010613571634>.'  },
            //{ name: '4) No advertising of any kind.', value: 'Do not advertise or endorse other servers, bots, services or products. We are not an advertising server, we do not have game/promotions channels and they will not be implemented.' },
            //{ name: '5) Do not spam.', value: 'This is a support server and there are no channels for spam here. Spam of any kind is not tolerated. This includes but is not limited to: messages, support requests, emojis, reactions, commands, single letters/punctuation, or copy-pasta.'},
            //{ name: 'Disclaimer', value: '**By using the server you agree to comply with the server rules and channel guidelines, regardless if you have read them in their entirety.** \nModerators reserve the right to punish without discretion anyone who does not comply with the above rules. They are not obligated to preface any moderation with a warning or lesser punishment.'}
        //],
    //},
//});


//message.channel.send({
    //embed: {
        //color: 'BLACK',
        //author: { name: 'SERVER INFORMATION' },
        //fields: [
            //{ name: '1) <#795144248449040446>', value: 'Any time MetService tweets on there twitter page it will appear here in this channel. MetService updates will usually include weather warnings and radar updates for New Zealand.' },
            //{ name: '2) <#795172184887918633>', value: 'In this channel, forecasters will update you on weather events and warnings happening in the local region.' },
            //{ name: '3) <#795144435851067392>', value: 'In this channel, Titanium will post the forecast for the local region every 3 hours. (Times: 3am, 6am, 9am, 12pm, 3pm, 6pm, 9pm, 12am).' },
            //{ name: '4) <#796950373000544317>', value: 'In this channel, you can check the weather for your region by using the /weather command. (eg. /weather Hamilton NZ).' },
            //{ name: '5) <#795171961307136023>', value: 'General server announcements will be posted here.' },
            
        //]
    //}
    //})



    message.channel.send({
        embed: {
            color: 'BLACK',
            fields: [
                { name: '__SERVER INFORMATION__', value: '. \n1) <#795144248449040446>\nAny time @MetService tweets on there twitter page it will appear here in this channel. MetService tweets will usually include forecasts, weather warnings and radar updates for New Zealand.\n\n2) <#801396269360480256>\nAny time @MetServiceWARN tweets on there twitter page it will appear here in this channel. MetServiceWARN tweets will usually include weather warnings and watches for New Zealand. Everyone in the discord server will also be notified when a warning affects the local region.\n\n3) <#795172184887918633>\nIn this channel, forecasters will update you on weather events and warnings happening in the local region.\n\n4) <#795144435851067392>\nIn this channel, Titanium will post the forecast for the local region every 3 hours. (Times: 3am, 6am, 9am, 12pm, 3pm, 6pm, 9pm, 12am).\n\n5) <#796950373000544317>\nIn this channel, you can check the weather for your region by using the /weather command. (eg. /weather Hamilton NZ).\n\n**Local Region:** Hamilton, New Zealand' },
                
            ]
        }
        })

} else {
    message.channel.send(`${client.emotes.error} - **You do not have permission to use this command**`)
}
    }
}