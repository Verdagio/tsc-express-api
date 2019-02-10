// Sample controller for sampleModel
import * as mongoose from 'mongoose';

import { sampleSchema } from '../model/sampleModel';
import { Request, Response } from 'express';

const User = mongoose.model('User', sampleSchema);

export class UserCtrl {
    
    public createUser (req: Request, res: Response) {
        console.log(req);
        let newUser = new User(req.body);
        newUser.save((e: Error, user: object) => {
            if(e){
                res.send(e);
            }
            res.json(user);
        });
    }// creates new user

    public getUsers (req: Request, res: Response) {
        User.find({}, (e: Error, user: object) => {
            if(e){
                res.send(e);
            }
            res.json(user);
        });
    }// gets all users

    public getUser (req: Request, res: Response){
        User.findById(req.params.userId, (e: Error, user: object) => {
            if(e){
                res.send(e);
            }
            res.json(user);
        });
    }// get user by id

    public updateUser (req: Request, res: Response){
        User.findOneAndUpdate({_id: req.params.userId}, req.body, {new: true}, (e , user) =>{
            if(e){
                res.send(e);
            }
            res.json(user);
        });
    }// update user by id

    public deleteUser (req: Request, res: Response){
        User.remove({_id: req.params.userId}, (e) => {
            if(e){
                res.send(e);
            }
            res.json({message: `Successfully deleted user with id: ${req.params.id}`});
        });
    }

}