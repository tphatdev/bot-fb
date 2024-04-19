const fs = require("fs");
const login = require("facebook-chat-api");
const path = require('path');

const path_setting = path.join(__dirname, '../config.json');

function getAccountData() {
    try {
        if (fs.existsSync(path_setting)) {
            const rawData = fs.readFileSync(path_setting);
            const data = JSON.parse(rawData);
            return data.setting['data'];
        } else {
            console.error("Error: Setting file does not exist.");
            return null;
        }
    } catch (error) {
        console.error("Error reading setting data:", error);
        return null;
    }
}

const setting = getAccountData();

const client = {
    config: setting,
    commands: new Map(),
    events: new Map(),
    noprefix: new Map(),
    onload: new Array()
};

const handlers = ['handlerCommand', 'handlerEvent'];

handlers.forEach(handler => {
    require(`${__dirname}/core/${handler}`)(client);
});

login({appState: JSON.parse(fs.readFileSync(__dirname+'/appstate.json', 'utf8'))}, (err, api) => {
    if (err) return console.error(err);

    require(`${__dirname}/core/listen`)(api, client);
});
