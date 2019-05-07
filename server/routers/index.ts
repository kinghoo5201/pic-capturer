import { Express } from "express";

function router(app: Express) {
  app.use('/',function(req,res,next){
    return res.render('index');
  });
}

export default router;
