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
       
        passport.authenticate('login', async (err, user) => {
            if (err || !user) {
                return res.status(401).send({ status: 'error', message: 'Credenciales inválidas' });
            }
    
            req.session.user = {
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                age: user.age,
                role: 'user'
            };

            const accessToken = generateToken(user);
    
            return res.status(200).send({accessToken, status: 'success', message: 'Inicio de sesión exitoso' });
        })(req, res);
    

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

export default router;