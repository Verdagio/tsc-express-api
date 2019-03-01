import * as bodyParser from 'body-parser';
import * as config from 'config';
import * as cors from 'cors';
import * as express from 'express';
import * as expressOasGenerator from 'express-oas-generator';
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
        expressOasGenerator.init(this.app, {});
        // use for a json file to be output
        // expressOasGenerator.init(this.app, (spec: Object) => {
        //     let dir = './dist'
        //     if(!fs.existsSync(dir)){
        //         fs.mkdirSync(dir);
        //     }
        //     fs.writeFileSync('./dist/swagger.json', JSON.stringify(spec));
        //     return spec;
        // });
    }

    private conf(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(cors());
    }

    private dbConnect(): void{
        mongoose.connect(MONGO_URL, { useNewUrlParser: true });
        mongoose.connection.on('connected', ()=>{
            console.log('Connected to mongodb');
        });
    }
}
export default new App().app;