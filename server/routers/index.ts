import { Express } from "express";
import Capturer from '../utils/Capturer';

const capturer = new Capturer();

// pptr是否正在运行
(global as any).isRunPptr = false;
function router(app: Express) {
    app.get('/', function(req, res, next) {
        return res.render('index');
    });
    app.get('/api-status', function(req, res, next) {
        return res.json({
            isRunning: (global as any).isRunPptr,
        });
    });
    app.post('/api-capture', function(req, res, next) {
        console.log(req.fields);
    });
}

export default router;
