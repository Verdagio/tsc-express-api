import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as expressOasGenerator from 'express-oas-generator';

import { Router } from '../routes/router'

class App {

    public app: express.Application;
    public router: Router = new Router();

    constructor() {
        this.app = express();
        this.conf();
        this.router.routes(this.app);
        expressOasGenerator.init(this.app, {});
    }

    private conf(): void {
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
}
export default new App().app;