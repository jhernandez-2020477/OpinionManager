//Lógica de Categoria
import Category from '../category/category.model.js'
import Publication from '../publication/publication.model.js'

//Crear categoria por defecto
export const initCategory = async(req, res) => {
    try {
        // Verificar si ya existe una categoria con ese nombre
        let defaultCate = await Category.findOne(
            { 
                name: 'Category Default' 
            }
        )
        
        if (!defaultCate) {
            const categoryData = {
                name: 'Category Default',
                description: 'Esta es una categoria que engloba todas las demás'
            }

            let newCategory = new Category(categoryData)
            await newCategory.save();
            
            console.log('Category created successfully!')
        } else {
            //console.log('Category already exists!')
        }
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                message: 'Error creating Default Category', 
                err
            }
        )
    }
}


//Crear Categoria
export const saveCategory = async(req, res)=>{
    try {
        let data = req.body
        let category = new Category(data)
        await category.save()
        return res.send(
            {
                message: `Category added successfully, the category added was: ${category.name}`
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                message: 'General Error creating Category',
                err
            }
        )
    }
}

//Editar categoria
export const updateCategory = async(req, res) => {
    const { id } = req.params
    const { ...data } = req.body 
    try {

        const updateCate = await Category.findByIdAndUpdate(
            id,
            data,
            { new: true }
        )
        
        if (!updateCate) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'Category not found, not updated'
                }
            )
        }

        return res.send(
            {
                success: true,
                message: 'Category updated successfully :)',
                updateCate
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error when adding Category',
                err
            }
        )
    }
}

//Eliminar categoria
export const deleteCategory = async(req, res) => {
    const { id } = req.params
    
    try {
        let defaultCate = await Category.findOne(
            {
                name: 'Category Default' 
            }
        )
        
        if (!defaultCate) {
            return res.status(404).send(
                {
                    message: 'Default category not found'
                }
            )
        }

        // Buscar las publicaciones que tienen la categoría a eliminar
        let postsToUpdate = await Publication.find(
            { 
                category: id 
            }
        )

        // Si hay publicaciones, actualizamos su categoría a la categoría por defecto
        if (postsToUpdate.length > 0) {
            await Publication.updateMany(
                { category: id },
                { $set: { category: defaultCate._id } }
            )
            console.log(`${postsToUpdate.length} posts updated to default category`);
        }

        // Eliminar la categoría
        let deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).send(
                {
                    message: 'Category not found to delete'
                }
            )
        }

        return res.send(
            {
                success: true,
                message: 'Category deleted successfully, and posts updated to default category'
            }
        )
    } catch (err) {
        console.error(err);
        return res.status(500).send(
            {
                success: false,
                message: 'Error deleting category',
                err
            }
        )
    }
}

//Obtener todas las categorias
export const getAll = async(req, res)=>{
    const { limit, skip } = req.query
    try {
        const categories = await Category.find()
            .skip(skip)
            .limit(limit)
        if(categories.length === 0){
            return res.send(
                {
                    success: false,
                    message: 'Categories not found :('
                }
            )
        }
        return res.send(
            {
                success: true,
                message: 'Categories found :)',
                total: categories.length,
                categories
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

