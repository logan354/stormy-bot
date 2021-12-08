module.exports = {
    name: "info",
    aliases: [""],
    category: "Server",
    description: "",
    utilisation: "{prefix}info",

    execute(client, message, args) {

        message.channel.send({
            embed: {
                color: "BLACK",
                title: "Weather Hub Information",
                thumbnail: { url: "https://about.metservice.com/assets/img/icon-exp/ic-condition-partly-cloudy-tiny-2.png" },
                fields: [
                    { name: "\u200B", value: "<#795172184887918633>\nIn this channel, forecasters will update you on weather events and warnings happening in Hamilton." },
                    { name: "\u200B", value: "<#801396269360480256>\nAny time @MetServiceWARN tweets on there twitter page it will appear here in this channel. MetServiceWARN tweets will usually include weather warnings and watches for New Zealand." },
                    { name: "\u200B", value: "<#795144248449040446>\nAny time MetService tweets on there twitter page it will appear here in this channel. MetService updates will usually include weather warnings and radar updates for New Zealand." },
                    { name: "\u200B", value: "<#878486900686606366>\nIn this channel, Stormy will post the warnings for Hamilton when they are issued by MetService." },
                    { name: "\u200B", value: "<#818392239042461719>\nIn this channel, Stormy will post the forecast for Hamilton every day at 6am." },
                    { name: "\u200B", value: "<#878486808088940564>\nIn this channel, Stormy will post the 3 day forecast for Hamilton every day at 6am." },
                    { name: "\u200B", value: "<#876030637834895420>\nIn this channel, Stormy will post the 5 day forecast for Hamilton every day at 6am." },
                    { name: "\u200B", value: "<#795144435851067392>\nIn this channel, Stormy will post the weather for Hamilton every 3 hours. Times: 3am, 6am, 9am, 12pm, 3pm, 6pm, 9pm, 12am." },
                    { name: "\u200B", value: "<#796950373000544317>\nIn this channel, you can check the weather for your region by using Stormy bot." }
                ],
            }
        });
    }
}