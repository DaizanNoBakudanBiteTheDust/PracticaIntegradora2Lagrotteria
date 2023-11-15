import {
    Router
} from 'express';
import passport from 'passport';
import usersModel from '../../dao/dbManagers/models/users.models.js';
import {
    createHash,
    isValidPassword
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

router.get('failure-register', async (req, res) => {
    res.status(500).send({
        status: 'error',
        message: 'register failed'
    })
});

router.post('/login', passport.authenticate('login', {
    failureRedirect: 'fail-login'
}), async (req, res) => {
   
    req.session.user = {
        name: 'Admin', // O cualquier otro nombre para el administrador
        email: email,
        role: 'admin'
    };

    if (email === 'adminCoder@coder.com' || password === 'adminCod3r123') {
        return res.send({ status: 'success', message: 'Inicio de sesión como administrador exitoso' });
    }

    if(!req.user) {
        return res.status(401).send({ status: 'error', message: 'invalid credentials' })
    }

    req.session.user = {
        name: `${req.user.first_name} ${req.user.last_name}`,
        email: req.user.email,
        age: req.user.age
    }
    


    res.status(201).send({
        status: 'success',
        message: 'login success'
    });
});

router.get('fail-login', async (req, res) => {
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

export default router;