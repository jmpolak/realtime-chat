const moment = require("moment")
moment.locale("de")

formatMessage = (username, messageText, image = null) => {

    return {
        username,
        messageText,
        time: moment().format('LT'),
        image
    }
}



module.exports = formatMessage