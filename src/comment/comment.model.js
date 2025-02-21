//Modelo de comentario
import mongoose, { Schema, model } from "mongoose";

const commentSchema = Schema(
    {
        content: {
            type: String,
            maxLength: [200, `Can´t be overcome 200 characters`],
            required: [true, 'Content is required']
        },
        publication: {
            type: Schema.Types.ObjectId,
            ref: 'Publication',
            required: [true, 'Publication is required']
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User is required']
        },
        date: { 
            type: Date, 
            default: Date.now 
        }
    }
)

//Crear y exportar el modelo
export default model('Comment', commentSchema)