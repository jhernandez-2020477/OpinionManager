//Rutas de auntentificación
import { Router } from "express";
import { saveCategory, updateCategory, getAll, deleteCategory } from "./category.controller.js";
import { validSaveCate, validUpdaCate } from "../../helpers/validators.js";
import { isAdmin, validateJwt } from "../../middlewares/validate.jwt.js";

const api = Router()

//Agregar Categoria
api.post(
    '/save',
    [
        validateJwt,
        isAdmin,
        validSaveCate
    ],
    saveCategory
)

//Editar Categoria
api.put(
    '/:id',
    [
        validateJwt,
        isAdmin,
        validUpdaCate
    ],
    updateCategory
)

//Listar todas las categorias
api.get(
    '/getCategories',
    getAll
)

//Eliminar categoria
api.delete(
    '/:id',
    [
        validateJwt,
        isAdmin
    ],
    deleteCategory
)

//Exportar
export default api
