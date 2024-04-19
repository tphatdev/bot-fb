const path = require('path');
const fs = require('fs');
module.exports.config = {
    name: 'bank',
    version: '1.0.0',
    credit: 'tphatdev',
    description: 'Chuyển tiền!',
    usage: ''
}
const accountPath = path.join(__dirname, 'account.json');

function number_format(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports.run = function(api, events, args, client) {
    const cmd = events.body.trim().split(' ')[1];
    const name = events.body.trim().split('!bank')[1].trim().split('@')[1].trim().split(' [')[0]; // Tên người nhận
    const amount = events.body.trim().split('[')[1].trim().split(']')[0]; // Số tiền
    const note = events.body.trim().split('] ')[1]; // Ghi chú
    // Chuyển tiền từ người gửi đến người nhận
    if (cmd) {
        const senderID = events.senderID;
        const senderData = __user(senderID); // Thông tin người gửi
        const receiverData = __get_name(name); // Thông tin người nhận

        // Kiểm tra người nhận có tồn tại không
        if (!receiverData) {
            api.sendMessage({
                body: "Người nhận không tồn tại!",
            }, events.threadID, events.messageID);
            return;
        }

        const amountToTransfer = parseFloat(amount); // Số tiền cần chuyển

        // Kiểm tra số dư của người gửi đủ để thực hiện giao dịch không
        if (senderData.sodu < amountToTransfer) {
            api.sendMessage({
                body: "Số dư không đủ để thực hiện giao dịch!",
            }, events.threadID, events.messageID);
            return;
        }

        // Cập nhật số dư cho cả người gửi và người nhận
        senderData.sodu -= amountToTransfer;
        receiverData.sodu += amountToTransfer;

        // Lưu lại dữ liệu đã cập nhật
        __data(senderID, senderData);
        __data(receiverData.uid, receiverData);

        // Gửi tin nhắn xác nhận
        api.sendMessage({
            body: `>>Thông báo biến động số dư: ${senderData.name} đã chuyển cho @${receiverData.name} ${number_format(amountToTransfer)}đ | Nội dung: ${note}`,
            mentions: [ { tag: receiverData.name, id: receiverData.uid }  ]
        }, events.threadID, events.messageID);
    }
}

function __data(userId, newData) {
    try {
        const rawData = fs.readFileSync(accountPath);
        const data = JSON.parse(rawData);
        data.members[userId] = newData;
        fs.writeFileSync(accountPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error updating account data:", error);
    }
}

function __get_name(name) {
    try {
        if (fs.existsSync(accountPath)) {
            const rawData = fs.readFileSync(accountPath);
            const data = JSON.parse(rawData);
            for (const userId in data.members) {
                const userData = data.members[userId];
                if (userData.name === name) {
                    return userData;
                }
            }
            console.error("Error: Receiver not found.");
            return null;
        } else {
            console.error("Error: Account file does not exist.");
            return null;
        }
    } catch (error) {
        console.error("Error reading account data:", error);
        return null;
    }
}
function __user(uid) {
    try {
        if (fs.existsSync(accountPath)) {
            const rawData = fs.readFileSync(accountPath);
            const data = JSON.parse(rawData);
            return data.members[uid];
        } else {
            console.error("Error: Account file does not exist.");
            return null;
        }
    } catch (error) {
        console.error("Error reading account data:", error);
        return null;
    }
}