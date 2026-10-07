const urlService = require("./url.service");

exports.redirectUrl = async (code) => {
    return await urlService.getOriginalUrl(code);
};