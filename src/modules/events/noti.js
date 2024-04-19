module.exports.config = {
    name: 'noti',
    version: '1.0.0',
    credit: 'tphatdev',
    description: 'Noti!',
    usage: ''
}
function loc_text(text, keywords) {
    const words = text.toLowerCase().split(/\s+/);
    const filteredKeywords = words.filter(word => keywords.includes(word));

    return filteredKeywords;
}

const keywords = ['cặc', 'cac', 'cc', 'lol', 'lon', 'lồn', 'đụ', 'má', 'duma', 'đuma', 'đỉ mẹ', 'dit', 'địt', 'đỉ mẹ', 'di me', 'di me may', 'đỉ mẹ', 'đĩ mẹ', 'bot lồn', 'bot lol', 'vãi lol', 'vãi lồn', 'vãi lol', 'ngu', 'haha','?','con mẹ','chó', 'đỉ', 'đĩ', 'đỉn','đĩn', 'mẹ nó', 'mẹ mày', 'conmemay', 'km','chim','thg cha','thk cha','thằng cha', 'gái mẹ','cặc ba', 'clmm','dmm','dm','dcm','oki', 'uki', 'chịch', 'đụ', 'chjch'];

module.exports.run = function(api, events, client) {
    if (!events.body) {
        return;
    }
    const loc_keywords = loc_text(events.body, keywords);
    if (loc_keywords.includes('ngu')) {
        api.sendMessage("Ngu cái lồn mẹ mầy chứ ngu", events.threadID, events.messageID);
        return;
    }else if (loc_keywords.includes('haha')) {
        api.sendMessage("Cười cái con đỉ mẹ của mầy", events.threadID, events.messageID);
        return;
    }else if (loc_keywords.includes('?')) {
        api.sendMessage("? cái lồn má của mầy hả địt con mẹ mầy", events.threadID, events.messageID);
        return;
    }else if (loc_keywords.includes('oki') || loc_keywords.includes('uki')) {
        api.sendMessage("??", events.threadID, events.messageID);
        api.sendMessage("oki??", events.threadID, events.messageID);
        api.sendMessage("mày gay à?", events.threadID, events.messageID);
        return;
    }else if(loc_keywords == loc_keywords){
            if(loc_keywords != '' || !loc_keywords) {
                api.sendMessage("Hạn chế chửi thề đi cái địt con mẹ mầy mất văn hóa !!", events.threadID, events.messageID);
            }
    }
}


module.exports.onload = function(api, events, args, client) {
    console.log('Noti !');
}