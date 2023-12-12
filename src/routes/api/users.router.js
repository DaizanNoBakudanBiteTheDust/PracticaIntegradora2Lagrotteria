import {
    Router
} from 'express';
import passport from 'passport';
import {
    createHash,
    isValidPassword,
    generateToken
} from '../../utils.js';
import Users from '../../dao/dbManagers/users.manager.js';
import Carts from '../../dao/dbManagers/cart.manager.js';

const manager = new Users();
const cartManager = new Carts();


const router = Router();

router.post('/register', passport.authenticate('register', {
    failureRedirect: 'fail-register'
}), async (req, res) => {
    res.status(201).send({
        status: 'success',
        message: 'user registered'
    });
});

router.get('/fail-register', async (req, res) => {
    res.status(500).send({
        status: 'error',
        message: 'register failed'
    })
});


const adminUser = {
    email: 'adminCoder@coder.com',
    password: 'adminCod3r123'
};


router.post('/login', async (req, res) => {
    const {
        email,
        password
    } = req.body;

    if (email === 'adminCoder@coder.com' || password === 'adminCod3r123') {
        req.user = {
            name: 'Admin', // O cualquier otro nombre para el administrador
            email: email,
            role: 'admin'
        };

        return res.send({
            status: 'success',
            message: 'Inicio de sesión como administrador exitoso'
        });
    }

    const user = await manager.getByEmail(email);
    console.log(user);

    if (!user.carts || user.carts.length === 0) {
        // Si el usuario no tiene un carrito, crea uno nuevo
        let cart = await cartManager.save({ userId: user._id });

        let userCart =  cart._id;
        console.log(userCart)
        // Agrega el carrito recién creado al usuario

        await manager.addCartToUser(user._id, userCart);
    }

    


    //generar el jwt
    const {
        password: _,
        ...userResult
    } = user;
    const accessToken = generateToken(userResult);
    res.cookie('coderCookieToken', accessToken, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true
    }).send({
        accessToken,
        status: 'success',
        message: 'login success'
    })
});


router.get('/fail-login', async (req, res) => {
    res.status(500).send({
        status: 'error',
        message: 'login failed'
    })
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error interno del servidor');
        }
        res.clearCookie('connect.sid');
        res.clearCookie('coderCookieToken');
        res.redirect('/login'); // Redirige a donde quieras después del logout
    });
});


router.get('/:uid', async (req, res) => {
    console.log(req.params);
    res.send(req.params);
});

router.get('/github', passport.authenticate('github', {
    scope: ['user:email']
}), async (req, res) => {
    res.send({
        status: 'success',
        message: 'user registered'
    });
});

router.get('/github-callback', passport.authenticate('github', {
    failureRedirect: '/login',
    scope: ['user:email']
}), async (req, res) => {
    try {
        const user = req.user;
        const {
            password: _,
            ...userResult
        } = user;
        const accessToken = generateToken(userResult);
        res.cookie('coderCookieToken', accessToken, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true
        }).send({
            accessToken,
            status: 'success',
            message: 'login success'
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Hubo un error al procesar la autenticación'
        });
    }

});

router.get('/current', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    // Si el middleware de autenticación JWT pasa, req.user contendrá la información del usuario extraída del token
    res.status(200).json({
        user: req.user
    });
});

export default router;