import {
    Router
} from 'express';
import passport from 'passport';
import usersModel from '../../dao/dbManagers/models/users.models.js';
import {
    createHash,
    isValidPassword,
    generateToken
} from '../../utils.js';

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
        const { email, password } = req.body;

        if (email === 'adminCoder@coder.com' || password === 'adminCod3r123') {
            req.session.user = {
                name: 'Admin', // O cualquier otro nombre para el administrador
                email: email,
                role: 'admin'
            };

            return res.send({ status: 'success', message: 'Inicio de sesión como administrador exitoso' });
        }
       
        const user = await usersModel.findOne({ email: email });

        //generar el jwt
        const { password: _, ...userResult } = user;
        const accessToken = generateToken(userResult);    
        res.cookie('coderCookieToken', accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }).send({ status: 'success', message: 'login success' })

});


router.get('/fail-login', async (req, res) => {
    res.status(500).send({
        status: 'error',
        message: 'login failed'
    })
});

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) return res.status(500).send({
            status: 'error',
            message: error.message
        });
        res.redirect('/');
    })
})

router.get('/github', passport.authenticate('github', {scope: ['user:email']}), async(req, res) => {
    res.send({ status: 'success', message: 'user registered' });
});

router.get('/github-callback', passport.authenticate('github', { failureRedirect: '/login' }), async(req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Si el middleware de autenticación JWT pasa, req.user contendrá la información del usuario extraída del token
    res.status(200).json({ user: req.user });
});

export default router;