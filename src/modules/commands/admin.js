const fs = require('fs');
const path = require('path');

const accountPath = path.join(__dirname, 'account.json');
const path_setting = path.join(__dirname, 'tyle_game.json');

module.exports.config = {
    name: 'admin',
    version: '1.0.0',
    credit: 'tphatdev',
    description: 'Lệnh admin',
    usage: '!admin',
};
function number_format(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
module.exports.run = function(api, events, args, client) {
    const senderID = events.senderID;
    const cmd = events.body.trim().split(' ')[1];
    const cmd1 = events.body.trim().split(' ')[2];
    const cmd2 = events.body.trim().split(' ')[3];
    const cmd3 = events.body.trim().split(' ')[4];
    console.log('cmd: ',cmd);
    console.log('cmd1: ',cmd1);
    console.log('cmd2: ',cmd2);
    console.log('cmd3: ',cmd3);
    //Kiểm tra admin
    if (senderID != client.config.UID_ADMIN) {
        api.sendMessage({
            body: `Lệnh không tồn tại!!`,
        }, events.threadID, events.messageID);
        return;
    }
    //help admin
    if(!cmd) {
        text = "BOT: Thanhh Phatt\n\nDANH SÁCH LỆNH ADMIN:\n\n[1] [!admin user] - Xem danh sách người chơi\n[2] [!admin +] - Cộng tiền cho người chơi\n[3] [!admin -] - Cộng tiền người chơi\n[4] [!admin game] - Để chỉnh tỷ lệ thắng/thua";
        api.sendMessage(text, events.threadID, events.messageID);
    }
    //Get list user
    if (cmd == "user") {
        const accountData = get_user();
        if (accountData) {
            let message = "▶ 𝐃𝐚𝐧𝐡 𝐬𝐚́𝐜𝐡 𝐭𝐡𝐚̀𝐧𝐡 𝐯𝐢𝐞̂𝐧:\n";
            for (const userId in accountData) {
                const userData = accountData[userId];
                message += `UID: ${userId} - ${userData.name}\n`;
            }
            api.sendMessage({
                body: message,
            }, events.threadID, events.messageID);
        } else {
            api.sendMessage({
                body: "Không thể đọc dữ liệu người dùng từ tệp.",
            }, events.threadID, events.messageID);
        }
    }
    //Cộng tiền cho user
    if (cmd == "+") {
        const userData = __user(cmd1);
        if (!userData) {
            api.sendMessage({
                body: "Không tìm thấy thông tin người dùng !",
            }, events.threadID, events.messageID);
            return;
        }

        const amountToAdd = parseFloat(cmd2); // Lấy số tiền cần nạp từ tham số thứ hai
        if (isNaN(amountToAdd) || amountToAdd <= 0) {
            api.sendMessage({
                body: "Số tiền không hợp lệ !",
            }, events.threadID, events.messageID);
            return;
        }

        userData.sodu += amountToAdd;
        __data(cmd1, userData);

        api.sendMessage({
            body: `Số tiền đã được nạp thành công. Số dư mới của người chơi (${userData.name}) là: ${number_format(userData.sodu)}đ`,
        }, events.threadID, events.messageID);
    }
    //Trừ tiền user
     if (cmd == "-") {
        const userData = __user(cmd1);
        if (!userData) {
            api.sendMessage({
                body: "Không tìm thấy thông tin người dùng !",
            }, events.threadID, events.messageID);
            return;
        }

        const amountToAdd = parseFloat(cmd2);
        if (isNaN(amountToAdd) || amountToAdd <= 0) {
            api.sendMessage({
                body: "Số tiền không hợp lệ !",
            }, events.threadID, events.messageID);
            return;
        }

        userData.sodu -= amountToAdd;
        __data(cmd1, userData);

        api.sendMessage({
            body: `Số tiền đã bị trừ bởi admin. Số dư mới của người chơi (${userData.name}) là: ${number_format(userData.sodu)}đ`,
        }, events.threadID, events.messageID);
    }
    //Chỉnh tỷ lệ game
    if (cmd === "game") {
    const taixiu = __setting('taixiu');
    const chanle = __setting('chanle');
    const sode = __setting('lode');
    if(!cmd1) {
        const setitng_game_text = `>> CÀI ĐẶT GAME 🎮<<\n\n[×] Tài xỉu: \n- Tỷ lệ ra Tài: ${taixiu.tai} %\n- Tỷ lệ ra Xỉu: ${taixiu.xiu} %\n- Tỷ lệ : ${taixiu.tyle}\n\n[×] Chẵn lẻ: \n- Tỷ lệ ra Chẵn: ${chanle.chan} %\n- Tỷ lệ ra Lẻ: ${chanle.le} %\n- Tỷ lệ : ${chanle.tyle}\n\n[×] Lô đề: \n- Tỷ lệ: ${sode.tyle}`;
        api.sendMessage({
            body: setitng_game_text,
        }, events.threadID, events.messageID);
    } else {
        if(cmd1 !== 'taixiu' && cmd1 !== 'chanle' && cmd1 !== 'lode') {
            setitng_game_text = 'Game không có trong danh sách !!';
            api.sendMessage({
                body: setitng_game_text,
            }, events.threadID, events.messageID);
        } else {
            const type = __setting(cmd1);
            if(cmd2 === 'tai' || cmd2 === 'xiu' || cmd2 === 'tyle') {
                type[cmd2] = parseFloat(cmd3); // Cập nhật tỷ lệ mới
                __setdata(cmd1, type); 
                api.sendMessage({
                    body: `Đã cập nhật tỷ lệ ${cmd2} của ${cmd1} thành công.`,
                }, events.threadID, events.messageID);
            } else if(cmd2 === 'chan' || cmd2 === 'le' || cmd2 === 'tyle') {
                type[cmd2] = parseFloat(cmd3); // Cập nhật tỷ lệ mới
                __setdata(cmd1, type); 
                api.sendMessage({
                    body: `Đã cập nhật tỷ lệ ${cmd2} của ${cmd1} thành công.`,
                }, events.threadID, events.messageID);
            } else if(cmd2 === 'tyle') {
                type[cmd2] = parseFloat(cmd3); // Cập nhật tỷ lệ mới
                __setdata(cmd1, type); 
                api.sendMessage({
                    body: `Đã cập nhật tỷ lệ ${cmd2} của ${cmd1} thành công.`,
                }, events.threadID, events.messageID);
            } else {
                api.sendMessage({
                    body: "Không tìm thấy loại cược hoặc tỷ lệ cần cập nhật!",
                }, events.threadID, events.messageID);
            }
        }
    }
    }


};

//dử liệu user
function get_user() {
    try {
        if (fs.existsSync(accountPath)) {
            const rawData = fs.readFileSync(accountPath);
            const data = JSON.parse(rawData);
            return data.members;
        } else {
            console.error("Error: Account file does not exist.");
            return null;
        }
    } catch (error) {
        console.error("Error reading account data:", error);
        return null;
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
//setting
function __setting(type) {
    try {
        if (fs.existsSync(path_setting)) {
            const rawData = fs.readFileSync(path_setting);
            const data = JSON.parse(rawData);
            return data.game[type]; // Thay đổi từ data.game[type] thành data.data[type]
        } else {
            console.error("Error: Account file does not exist.");
            return null;
        }
    } catch (error) {
        console.error("Error reading account data:", error);
        return null;
    }
}
function __setdata(cmd, newData) {
    try {
        const rawData = fs.readFileSync(path_setting);
        const data = JSON.parse(rawData);
        data.game[cmd] = newData;
        fs.writeFileSync(path_setting, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error updating account data:", error);
    }
}

