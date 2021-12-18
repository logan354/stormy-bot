/**
 * Gets weather icon
 * @param {string} query 
 * @param {string} type 
 * @returns {string}
 */
 function getIcon(query, type) {
    switch (query) {
        case "Fine":
            return type === "NIGHT" ? "https://about.metservice.com/assets/Uploads/Fine-Night.png" : "https://about.metservice.com/assets/img/icon-exp/_resampled/resizedimage5555-ic-condition-fine-tiny-2.png";
        case "Partly cloudy":
            return type === "NIGHT" ? "https://about.metservice.com/assets/Uploads/Partly-Cloudy-Night.png" : "https://about.metservice.com/assets/img/icon-exp/ic-condition-partly-cloudy-tiny-2.png";
        case "Cloudy":
            return "https://about.metservice.com/assets/img/icon-exp/ic-condition-cloudy-tiny.png";
        case "Few showers":
            return type === "NIGHT" ? "https://about.metservice.com/assets/Uploads/Few-Showers-Night.png" : "https://about.metservice.com/assets/img/icon-exp/ic-condition-few-showers-tiny-2.png";
        case "Showers":
            return "https://about.metservice.com/assets/img/icon-exp/ic-condition-showers-tiny.png";
        case "Rain":
            return "https://about.metservice.com/assets/img/icon-exp/ic-condition-rain-tiny-2.png";
        case "Drizzle":
            return "https://about.metservice.com/assets/img/icon-exp/ic-condition-drizzle-tiny-2.png";
        case "Fog":
            return "https://about.metservice.com/assets/img/icon-exp/ic-condition-fog-tiny.png";
        case "Snow":
            return "https://about.metservice.com/assets/img/icon-exp/ic-condition-snow-tiny.png";
        case "Windy":
            return "https://about.metservice.com/assets/Uploads/Windy.png";
        case "Wind rain":
            return "https://about.metservice.com/assets/img/icon-exp/ic-condition-wind-and-rain-tiny-2.png";
        case "Thunder":
            return "https://about.metservice.com/assets/img/icon-exp/ic-condition-thunder-tiny-2.png";
        case "Hail":
            return "https://about.metservice.com/assets/img/icon-exp/ic-condition-hail-tiny-2.png";
        case "Frost":
            return "https://about.metservice.com/assets/img/icon-exp/ic-condition-frost-tiny.png";
        case "Warning yellow":
            return "https://about.metservice.com/assets/Uploads/_resampled/resizedimage8888-General-Watch.png";
        case "Warning orange":
            return "https://about.metservice.com/assets/Uploads/_resampled/resizedimage9079-General-Warning.png";
        case "Warning red":
            return "https://about.metservice.com/assets/Uploads/_resampled/resizedimage8980-General-Severe-Warning.png";
    }
}

/**
 * Gets weather emoji icon
 * @param {string} query 
 * @param {string} type 
 * @returns 
 */
function getIconEmoji(query, type) {
    switch (query) {
        case "Fine":
            return type === "NIGHT" ? "<:Night_Fine:876238635920408646>" : "<:Fine:876238436112138331>";
        case "Partly cloudy":
            return type === "NIGHT" ? "<:Night_PartlyCloudy:876238635924615168>" : "<:PartlyCloudy:876238435885658134>";
        case "Cloudy":
            return "<:Cloudy:876238436242182174>";
        case "Few showers":
            return type === "NIGHT" ? "<:Night_FewShowers:876238635396132905>" : "<:FewShowers:876238436028285048>";
        case "Showers":
            return "<:Showers:876238435894063115>";
        case "Rain":
            return "<:Rain:876238436053446667>";
        case "Drizzle":
            return "<:Drizzle:876238436267360336>";
        case "Fog":
            return "<:Fog:876238436212834304>";
        case "Snow":
            return "<:Snow:876238436347052072>";
        case "Windy":
            return "<:Wind:876238436305084436>";
        case "Wind rain":
            return "<:WindRain:876238436011499611>";
        case "Thunder":
            return "<:Thunder:876238436221210714>";
        case "Hail":
            return "<:Hail:876238436149911582>";
        case "Frost":
            return "<:Frost:876238435642404905>";
        case "Warning yellow":
            return "<:Watch:878485283316842556>";
        case "Warning orange":
            return "<:OrangeWarning:878485283396534313>";
        case "Warning red":
            return "<:RedWarning:878485282947731488>";
    }
}

module.exports = { getIcon, getIconEmoji }