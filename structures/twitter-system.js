const { Client } = require("discord.js");
const Twit = require("twit");

const metserviceChannelId = "795144248449040446";
const metserviceWarnChannelId = "801396269360480256";

/**
 * @param {Client} client 
 */
module.exports = (client) => {
    const T = new Twit({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token: process.env.TWITTER_ACCESS_TOKEN,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
        timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
        strictSSL: true,     // optional - requires SSL certificates to be valid.
    });

    // @MetService
    const MetServiceStream = T.stream("statuses/filter", { follow: ["18436379"] });

    MetServiceStream.on("tweet", (tweet) => {
        const url = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;

        if (tweet.user.screen_name === "MetService") {
            client.channels.fetch(metserviceChannelId)
                .then(channel => channel.send(url))
                .catch(e => console.error(e));
        }
    });

    // @MetServiceWARN
    const MetServiceWARNStream = T.stream("statuses/filter", { follow: ["75957576"] });

    MetServiceWARNStream.on("tweet", (tweet) => {
        const url = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;

        if (tweet.user.screen_name === "MetServiceWARN") {
            client.channels.fetch(metserviceWarnChannelId)
                .then(channel => channel.send(url))
                .catch(e => console.error(e));
        }
    });
}