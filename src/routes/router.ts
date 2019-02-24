import * as express from "express";

import { UserCtrl } from '../controllers/sampleCtrl';
import { authCheck } from '../app/middleware';

export class Router {
    public userController: UserCtrl = new UserCtrl();
    public routes(app : express.Application): void {

        app.route('/api/user')
            .post(this.userController.createUser)
            .get(this.userController.getUsers);

        app.route('/api/user/:userId')
            .get(this.userController.getUser)
            .put(authCheck, this.userController.updateUser)
            .delete(authCheck, this.userController.deleteUser);
        
        

        app.route('/healthcheck')
            .get((req: express.Request, res: express.Response) => {
                res.status(200).send({
                    message: 'API Healthcheck OK!'
                });
            });
    }
}