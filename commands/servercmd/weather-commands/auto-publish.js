module.exports = (client) => {
    
    client.on('message', message => {

    //if (message.guild.id === '795129011168477205') {
    
        if (message.channel.id === '801396269360480256' || message.channel.id === '795144248449040446' || message.channel.id === '818394869902606386' || message.channel.id === '818394266774274078' || message.channel.id === '818392239042461719' || message.channel.id === '795144435851067392') {
        
        if (message.channel.type === 'news') {
            message.crosspost()
        }
    //}
    } 
    })
}