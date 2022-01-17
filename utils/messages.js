const moment = require("moment")
moment.locale("de")

formatMessage = (username, messageText) => {

    return {
        username,
        messageText,
        time: moment().format('LT')
    }
}



module.exports = formatMessage