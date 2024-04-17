const fs = require('fs');
const path = require('path');

const accountPath = path.join(__dirname, 'account.json');

function format_date(timestamp) {
    const date = new Date(timestamp);

    const day = padZero(date.getDate());
    const month = padZero(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const seconds = padZero(date.getSeconds());

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function padZero(num) {
    return num < 10 ? '0' + num : num;
}
function laysocuoi(timestamp) {
    return timestamp % 100;
}
function dich_date(dateTimeStr) {
    const translations = {
        'Monday': 'Thứ hai',
        'Tuesday': 'Thứ ba',
        'Wednesday': 'Thứ tư',
        'Thursday': 'Thứ năm',
        'Friday': 'Thứ sáu',
        'Saturday': 'Thứ bảy',
        'Sunday': 'Chủ nhật',
        'January': 'Tháng một',
        'February': 'Tháng hai',
        'March': 'Tháng ba',
        'April': 'Tháng tư',
        'May': 'Tháng năm',
        'June': 'Tháng sáu',
        'July': 'Tháng bảy',
        'August': 'Tháng tám',
        'September': 'Tháng chín',
        'October': 'Tháng mười',
        'November': 'Tháng mười một',
        'December': 'Tháng mười hai',
        'th': ' tháng',
    };
    // Thay thế các từ trong bảng tra từ
    for (const [key, value] of Object.entries(translations)) {
        dateTimeStr = dateTimeStr.replace(key, value);
    }
    // Thay đổi định dạng tháng/ngày
    const dateParts = dateTimeStr.split('/');
    if (dateParts.length === 3) {
        const [day, month, year] = dateParts;
        dateTimeStr = `${day}${translations['th']} ${month} ${year}`;
    }

    return dateTimeStr;
}


function number_format(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
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

module.exports.config = {
    name: 'sode',
    version: '1.0.0',
    credit: 'tphatdev',
    description: 'Chơi lô đề',
    usage: '!sode [số] [số tiền cược]',
};

module.exports.run = function(api, events, args, client) {
    const senderID = events.senderID;
    const userData = getAccountData(senderID);
    const number = events.body.trim().split(' ')[1];
    const betAmount = events.body.trim().split(' ')[2];
    const sodu = userData.sodu;
    if (!number || isNaN(number) || number < 10 || number > 99) {
        api.sendMessage('Vui lòng nhập một số từ 10 đến 99.', events.threadID, events.messageID);
        return;
    }
    if (!userData) {
        api.sendMessage('Bạn không có trong danh sách thành viên', events.threadID, events.messageID);
        return;
    }

    if (sodu < betAmount) {
        api.sendMessage('Số dư không đủ để cược.', events.threadID, events.messageID);
        return;
    }
    else {
        api.sendMessage(`GAME: Số đề\n[✚] Cược số: ${number}\n[✚] Số tiền cược: ${number_format(betAmount)}đ\n[✚] Số dư: ${userData.sodu !== undefined ? number_format(userData.sodu) : 'undefined'}đ\n[✚] Lượt chơi: ${userData.play}\n[✚] Sau 1 phút nữa sẽ có kết quả !`, events.threadID, events.messageID);
        userData.sodu -= betAmount;
        userData.play += 1;
        api.sendMessage({
            body: "Đang quay số...", 
            attachment: fs.createReadStream(__dirname + "/luutru/quay_sode.gif")
        }, events.threadID, events.messageID);
    setTimeout(() => {
        const timestamp = Date.now(); // Lấy timestamp hiện tại
        const result = laysocuoi(timestamp);
        if (number === result) {
            userData.sodu += betAmount * 11.5;
            userData.win += 1; 
            api.sendMessage({
                    body: `Thông báo kết quả lô đề:\n[✚] Player @${userData.name}\n(${format_date(timestamp)})\nTimestamp: ${timestamp}\nKết quả lấy được: ${result}\nCược số: ${number}\n- Số dư biến đổi: +${userData.sodu !== undefined ? number_format(Math.abs(betAmount * 11.5)) : 'undefined'}đ\n- Số dư: ${userData.sodu !== undefined ? number_format(userData.sodu) : 'undefined'}đ`,
                    mentions: [ { tag: userData.name, id: events.senderID } ],
            }, events.threadID, events.messageID);
        } else {
            userData.lose += 1; // Nếu đoán sai, mất số tiền cược
            api.sendMessage({
                    body: `Thông báo kết quả lô đề:\n[✚] Player @${userData.name}\n(${format_date(timestamp)})\nTimestamp: ${timestamp}\nKết quả lấy được: ${result}\nCược số: ${number}\n- Số dư biến đổi: -${userData.sodu !== undefined ? number_format(Math.abs(betAmount)) : 'undefined'}đ\n- Số dư: ${userData.sodu !== undefined ? number_format(userData.sodu) : 'undefined'}đ`,
                    mentions: [ { tag: userData.name, id: events.senderID } ],
            }, events.threadID, events.messageID);
        }
        updateAccountData(senderID, userData);

    }, 60000);
    }
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

// Hàm cập nhật dữ liệu tài khoản vào account.json
function updateAccountData(userId, newData) {
    try {
        if (fs.existsSync(accountPath)) {
            const rawData = fs.readFileSync(accountPath);
            const data = JSON.parse(rawData);
            data.members[userId] = newData;
            fs.writeFileSync(accountPath, JSON.stringify(data, null, 4));
        } else {
            console.error("Error: Account file does not exist.");
        }
    } catch (error) {
        console.error("Error updating account data:", error);
    }
}
