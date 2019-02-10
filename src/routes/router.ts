import * as express from "express";

import { UserCtrl } from '../controllers/sampleCtrl';

export class Router {
    public userController: UserCtrl = new UserCtrl();
    public routes(app : express.Application): void {

        app.route('/user')
            .post(this.userController.createUser)
            .get(this.userController.getUsers);

        app.route('/user/:userId')
            .get(this.userController.getUser)
            .put(this.userController.updateUser)
            .delete(this.userController.deleteUser);
        
        

        app.route('/healthcheck')
            .get((req: express.Request, res: express.Response) => {
                res.status(200).send({
                    message: 'API Healthcheck OK!'
                });
            });
    }
}