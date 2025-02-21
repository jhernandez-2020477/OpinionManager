//Rutas de auntentificación
import { Router } from "express";
import { deletePost, getAllPublications, savePost, updatePost } from "./publication.controller.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";
import { validSavePost, validUpdatePost } from "../../helpers/validators.js";

const api = Router()

//Agregar Publicación
api.post(
    '/',
    [
        validateJwt,
        validSavePost
    ],
    savePost
)

//Actualizar Publicación
api.put(
    '/:id',
    [
        validateJwt,
        validUpdatePost
    ],
    updatePost  
)

//Eliminar Publicación
api.delete(
    '/:id',
    [
        validateJwt
    ],
    deletePost
)

//Listar las publicaciones
api.get(
    '/getPublications',
    getAllPublications
)
//Exportar
export default api