module.exports.config = {
    name: 'taixiu',
    version: '1.0.0',
    credit: 'tphatdev',
    description: 'Tài xỉuu!',
    usage: ''
}

module.exports.run = function(api, events, args, client) {
    text = "GAME: Tài xỉu\n===CÁCH CHƠI===\n- Chọn tai/xiu để đặt cược\n- Ví dụ: !tai 2000\n- Hoạt động trò chơi: \n[+] - Tỷ lệ số tiền cược x 1.9 = số tiền ăn được\n[+] - Từ 3 đến 10 là Xỉu\n[+] - Từ 11 đến 18 là Tài.";
    api.sendMessage(text, events.threadID, events.messageID);
}

module.exports.onload = function(api, events, args, client) {
    console.log('Onload !');
}