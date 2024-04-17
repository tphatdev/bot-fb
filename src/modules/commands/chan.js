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
    name: 'chan',
    version: '1.0.0',
    credit: 'tphatdev',
    description: 'Chẵn lẻ!',
    usage: ''
}

module.exports.run = function (api, events, args, client) {
    let amount = events.body.trim().split(' ')[1];
    const userData = getAccountData(events.senderID); // Lấy dữ liệu tài khoản từ account.json
    if (!userData) {
        api.sendMessage("Bạn chưa được thêm vào danh sách thành viên", events.threadID, events.messageID);
        return;
    }
    
    if (isNaN(amount) || amount <= 0 || amount < 1000) {
        api.sendMessage("GAME: Chẵn lẻ\n- Số tiền không hợp lệ\nCược tối thiểu 1000 VNĐ", events.threadID, events.messageID);
    } else if(userData.sodu < amount) {
        api.sendMessage("GAME: Chẵn lẻ\n- Bạn đã cược quá số dư đang có !", events.threadID, events.messageID);
    } else {
        userData.sodu -= amount;
        userData.play += 1;
        
        text = `GAME: Chẵn lẻ\n- Lựa chọn: Chẵn\n- Số tiền cược: ${number_format(amount)}đ\n- Số dư: ${userData.sodu !== undefined ? number_format(userData.sodu) : 'undefined'}đ\n- Lượt chơi: ${userData.play}\n[+] - Sau 5 giây nữa sẽ có kết quả !`;
        api.sendMessage(text, events.threadID, events.messageID);
                setTimeout(() => {
            api.sendMessage('KẾT QUẢ SẼ CÓ SAU 1 GIÂY !', events.threadID, events.messageID);
        }, 4000);
        setTimeout(() => {
            const result = __random(1, 10);
            console.log(result)
            let WinAmount = 0, dice;
            var ketqua;
            if (result == 1 || result == 3 || result == 5 || result == 7 || result == 9) {
                dice = `${result}`;
                ketqua = 'Lẻ';
                WinAmount = amount;
                userData.lose += 1;
            } else if (result == 2 || result == 4 || result == 6 || result == 8 || result == 10) {
                dice = `${result}`;
                ketqua = 'Chẵn';
                WinAmount = amount * 2.5;
                userData.sodu += WinAmount;
                userData.win += 1;
            }

            api.sendMessage({
                body: `KẾT QUẢ CHẴN LẺ:\n[+] - Player: @${userData.name}\n\n- Lựa chọn: Lẻ\n- Kết quả: ${ketqua}\n- Con số: ${dice}\n- Số dư biến đổi: ${ketqua === 'Chẵn' ? '+' : '-'}${userData.sodu !== undefined ? number_format(Math.abs(WinAmount)) : 'undefined'}đ\n- Số dư: ${userData.sodu !== undefined ? number_format(userData.sodu) : 'undefined'}đ`,
                mentions: [ { tag: userData.name, id: events.senderID } ]
            }, events.threadID, events.messageID);
            updateAccountData(events.senderID, userData); // Cập nhật dữ liệu tài khoản vào account.json
        }, 5000);
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
