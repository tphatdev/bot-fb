module.exports.config = {
    name: 'noti',
    version: '1.0.0',
    credit: 'tphatdev',
    description: 'Noti!',
    usage: ''
}

module.exports.run = function(api, events, client) {
    console.log('Event !')
}
module.exports.onload = function(api, events, args, client) {
    console.log('Noti !');
}