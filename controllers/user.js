const User = require("../models/User")
const mongoose = require("mongoose")
const jwt = require('jsonwebtoken');


module.exports = {
    signup: async(req, res, next) => {

    let objectId = mongoose.Types.ObjectId().toString(); // create user id

    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const doc = {
          _id: objectId,
          name: req.body.name,
          phone: req.body.phone,
          password: hash,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        let user = User.findOneAndUpdate({_id: doc._id}, JSON.parse(JSON.stringify(doc)), {upsert: true, new: true})
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
        console.log(user)
      })
      .catch(error => res.status(500).json({ error }));
  },

  login: async(req, res, next) => {
    User.findOne({ phone: req.body.phone })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            "RANDOM_TOKEN_SECRET",
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    },

    changePassword : async (req, res, next) => {
        await User.findOne({ _id: req.params.id })
          .then(user => {
      
            bcrypt.compare(req.body.password, user.password)
              .then(valid => {
                if (!valid) {
                    return res.json({ message: 'Ancien mot de passe incorrect' });
                }
                bcrypt.hash(req.body.newpw, 10)
                .then(hash => {
      
                  user.password = hash
                  
                  User.findOneAndUpdate({_id: user._id}, user, {upsert: true, new: true})
                  .then(() => res.status(201).json({ message: 'Mot de passe modifier !' }))
                  .catch(error => res.status(400).json({ error }));
      
                })
                .catch(error => res.status(500).json({ error }))
      
              })
              .catch(error => res.status(500).json({ error }));
      
              
          })
          .catch(error => res.status(500).json({ error }));
      },
      
    update: async (req, res, next) => {
        const {
            name,
            phone,
            password
        } = req.body 
        
        let user = await User.findOne({ _id: req.params.id })
        
        user.name = name != undefined ? name : user.name
        user.phone = phone != undefined ? phone : user.phone
        user.password = password != undefined ? bcrypt.hash(password, 10) : user.password
        user.updatedAt = Date.now()
        
        await User.findByIdAndUpdate({_id: req.params.id}, user, 
            { upsert: true, new: false })
            .then(user => res.status(201).json({ message: 'Utilisateur modifié avec succès !', user }), console.log(user))
            .catch(error => res.status(400).json({ error })
        );
    },
    
    getAll: async (req, res, next)=> {
        await User.find()
        .then(users => res.status(200).json({users}))
        .catch(error => res.status(400).json({ error }));
    },
    
    getOne: async (req,res,next) =>{
        await User.findOne({ _id: req.params.id })
        .then(user => res.status(200).json({user}))
        .catch(error => res.status(400).json({ error }));
    },
    
    delete: async (req,res,next) => {
        await User.findOneAndDelete({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
    }
}
