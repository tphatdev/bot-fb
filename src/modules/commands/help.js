module.exports.config = {
    name: 'help',
    version: '1.0.0',
    credit: 'tphatdev',
    description: 'Help!',
    usage: ''
}

module.exports.run = function(api, events, args, client) {
    text = "BOT: PhatDepTrai\nDANH SÁCH LỆNH:\n[1] !info\n[2] !dangky \n[3] !taixiu\n[4] !chanle\n[5] !lode\n";
    api.sendMessage(text, events.threadID, events.messageID);
}
module.exports.onload = function(api, events, args, client) {
    console.log('Onload !');
}