import {
    fileURLToPath
} from 'url';
import {
    dirname,
    join
} from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

const createHash = password =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    const PRIVATE_KEY = 'coder55575';

//Valida pass
const isValidPassword = (plainPassword, hashedPassword) =>
    bcrypt.compareSync(plainPassword, hashedPassword);

 //generacion de token
 
 const generateToken = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '24h' });
    return token;
}

//midleware
const authToken = (req, res, next) => {
    //1. validamos que el token llegue en los headers del request
    const authToken = req.headers.authorization; 

    if(!authToken) return res.status(401).send({ status: 'error', message: 'not authenticated' });

    const token = authToken.split(' ')[1];
    //2. Validar el jwt
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) return res.status(401).send({ status: 'error',  message: 'not authenticated'});
        req.user = credentials.user;
        next();
    })
}

export {
    __dirname,
    createHash,
    isValidPassword,
    generateToken,
    authToken
};

export const productsFilePath = join(__dirname, "./dao/fileManagers/files/productos.json")
export const cartsFilePath = join(__dirname, "./dao/fileManagers/files/carrito.json");