import  usersModel from "./models/users.models.js";

export default class Users {
    constructor() {
        console.log('Working users with DB');
    }

    getByEmail = async(email) => {
        const user = await usersModel.findOne({ email }).lean();
        return user;
    }

    save = async(user) => {
        const result = await usersModel.create(user);
        return result; 
    }

    addToCartUser = async (userId, productId) => {
        try {
            const user = await usersModel.findById(userId);
            if (!user) {
                console.error('Usuario no encontrado');
                return; // En lugar de lanzar un error, simplemente salimos de la función
            }
    
            // Verificar si el usuario tiene un carrito asociado
            if (!user.carts || user.carts.length === 0) {
                console.error('Usuario no tiene un carrito asociado');
                return; // También aquí salimos de la función en caso de que no haya carrito
            }
    
            // Tomar el primer carrito del usuario
            const userCart = user.carts[0].cart;
            console.log(userCart);
    
            // Agregar el producto al carrito del usuario
            userCart.products.push(productId);
    
            // Guardar el usuario para reflejar los cambios en el carrito
            await user.save();
        } catch (error) {
            console.error('Error al agregar producto al carrito del usuario:', error);
            // Si hay un error, lo registramos pero no detenemos el flujo de inicio de sesión
        }
    }
} 