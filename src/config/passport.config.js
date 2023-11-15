import passport from 'passport';
import local from 'passport-local';
import usersModel from '../dao/dbManagers/models/users.models.js';
import { createHash, isValidPassword } from '../utils.js';


//local
const localStrategy = local.Strategy;

const initializePassport = () => {
    //registro
    passport.use('register', new localStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async(req, username, password, done) => {
        try {
            const { first_name, last_name, age } = req.body;
            const user = await usersModel.findOne({ email: username });
            
            if(user){
                return done(null. false)
            }

            const userToSave ={
                first_name,
                last_name,
                email: username,
                age,
                password: createHash(password)
            }

            const result = await usersModel.create(userToSave);

            return done(null, result);

        } catch (error) {
            
            return done('incorrect credentials');

        }
    }));
    
    passport.use('login', new localStrategy({
        usernameField: 'email'
    }, async(username, password, done) => {
        try {
            const user = await usersModel.findOne({ email: username});
            if(!user || !isValidPassword(password, user.password)){
                return done(null. false)
            }

            return done(null, user);

        } catch (error) {
            
            return done('incorrect credentials');

        }
    })) 

    //serializacion

    passport.serializeUser((user, done) => {
        done(null, user_id);
    })

    passport.deserializeUser(async(id, done) => {
        const user = await usersModel.findById(id);
        done(null, user);
        
    })
}

export {initializePassport};