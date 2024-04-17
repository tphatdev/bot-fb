const fs = require('fs');
const path = require('path');

const accountPath = path.join(__dirname, 'account.json');

module.exports.config = {
    name: 'info',
    version: '1.0.0',
    credit: 'tphatdev',
    description: 'Help!',
    usage: ''
};

function number_format(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports.run = function(api, events, args, client) {
    const userData = getAccountData(events.senderID); // Lấy dữ liệu tài khoản từ account.json
    const senderID = events.senderID || 'Unknown';
    if (!userData) {
        api.sendMessage('Bạn không có trong danh sách thành viên', events.threadID, events.messageID);
        return;
    } else {
        const text = `Thông tin:\nPlayer: @${userData.name}\nLượt chơi: ${userData.play} Lượt\nThắng: ${userData.win} Lần\nThua: ${userData.lose} Lần\nSố dư: ${number_format(userData.sodu)}đ\n- Developer By ThanhPhat!`;
    api.sendMessage({
        body: text,
        mentions: [ { tag: userData.name, id: senderID } ]
    }, events.threadID, events.messageID);
    }
};


module.exports.onload = function(api, events, args, client) {
    console.log('Onload !');
};

// Hàm lấy dữ liệu tài khoản từ account.json
function getAccountData(userId) {
    try {
        if (fs.existsSync(accountPath)) {
            const rawData = fs.readFileSync(accountPath);
            const data = JSON.parse(rawData);
            return data.members[userId];
        } else {
            console.error("Error: Account file does not exist.");
            return null;
        }
    } catch (error) {
        console.error("Error reading account data:", error);
        return null;
    }
}
