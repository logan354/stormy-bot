const { Client, WebhookClient } = require("discord.js");
const Twit = require("twit");
const { guildChannels } = require("../../utils/constants");

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

    const metserviceWebhook = new WebhookClient({ id: "1095134383263989861", token: process.env.METSERVICE_WEBHOOK_TOKEN });
    const metserviceWARNWebhook = new WebhookClient({ id: "1095135096685740084", token: process.env.METSERVICEWARN_WEBHOOK_TOKEN });

    // MetService
    const MetServiceStream = T.stream("statuses/filter", { follow: ["18436379"] });

    MetServiceStream.on("tweet", (tweet) => {
        const url = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;

        if (tweet.user.screen_name === "MetService") {
            metserviceWebhook.send(url)
                .then(message => message.crosspost())
                .catch(error => console.error(error));
        }
    });

    // MetServiceWARN
    const MetServiceWARNStream = T.stream("statuses/filter", { follow: ["75957576"] });

    MetServiceWARNStream.on("tweet", (tweet) => {
        const url = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;

        if (tweet.user.screen_name === "MetServiceWARN") {
            metserviceWARNWebhook.send(url)
                .then(message => message.crosspost())
                .catch(error => console.error(error));
        }
    });
}