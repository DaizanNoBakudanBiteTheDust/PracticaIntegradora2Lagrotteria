import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import usersModel from '../dao/dbManagers/models/users.models.js';


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
            /*{ 
                _json:{
                    name: 'alex'
                }
                emails: [{value: 'ap@hotmail.com'}]
            }*/
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
        done(null, user._id);
    })

    passport.deserializeUser(async(id, done) => {
        const user = await usersModel.findById(id);
        done(null, user);
        
    })
}

export {initializePassport};