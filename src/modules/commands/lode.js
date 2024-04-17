module.exports.config = {
    name: 'lode',
    version: '1.0.0',
    credit: 'tphatdev',
    description: 'Lô đề!',
    usage: ''
}

module.exports.run = function(api, events, args, client) {
    text = "GAME: Lô đề\n===CÁCH CHƠI===\n- sode [con số] [số tiền cược]\n- Ví dụ: !sode 18 2000\n- Hoạt động trò chơi: \n[+] - Tỷ lệ số tiền cược x 11.5 = số tiền ăn được\n[+] - Hoạt động theo thời gian\n- Khi cược xong, sẽ có thời gian ra kết quá, và kết quả sẽ đc lấy từ thời gian của *thời gian ra kết quả và so sách số đặt cược với 2 số cuối của kết quả";
    api.sendMessage(text, events.threadID, events.messageID);
}

module.exports.onload = function(api, events, args, client) {
    console.log('Onload !');
}