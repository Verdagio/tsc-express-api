import * as bodyParser from 'body-parser';
import * as config from 'config';
import * as cors from 'cors';
import * as express from 'express';
import * as mongoose from 'mongoose';

import { Router } from '../routes/router'

const MONGO_URL = `${config.get('Mongo.host')}/${config.get('Mongo.dbname')}`;

class App {

    public app: express.Application;  
    public router : Router = new Router();

    constructor(){
        this.app = express();
        this.conf();
        this.router.routes(this.app);
        this.dbConnect();
    }

    private conf(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(cors());
    }

    private dbConnect(): void{
        mongoose.connect(MONGO_URL, { useNewUrlParser: true });
        const connectionStatus = mongoose.connection;
        connectionStatus.on('connected', ()=>{
            console.log('Connected to mongodb');
        });
    }
}
export default new App().app;