//Lógica de comentario
import Comment from '../comment/comment.model.js'
import Publication from '../publication/publication.model.js'

//Agregar Comentario
export const saveComment = async(req, res)=>{
    try {

        const { publication } = req.body
        let data = req.body
        data.author = req.user.uid
        let comment = new Comment(data)

        //Verificar si la publicación existe
        const publicationId = await Publication.findById(publication)
        if(!publicationId){
            return res.status(400).send(
                {
                    success: false,
                    message: 'Publication not found, cannot save this Comment'
                }
            )
        }
        
        await comment.save()
        publicationId.comments.push(comment._id);  // Añadir el ID del comentario al array
        await publicationId.save();  // Guardar la publicación actualizada


        return res.send(
            {
                message: `Save Comment successfully`
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'Error creating Comment',
                err
            }
        )
    }
}

//Editar Comentario
export const updateComment = async(req, res)=>{
    const { id } = req.params
    const { publication, ...data } = req.body
    try {
        //Verificar si la publicación existe
        const publicationId = await Publication.findById(publication)
        if(!publicationId){
            return res.status(400).send(
                {
                    success: false,
                    message: 'Publication not found, cannot update this Comment'
                }
            )
        }
        const comment = await Comment.findById(id)
        if(!comment){
            return res.status(404).send(
                {
                    success: false,
                    message: 'Comment not found, not updated'
                }
            )
        }
        //Verificamos que sea usuario auntenticado y puede editar
        if(comment.author.toString() !== req.user.uid){
            return res.status(403).send(
                {
                    success: false,
                    message: 'You are not authorized to update this comment'
                }
            )
        }
        const updateCom = await Comment.findByIdAndUpdate(
            id,
            { ...data, publication: publication },
            { new: true }
        )
        return res.send(
            {
                success: true,
                message: 'Comment updated successfully ;)',
                updateCom
            }
        )

    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General Error when updating this Comment',
                err
            }
        )
    }
}

//Eliminar Comentario
export const deleteComment = async(req, res)=>{
    const { id } = req.params
    const { ...data } = req.body
    try {
        const comment = await Comment.findById(id)
        if(!comment){
            return res.status(404).send(
                {
                    success: false,
                    message: 'Comment not found, not deleted'
                }
            )
        }
        //Verificamos que sea el autor
        if(comment.author.toString() !== req.user.uid && req.user.role !== 'ADMIN'){
            return res.status(403).send(
                {
                    success: false,
                    message: 'You are not authorized to delete this comment'
                }
            )
        }
        //Eliminar el comentario
        await Comment.findByIdAndDelete(id)
        return res.send(
            {
                success: true,
                message: 'Comment deleted successfully :)'
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General Error when deleting this Comment',
                err
            }
        )
    }
}

//Obtener todos los comentarios
export const getAllComments = async(req, res) => {
    const { limit, skip } = req.query
    try {
        const comments = await Comment.find()
            .skip(skip)
            .limit(limit)
            .populate(
                {
                    path: 'publication',
                    select: 'title content -_id'
                }
            )
            .populate(
                {
                    path: 'author',
                    select: 'name surname -_id'
                }      
            )

        if (comments.length === 0) {
            return res.send(
                {
                    success: false,
                    message: 'Comments not found :('
                }
            )
        }

        return res.send(
            {
                success: true,
                message: 'Comments found :)',
                total: comments.length,
                comments
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
