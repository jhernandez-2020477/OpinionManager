//Lógica de Usuario
import { checkPassword, encrypt} from '../../utils/encrypt.js'
import User from '../user/user.model.js'

//Actualizar Usuario
export const updateUser = async(req, res)=>{
    const { id } = req.params
    const { role, password, ...data} = req.body
    try {
        const adminUser = req.user
        const userToUpdate = await User.findById(id)
        if(!userToUpdate){
            return res.status(404).send(
                {
                    success: false,
                    message: 'User not found, not updated'
                }
            )
        }

        //Un usuario normal solo puede editarse a sí mismo
        if(adminUser.role !== 'ADMIN' && adminUser.uid !== id){
            return res.status(403).send(
                {
                    success: false,
                    message: 'You can only edit your own profile.'
                }
            )
        }

        //Actualizar usuario sin modificar la contraseña ni el rol
        const updatedUser = await User.findByIdAndUpdate(
            id,
            data,
            { new: true}
        )
        return res.send(
            {
                success: true,
                message: 'User updated successfully :)',
                updatedUser
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error when updating User',
                err
            }
        )
    }
}

//Actualizar contraseña
export const updatePassword = async (req, res) => {
    try {
        const { id } = req.params
        const { currentPassword, newPassword } = req.body

        if (id !== req.user.uid) {
            return res.status(403).send(
                {
                    success: false,
                    message: 'You are not authorized to update this password. :('
                }
            )
        }

        const user = await User.findById(id)
        if (!user) return res.status(404).send(
            {
                success: false,
                message: 'User not found'
            }
        )


        const isMatch = await checkPassword(user.password, currentPassword)
        if (!isMatch) return res.status(400).send(
            {
                message: 'Incorrect password',
                success: false
            }
        )

        if (currentPassword === newPassword) {
            return res.status(400).send(
                {
                    success: false,
                    message: 'New password cannot be the same as the current password jeje :) .'
                }
            )
        }

        user.password = await encrypt(newPassword)
        await user.save()

        return res.send(
            {
                success: true,
                message: 'Password updated successfully'
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
            success: false,
            message: 'General error',
            err
            }
        )
    }
}