//Rutas de auntentificación
import { Router } from "express";
import { deleteComment, getAllComments, saveComment, updateComment } from "./comment.controller.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";
import { validSaveComment, validUpdateComment } from "../../helpers/validators.js";

const api = Router()

//Agregar Comentario
api.post(
    '/',
    [
        validateJwt,
        validSaveComment
    ],
    saveComment
)

//Actualizar comentario
api.put(
    '/:id',
    [
        validateJwt,
        validUpdateComment
    ],
    updateComment
)

//Eliminar Comentario
api.delete(
    '/:id',
    [
        validateJwt
    ],
    deleteComment
)

//Listar los comentarios
api.get(
    '/getComments',
    getAllComments
)

//Exportar
export default api