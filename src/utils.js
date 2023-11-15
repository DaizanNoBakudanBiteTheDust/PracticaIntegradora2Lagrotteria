import {
    fileURLToPath
} from 'url';
import {
    dirname,
    join
} from 'path';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

const createHash = password =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(10));


//Valida pass
const isValidPassword = (plainPassword, hashedPassword) =>
    bcrypt.compareSync(plainPassword, hashedPassword);

export {
    __dirname,
    createHash,
    isValidPassword
};

export const productsFilePath = join(__dirname, "./dao/fileManagers/files/productos.json")
export const cartsFilePath = join(__dirname, "./dao/fileManagers/files/carrito.json");