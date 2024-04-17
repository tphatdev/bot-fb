const fs = require('fs');
const path = require('path');

const accountPath = path.join(__dirname, 'account.json');

module.exports.config = {
    name: 'dangky',
    version: '1.0.0',
    credit: 'tphatdev',
    description: 'Đăng ký tài khoản',
    usage: '!dangky',
};

module.exports.run = function(api, events, args, client) {
    const senderID = events.senderID;
    const name = events.body.trim().split('_')[1];
    const usdata = getAccountData(events.senderID);

    if (!name) {
        api.sendMessage({
            body: `Cách đăng ký tài khoản:\n!dangky _tên facebook\n **Lưu ý: phải nhập đúng với tên của facebook!`,
        }, events.threadID, events.messageID);
        return;
    }

    if (name.length < 12 || name.length >= 20) {
        api.sendMessage({
            body: `Tên phải lớn hơn 12 ký tự và nhỏ hơn 20 ký tự!!`,
        }, events.threadID, events.messageID);
        return;
    }

    const userData = {
        name: name,
        play: 0,
        win: 0,
        lose: 0,
        sodu: 10000000
    };

    if (fs.existsSync(accountPath)) {
        try {
            const rawData = fs.readFileSync(accountPath);
            const data = JSON.parse(rawData);

            if (data.members[senderID]) {
                api.sendMessage(`Bạn đã có trong danh sách!`, events.threadID, events.messageID);
            } else {
                data.members[senderID] = userData;
                fs.writeFileSync(accountPath, JSON.stringify(data, null, 4));
                api.sendMessage(`Đăng ký tài khoản thành công!`, events.threadID, events.messageID);
                api.sendMessage({
                    body: `𝙏𝙝à𝙣𝙝 𝙘ô𝙣𝙜:\n[✚] Player: @${name}\n[✚] Số dư: +10,000,000đ\n[✚] !𝗵𝗲𝗹𝗽 đ𝗲̂̉ 𝘅𝗲𝗺 𝘁𝗮̂́𝘁 𝗰𝗮̉ 𝗹𝗲̣̂𝗻𝗵 `,
                    mentions: [{ tag: name, id: senderID }]
                }, events.threadID, events.messageID);
            }
        } catch (error) {
            console.error("Error reading or writing account data:", error);
            api.sendMessage(`Đã xảy ra lỗi khi đăng ký tài khoản.`, events.threadID, events.messageID);
        }
    } else {
        console.error("Error: Account file does not exist.");
        api.sendMessage(`Đã xảy ra lỗi khi đăng ký tài khoản.`, events.threadID, events.messageID);
    }
};

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