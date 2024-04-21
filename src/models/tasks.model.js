import mongoose, {Schema} from "mongoose";

const taskSchema = new Schema({
    task: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

export const Task = mongoose.model('Task', taskSchema)