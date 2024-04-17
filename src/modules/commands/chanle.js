module.exports.config = {
    name: 'chanle',
    version: '1.0.0',
    credit: 'tphatdev',
    description: 'Chẳn lẻ!',
    usage: ''
}

module.exports.run = function(api, events, args, client) {
    text = "GAME: Chẳn lẻ\n===CÁCH CHƠI===\n- Chọn chan/le để đặt cược\n- Ví dụ: le 2000\n- Hoạt động trò chơi: \n[+] - Tỷ lệ số tiền cược x 2.5 = số tiền ăn được\n[+] - Các con số từ 2 4 6 8 10 là Chẵn\n[+] - Các con số 1 3 5 7 9 là Lẻ.";
    api.sendMessage(text, events.threadID, events.messageID);
}
module.exports.onload = function(api, events, args, client) {
    console.log('Onload !');
}