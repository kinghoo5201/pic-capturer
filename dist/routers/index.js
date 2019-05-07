"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function router(app) {
    app.use('/', function (req, res, next) {
        return res.render('index');
    });
}
exports.default = router;
