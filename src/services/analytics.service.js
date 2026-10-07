const urlService = require("./url.service");

exports.getAnalytics = async (code) => {
    return await urlService.getAnalytics(code);
};