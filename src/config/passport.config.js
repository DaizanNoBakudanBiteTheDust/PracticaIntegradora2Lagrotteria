import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import jwt from 'passport-jwt';
import usersModel from '../dao/dbManagers/models/users.models.js';
import { createHash, isValidPassword } from '../utils.js';
import {passportStrategiesEnum, accessRolesEnum} from '../config/enums.js';
import {PRIVATE_KEY_JWT} from '../config/constants.js';

// estrategia JWT
const JWTSrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
    //registro
    passport.use('github', new GitHubStrategy({
        clientID:  'Iv1.da29b1c177ee2618',
        clientSecret: '0f8c0a891165fcb2a006b0ea1c5f443478e15fba',
        callbackURL: 'http://localhost:8080/api/sessions/github-callback',
        scope:['user:email']
    }, async(accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
           
            const email = profile.emails[0].value;
            const user = await usersModel.findOne({ email });

            if(!user){
                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 18,
                    email,
                    password: ''
                }

                const result = await usersModel.create(newUser);
            return done(null, result);
            }else{
                return done(null, user)
            }         
        } catch (error) {
            
            console.log(error)

        }
    }));
    

    //serializacion

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async(id, done) => {
        const user = await usersModel.findById(id);
        done(null, user);
        
    })

    const cookieExtractor = req => {
        let token = null;
        if(req && req.cookies) {
            token = req.cookies['coderCookieToken'];
        }
        return token;
    }

    passport.use(passportStrategiesEnum.JWT, new JWTSrategy({
        jwtFromRequest: cookieExtractor,
        secretOrKey: PRIVATE_KEY_JWT
    }, async(jwt_payload, done) => {
        try {
            return done(null, jwt_payload.user)//req.user
        } catch (error) {
            return done(error);
        }
    }))
}


export {initializePassport};