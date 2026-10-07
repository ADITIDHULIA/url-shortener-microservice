// Responsibilities:
// 1. Receive HTTP inputs
// 2. Call service
// 3. Return response

const urlService = require("../services/url.service");
const redirectService = require("../services/redirect.service");
const analyticsService = require("../services/analytics.service");

// PORT /shorten
exports.shortenUrl = async (req, res, next) => {
    try {
        const result = await 
        urlService.createShortUrl(req.body.originalUrl);
        res.json(result);
    } catch (error) {
        next(error);
    }
}


// GET /:code
exports.redirectUrl = async (req, res, next) => {
    try {
        const original = await redirectService.redirectUrl(req.params.code);
        res.redirect(original);
    } catch (error) {
        next(error);
    }
};

exports.getAnalytics = async (req, res, next) => {
    try {
        const data = await analyticsService.getAnalytics(req.params.code);

        if (!data) {
            return res.status(404).json({
                message: "URL not found"
            });
        }

        res.json({
            shortCode: data.shortCode,
            originalUrl: data.originalUrl,
            clickCount: data.clickCount,
            createdAt: data.createdAt,
            lastAccessedAt: data.lastAccessedAt
        });
    } catch (error) {
        next(error);
    }
};