 module.exports = (api, client) => {
    // Kiểm tra và chạy các sự kiện khi client onload
    if (client.onload && client.onload.length > 0) {
        for (let i = 0; i < client.onload.length; i++) {
            if (client.onload[i].onload) {
                client.onload[i].onload(api, client);
            }
        }
    }

    // Thiết lập các tùy chọn cho api
    api.setOptions({ listenEvents: true });

    // Lắng nghe sự kiện MQTT
    api.listenMqtt((err, event) => {
        if (err) {
            console.error('Error listening to MQTT:', err);
            return;
        }

        // Kiểm tra xem client.events đã được khởi tạo và có giá trị không
        if (client.events && client.events.size > 0) {
            // Lặp qua các sự kiện và chạy chúng
            client.events.forEach((value, key) => {
                if (value && value.run) {
                    value.run(api, event, client);
                }
            });
        }

        // Kiểm tra và xử lý event.body
        if (!event || !event.body) return;

        let args = event.body.trim().split(' ');

        // Kiểm tra và chạy các sự kiện noprefix
        if (client.noprefix && client.noprefix.size > 0) {
            let listNoprefix = Array.from(client.noprefix.keys());
            if (listNoprefix.includes(args[0])) {
                let noprefixEvent = client.noprefix.get(args[0]);
                if (noprefixEvent && noprefixEvent.noprefix) {
                    noprefixEvent.noprefix(api, event, args, client);
                }
            }
        }

        // Kiểm tra và chạy các lệnh
        if (event.body.startsWith(client.config.PREFIX)) {
            args = event.body.slice(client.config.PREFIX.length).trim().split(' ');

            if (client.commands && client.commands.size > 0) {
                let listCommands = Array.from(client.commands.keys());
                if (!listCommands.includes(args[0])) {
                    api.sendMessage('Lệnh không tồn tại!', event.threadID, event.messageID);
                    return;
                }
                let command = client.commands.get(args[0]);
                if (command && command.run) {
                    command.run(api, event, args, client);
                }
            }
        }
    });
};
