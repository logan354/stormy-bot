const { Client } = require("discord.js");
const { TwitterApi } = require("twitter-api-v2");

/**
 * @param {Client} client 
 */
module.exports = (client) => {
    const appOnlyClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

    console.log(appOnlyClient.v2.getStream("tweets/sample/stream"))
}