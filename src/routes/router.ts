import * as express from "express";


export class Router {
    public routes(app : express.Application): void {
        app.route('/healthcheck')
            .get((req: express.Request, res: express.Response) => {
                res.status(200).send({
                    message: 'API Healthcheck OK!'
                });
            });
    }
}