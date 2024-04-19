module.exports.config = {
    name: 'help',
    version: '1.0.0',
    credit: 'tphatdev',
    description: 'Help!',
    usage: ''
}

module.exports.run = function(api, events, args, client) {
    text = "BOT: Thanhh Phatt\n\nDANH SÁCH LỆNH:\n\n[1] !info - Xem thông tin\n[2] !dangky - Đăng ký tài khoản\n[3] !taixiu - Chơi tài xỉu\n[4] !chanle - Chơi chẵn lẻ\n[5] !lode - Chơi đánh đề\n[6] !bank - Chuyển tiền";
    api.sendMessage(text, events.threadID, events.messageID);
}
module.exports.onload = function(api, events, args, client) {
    console.log('Onload !');
}