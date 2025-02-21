//Configuraciones del servidor de express

'use strict'
//ECModules
import express from "express"
import morgan from "morgan"
import helmet from "helmet"
import cors from 'cors'
import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from '../src/user/user.routes.js'
import categoryRoutes from '../src/category/category.routes.js'
import publicationRoutes from '../src/publication/publication.routes.js'
import commentRoutes from '../src/comment/comment.routes.js'
import { limiter } from '../middlewares/rate.limit.js'

const configs = (app)=>{
    app.use(express.json()) //Aceptar y enviar datos JSON
    app.use(express.urlencoded({extended: false})) //No encriptar
    app.use(cors())
    app.use(helmet())
    app.use(limiter)
    app.use(morgan('dev'))
}

const routes = (app)=>{
    //Rutas públicas
    app.use(authRoutes)
    app.use(categoryRoutes)
    app.use(publicationRoutes)
    app.use(commentRoutes)

    //Rutas privadas
    //Usuario
    app.use('/v1/user', userRoutes)

    //Categorias
    app.use('/v1/category', categoryRoutes)

    //Publicaciones
    app.use('/v1/post', publicationRoutes)

    //Comentarios
    app.use('/v1/comment', commentRoutes)
}

export const initServer = async()=>{
    const app = express()
    try {
        configs(app)
        routes(app)
        app.listen(process.env.PORT)
        console.log(`Server running in port ${process.env.PORT}`)
    } catch (err) {
        console.error('Server init failed', err)
    }
}