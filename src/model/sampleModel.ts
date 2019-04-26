// sample of a userSchema
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const sampleSchema = new Schema({
    userName: {
        type: String,
        required: 'user name required'
    },
    contactEmail: {
        type: String
    },
    contactPhone: {
        type: Number
    }
});