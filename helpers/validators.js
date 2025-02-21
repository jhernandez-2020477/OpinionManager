import { body } from "express-validator"; //Capturar todo el body de la solicitud
import { validateErrors , validateErrorWithoutImg} from "./validate.error.js";
import { existUsername, existEmail } from "./db.validators.js";

export const registerValidation = [
    body('name', 'Name cannot be empty')
        .notEmpty(),
    body('surname', 'Surname cannot be empty')
        .notEmpty(),
    body('username', 'Username cannot be empty')
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('email', 'Email cannot be empty or is not a valid email')
        .notEmpty()
        .isEmail()
        .custom(existEmail),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('Password must be strong')
        .isLength({min: 8}),
    validateErrors
]

//Validacines del login
export const loginValidation = [
    body('userLoggin', 'Username or Email cannot be empty')
        .notEmpty()
        .isLowercase(),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .isLength()
        .withMessage('The password must be strong')
        .isLength({min: 8}),
    validateErrorWithoutImg
]

//Usuario
export const validUpdateUser = [
    body('name', 'Name cannot be empty')
        .optional(),
    body('surname', 'Surname cannot be empty')
        .optional(),
    body('username', 'Username cannot be empty')
        .optional()
        .toLowerCase()
        .custom(existUsername),
    body('email', 'Email cannot be empty or is not a valid email')
        .optional()
        .isEmail()
        .custom(existEmail)
        .withMessage('Email is already taken'),
        validateErrorWithoutImg
]

//Actualizar contraseña
export const validUpdatePassword = [
    body('currentPassword', 'Current password cannot be empty')
        .notEmpty() 
        .withMessage('Password cannot be empty'),
    body('newPassword', 'New password cannot be empty')
        .notEmpty()
        .withMessage('Your new password cannot be empty')
        .isStrongPassword()
        .withMessage('Your new password must be strong')
        .isLength({ min: 8 }) 
        .withMessage('New password must be at least 8 characters long'),
        validateErrorWithoutImg
]

//CATEGORIA
export const validSaveCate = [
    body('name', 'Name cannot be empty')
        .notEmpty() 
        .isLength({ max: 50 })
        .withMessage('Can´t be overcome 50 characters'),
    body('description', 'Description cannot be empty')
        .notEmpty()
        .isLength({ max: 100 })
        .withMessage('Can´t be overcome 50 characters'),       
        validateErrorWithoutImg
]

export const validUpdaCate = [
    body('name', 'Name is optional')
        .optional() 
        .isLength({ max: 50 })
        .withMessage('Can´t be overcome 50 characters'),
    body('description', 'Description is optional')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Can´t be overcome 50 characters'),       
        validateErrorWithoutImg
]

//PUBLICACIÓN
export const validSavePost = [
    body('title', 'Title cannot be empty')
        .notEmpty() 
        .isLength({ max: 50 })
        .withMessage('Can´t be overcome 50 characters'),
    body('content', 'Content cannot be empty')
        .notEmpty()
        .isLength({ max: 100 })
        .withMessage('Can´t be overcome 50 characters'), 
    body('category', 'Category cannot be empty')
        .notEmpty(),       
        validateErrorWithoutImg
]

export const validUpdatePost = [
    body('title', 'Title is optional')
        .optional() 
        .isLength({ max: 50 })
        .withMessage('Can´t be overcome 50 characters'),
    body('content', 'Content is optional')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Can´t be overcome 50 characters'), 
    body('category', 'Category is optional')
        .optional(),       
        validateErrorWithoutImg
]

//COMENTARIOS

export const validSaveComment = [
    body('content', 'Content cannot be empty')
        .notEmpty() 
        .isLength({ max: 200 })
        .withMessage('Can´t be overcome 200 characters'),
    body('publication', 'Publication cannot be empty')
        .notEmpty(),      
        validateErrorWithoutImg
]

export const validUpdateComment = [
    body('content', 'Content cannot be empty')
        .optional() 
        .isLength({ max: 200 })
        .withMessage('Can´t be overcome 200 characters'),
    body('publication', 'Publication cannot be empty')
        .optional(),      
        validateErrorWithoutImg
]