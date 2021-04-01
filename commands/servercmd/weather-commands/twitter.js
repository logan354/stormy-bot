const Twit = require('twit');
const metserviceChannel = '795144248449040446';
const metserviceWarnChannel = '801396269360480256';
const niwaWeatherChannel = '818394869902606386';
const weatherWatchChannel = '818394266774274078';

module.exports = (client) => {

    var T = new Twit({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token: process.env.TWITTER_ACCESS_TOKEN,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
        timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
        strictSSL: true,     // optional - requires SSL certificates to be valid.
    })


    //@My Twitter
    var stream = T.stream('statuses/filter', { follow: ['1347381213372194816'], name: ['@MetService'] })

    stream.on('tweet', function (tweet) {
        //...
        var url = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
        try {
            let channel = client.channels.fetch('795145677125845062').then(channel => {
                channel.send('@Me tweeted this at ' + new Date() + ': ' + url)
            }).catch(err => {
                console.log(err)
            })
        } catch (error) {
            console.error(error);
        }
    })


    //@MetService
    var stream = T.stream('statuses/filter', { follow: ['18436379'] })

    stream.on('tweet', function (tweet) {
        //...
        var url = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
        try {
            let channel = client.channels.fetch(metserviceChannel).then(channel => {
                channel.send(url)
            }).catch(err => {
                console.log(err)
            })
        } catch (error) {
            console.error(error);
        }
    })


    //@MetServiceWARN
    var stream = T.stream('statuses/filter', { follow: ['75957576'] })

    stream.on('tweet', function (tweet) {
        //...
        var url = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
        try {
            let channel = client.channels.fetch(metserviceWarnChannel).then(channel => {
                channel.send(url)
            }).catch(err => {
                console.log(err)
            })
        } catch (error) {
            console.error(error);
        }
    })


    //@NiwaWeather
    var stream = T.stream('statuses/filter', { follow: ['2467228680'] })

    stream.on('tweet', function (tweet) {
        //...
        var url = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
        try {
            let channel = client.channels.fetch(niwaWeatherChannel).then(channel => {
                channel.send(url)
            }).catch(err => {
                console.log(err)
            })
        } catch (error) {
            console.error(error);
        }
    })


    //@WeatherWatchNZ
    var stream = T.stream('statuses/filter', { follow: ['60745428'] })

    stream.on('tweet', function (tweet) {
        //...
        var url = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
        try {
            let channel = client.channels.fetch(weatherWatchChannel).then(channel => {
                channel.send(url)
            }).catch(err => {
                console.log(err)
            })
        } catch (error) {
            console.error(error);
        }
    })


    //track
    var stream = T.stream('statuses/filter', { track: ['Heavy Rain Watch'] })

    stream.on('tweet', function (tweet) {
        //...
        var url = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
        try {
            let channel = client.channels.fetch(metserviceWarnChannel).then(channel => {
                channel.send('WKATO')
            }).catch(err => {
                console.log(err)
            })
        } catch (error) {
            console.error(error);
        }
    })
}