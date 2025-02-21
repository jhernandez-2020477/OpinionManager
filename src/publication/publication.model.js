//Modelo de Publicación
import mongoose, { Schema, model} from "mongoose";

const publicationSchema = Schema(
    {
        title: {
            type: String,
            maxLength: [50, `Can´t be overcome 50 characters`],
            required: [true, 'Title is required']
        },
        content: {
            type: String,
            maxLength: [100, `Can´t be overcome 100 characters`],
            required: [true, 'Content is required']
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required']
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            //required: [true, 'User is required']
        },
        date: { 
            type: Date, 
            default: Date.now 
        }
    }
)

//Crear y exportar el modelo
export default model('Publication', publicationSchema)