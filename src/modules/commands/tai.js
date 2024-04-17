const fs = require('fs');
const path = require('path');
const accountPath = path.join(__dirname, 'account.json');

function __random(min, max) {
    const range = max - min + 1;
    const baseRandom = Math.random();
    const extraRandom = Math.random();
    if (extraRandom > 0.5) { // 20% chance for a higher number
        return Math.floor(min + baseRandom * range);
    } else {
        return Math.floor(min + baseRandom * baseRandom * range);
    }
}

function number_format(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports.config = {
    name: 'tai',
    version: '1.0.0',
    credit: 'tphatdev',
    description: 'Tài xỉu!',
    usage: ''
}

module.exports.run = function (api, events, args, client) {
    let amount = events.body.trim().split(' ')[1];
    const userData = getAccountData(events.senderID);
    if (!userData) {
        api.sendMessage("Bạn chưa được thêm vào danh sách thành viên", events.threadID, events.messageID);
        return;
    }
    
    if (isNaN(amount) || amount <= 0 || amount < 1000) {
        api.sendMessage("GAME: Tài Xỉu\n- Số tiền không hợp lệ\nCược tối thiểu 1000 VNĐ", events.threadID, events.messageID);
    } else if(userData.sodu < amount) {
        api.sendMessage("GAME: Tài Xỉu\n- Bạn đã cược quá số dư đang có !", events.threadID, events.messageID);
    } else {
        userData.sodu -= amount;
        userData.play += 1;
        api.sendMessage({
            body: "Đ𝐚𝐧𝐠 𝐥𝐚̆́𝐜 𝐱𝐮́𝐜 𝐱𝐚̆́𝐜 🎲", 
            attachment: fs.createReadStream(__dirname + "/luutru/quay_xx.gif")
        }, events.threadID, events.messageID);
        text = `GAME: Tài Tài\n- Lựa chọn: Tài\n- Số tiền cược: ${number_format(amount)}đ\n- Số dư: ${userData.sodu !== undefined ? number_format(userData.sodu) : 'undefined'}đ\n- Lượt chơi: ${userData.play}\n[+] - Sau 10 giây nữa sẽ có kết quả !`;
        api.sendMessage(text, events.threadID, events.messageID);

        setTimeout(() => {
            const dice1 = __random(1, 6);
            const dice2 = __random(1, 6);
            const dice3 = __random(1, 6);
            const result = dice1 + dice2 + dice3;
            console.log(result)
            let WinAmount = 0;
            var ketqua;
            var dice;
            if (result >= 3 && result <= 10) {
                dice = `${dice1} - ${dice2} - ${dice3}`;
                ketqua = 'Xỉu';
                WinAmount = amount;
                userData.lose += 1;
                console.log(dice)
                console.log(ketqua)
            } else if (result >= 11 && result <= 18) {
                dice = `${dice1} - ${dice2} - ${dice3}`;
                ketqua = 'Tài';
                WinAmount = amount * 1.9;
                userData.sodu += WinAmount;
                userData.win += 1;
                console.log(dice)
                console.log(ketqua)
            }

            api.sendMessage({
                body: `KẾT QUẢ TÀI XỈU:\n[+] - Player: @${userData.name}\n- Lựa chọn: Xỉu\n- Kết quả: ${ketqua}\n- Xúc xắc: ${dice}\n- Số dư biến đổi: ${ketqua === 'Tài' ? '+' : '-'}${userData.sodu !== undefined ? number_format(Math.abs(WinAmount)) : 'undefined'}đ\n- Số dư: ${userData.sodu !== undefined ? number_format(userData.sodu) : 'undefined'}đ`,
                mentions: [ { tag: userData.name, id: events.senderID } ],
            }, events.threadID, events.messageID);
            updateAccountData(events.senderID, userData); // Cập nhật dữ liệu tài khoản vào account.json
        }, 10000);
    }
}


module.exports.onload = function (api, events, args, client) {

}

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

// Hàm cập nhật dữ liệu tài khoản vào account.json
function updateAccountData(userId, newData) {
    try {
        const rawData = fs.readFileSync(accountPath);
        const data = JSON.parse(rawData);
        data.members[userId] = newData;
        fs.writeFileSync(accountPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error updating account data:", error);
    }
}
