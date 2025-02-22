//Lógica de publicación
import Publication from '../publication/publication.model.js'
import Category from '../category/category.model.js'
import Comment from '../comment/comment.model.js'
import { populate } from 'dotenv'


//Agregar publicación
export const savePost = async(req, res)=>{
    try {

        const { title, category } = req.body
        let data = req.body
        data.author = req.user.uid

        // Verificar si la categoría existe
        const categoryid = await Category.findById(category)
        if (!categoryid) {
            return res.status(400).send(
                {
                    success: false,
                    message: 'Category not found, cannot save this publication'
                }
            )
        }

         // Verificar si ya existe una publicación con el mismo título
         const existingPublication = await Publication.findOne(
            { 
                title: title 
            }
        )
        if(existingPublication) {
             return res.status(400).send(
                {
                    success: false,
                    message: 'A publication with this title already exists'
                }
            )
        }

        let publication = new Publication(data)
        await publication.save()
        return res.send(
            {
                message: `Save Post successfully, the title is: ${publication.title}`
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'Error creating Post',
                err
            }
        )
    }
}

//Editar Publicación
export const updatePost = async(req, res)=>{
    const { id } = req.params
    const { category, ...data } = req.body
    try {

        // Verificar si la categoría existe
        const categoryid = await Category.findById(category)
        if (!categoryid) {
            return res.status(400).send(
                {
                    success: false,
                    message: 'Category not found, cannot update this publication'
                }
            )
        }
        const publication = await Publication.findById(id)

        if (!publication) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'Publication not found, not updated'
                }
            )
        }

        // Verificar si el usuario autenticado es el autor de la publicación
        if (publication.author.toString() !== req.user.uid) {
            return res.status(403).send(
                {
                    success: false,
                    message: 'You are not authorized to update this post'
                }
            )
        }
        const updatePubli = await Publication.findByIdAndUpdate(
            id,
            {data, category: category},
            { new: true }
        )
        return res.send(
            {
                success: true,
                message: 'Publication updated successfully :)',
                updatePubli
            }
        )
        
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General Error when updating this Publication',
                err
            }
        )
    }
}

//Eliminar Publicación
export const deletePost = async(req, res)=>{
    const { id } = req.params
    const { ...data } = req.body
    try {
        const publication = await Publication.findById(id)
        if(!publication){
            return res.status(404).send(
                {
                    success: false,
                    message: 'Publication not found, not deleted'
                }
            )
        }

        //Verificamos que sea el autor o Admin
        if(publication.author.toString() !== req.user.uid && req.user.role !== 'ADMIN'){
            return res.status(403).send(
                {
                    success: false,
                    message: 'You are not authorized to delete this post'
                }
            )
        }

        // // Eliminar los comentarios asociados a la publicación
        await Comment.deleteMany({ publication: id })

        //Eliminar la Publicación
        await Publication.findByIdAndDelete(id)
        return res.send(
            {
                success: true,
                message: 'Publication deleted successfully :)',
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General Error when deleting this Publication',
                err
            }
        )
    }
}

//Listar todas las publicaciones
export const getAllPublications = async(req, res) => {
    const { limit, skip } = req.query
    try {
        const publications = await Publication.find()
            .skip(skip)
            .limit(limit)
            .populate(
                {
                    path: 'category',
                    select: 'name description -_id'
                }
            )
            .populate(
                {
                    path: 'author',
                    select: 'name surname -_id'
                }      
            )
            .populate(
                {
                    path: 'comments',
                    select: 'content author -_id',
                    populate: {
                        path: 'author', 
                        select: 'name surname -_id'
                    }
                }      
            )

        if (publications.length === 0) {
            return res.send(
                {
                    success: false,
                    message: 'Publications not found :('
                }
            )
        }

        return res.send(
            {
                success: true,
                message: 'Publications found :)',
                total: publications.length,
                publications
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General Error',
                err
            }
        )
    }
}

//Buscar Publicación por nombre
export const getPostByName = async(req, res)=>{
    const { title } = req.params
    try {
        const publication = await Publication.find(
            {
                title: { $regex: title, $options: 'i'}
            }
        )
        .populate(
            {
                path: 'category',
                select: 'name description -_id'
            }
        )
        .populate(
            {
                path: 'author',
                select: 'name surname -_id'
            }      
        )
        .populate(
            {
                path: 'comments',
                select: 'content author -_id',
                populate: {
                    path: 'author', 
                    select: 'name surname -_id'
                }
            }      
        )
        if(publication.length === 0){
            return res.status(404).send(
                {
                    success: false,
                    message: 'No publications found with that title.'
                }
            )
        }
        return res.send(
            {
                success: true,
                message: 'Publication(s) found.',
                publications: publication
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General Error',
                err
            }
        )
    }
}
