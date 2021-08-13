module.exports = (client) => {
    function getTime() {
    let time = new Date().toLocaleTimeString();
}

setInterval(getTime, 1000);
}