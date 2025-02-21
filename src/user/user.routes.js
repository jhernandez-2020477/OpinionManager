import { Router } from "express";
import { validateJwt } from "../../middlewares/validate.jwt.js";
import { validUpdateUser,validUpdatePassword } from "../../helpers/validators.js";
import { updateUser, updatePassword } from '../user/user.controller.js'
const api = Router()
//Rutas privadas

//Actualizar Usuario
api.put(
    '/:id',
    [
        validateJwt,
        validUpdateUser
    ],
    updateUser
)

//Actualizar contraseña
api.put(
    '/password/:id',
    [
        validateJwt,
        validUpdatePassword
    ],
    updatePassword
)

//Exportar
export default api
