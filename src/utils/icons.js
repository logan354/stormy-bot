const { GuildEmoji } = require("discord.js");

/**
 * Gets a MetService icon url
 * @param {string} query 
 * @param {?string} type 
 * @returns {URL}
 */
 function getIconURL(query, type = "day") {
    switch (query.toLowerCase()) {
        case "fine":
            if (type.toLowerCase() === "night") return "https://about.metservice.com/assets/Uploads/Fine-Night.png";
            else return "https://about.metservice.com/assets/img/icon-exp/_resampled/resizedimage5555-ic-condition-fine-tiny-2.png";
        case "partly cloudy":
            if (type.toLowerCase() === "night") return "https://about.metservice.com/assets/Uploads/Partly-Cloudy-Night.png";
            else return "https://about.metservice.com/assets/img/icon-exp/ic-condition-partly-cloudy-tiny-2.png";
        case "cloudy":
            return "https://about.metservice.com/assets/img/icon-exp/ic-condition-cloudy-tiny.png";
        case "few showers":
            if (type.toLowerCase() === "night") return "https://about.metservice.com/assets/Uploads/Few-Showers-Night.png";
            else return "https://about.metservice.com/assets/img/icon-exp/ic-condition-few-showers-tiny-2.png";
        case "showers":
            return "https://about.metservice.com/assets/img/icon-exp/ic-condition-showers-tiny.png";
        case "rain":
            return "https://about.metservice.com/assets/img/icon-exp/ic-condition-rain-tiny-2.png";
        case "drizzle":
            return "https://about.metservice.com/assets/img/icon-exp/ic-condition-drizzle-tiny-2.png";
        case "fog":
            return "https://about.metservice.com/assets/img/icon-exp/ic-condition-fog-tiny.png";
        case "snow":
            return "https://about.metservice.com/assets/img/icon-exp/ic-condition-snow-tiny.png";
        case "windy":
            return "https://about.metservice.com/assets/Uploads/Windy.png";
        case "wind rain":
            return "https://about.metservice.com/assets/img/icon-exp/ic-condition-wind-and-rain-tiny-2.png";
        case "thunder":
            return "https://about.metservice.com/assets/img/icon-exp/ic-condition-thunder-tiny-2.png";
        case "hail":
            return "https://about.metservice.com/assets/img/icon-exp/ic-condition-hail-tiny-2.png";
        case "frost":
            return "https://about.metservice.com/assets/img/icon-exp/ic-condition-frost-tiny.png";
        case "warning_yellow":
            return "https://about.metservice.com/assets/Uploads/_resampled/resizedimage8888-General-Watch.png";
        case "warning_orange":
            return "https://about.metservice.com/assets/Uploads/_resampled/resizedimage9079-General-Warning.png";
        case "warning_red":
            return "https://about.metservice.com/assets/Uploads/_resampled/resizedimage8980-General-Severe-Warning.png";
    }
}

/**
 * Gets a Discord emoji id to the related MetService icon
 * @param {string} query 
 * @param {?string} type 
 * @returns {GuildEmoji}
 */
function getIconEmojiID(query, type = "day") {
    switch (query.toLowerCase()) {
        case "fine":
            if (type.toLowerCase() === "night") "<:Night_Fine:876238635920408646>";
            else return "<:Fine:876238436112138331>";
        case "partly cloudy":
            if (type.toLowerCase() === "night") "<:Night_PartlyCloudy:876238635924615168>";
            else return "<:PartlyCloudy:876238435885658134>";
        case "cloudy":
            return "<:Cloudy:876238436242182174>";
        case "few showers":
            if (type.toLowerCase() === "night") "<:Night_FewShowers:876238635396132905>";
            else return "<:FewShowers:876238436028285048>";
        case "showers":
            return "<:Showers:876238435894063115>";
        case "rain":
            return "<:Rain:876238436053446667>";
        case "drizzle":
            return "<:Drizzle:876238436267360336>";
        case "fog":
            return "<:Fog:876238436212834304>";
        case "snow":
            return "<:Snow:876238436347052072>";
        case "windy":
            return "<:Wind:876238436305084436>";
        case "wind rain":
            return "<:WindRain:876238436011499611>";
        case "thunder":
            return "<:Thunder:876238436221210714>";
        case "hail":
            return "<:Hail:876238436149911582>";
        case "frost":
            return "<:Frost:876238435642404905>";
        case "warning_yellow":
            return "<:Watch:878485283316842556>";
        case "warning_orange":
            return "<:OrangeWarning:878485283396534313>";
        case "warning_red":
            return "<:RedWarning:878485282947731488>";
    }
}

module.exports = { getIconURL, getIconEmojiID }