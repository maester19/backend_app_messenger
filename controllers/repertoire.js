const Repertoire = require("../models/Repertoire")
const mongoose = require("mongoose")
const fs = require("fs")

module.exports = {
    create: async (req, res, next) => {
        const doc = req.body.repertoire

        let objectID = mongoose.Types.ObjectId().toString();
        const repertoire = {
            _id: objectID,
            ...doc,
            createdAt: Date.now(),
        }

        await Repertoire.findOneAndUpdate({_id: repertoire._id}, JSON.parse(JSON.stringify(repertoire)), {upsert: true, new: true})
        .then(() => res.status(201).json({ repertoire: 'repertoire créé avec succès!' }))
        .catch(error => res.status(400).json({ error })) 
    },

    update: async (req, res, next) => {
        const doc = { ...req.body };
      
        delete doc._userId;
        await Repertoire.findOne({_id: req.params.id})
            .then((repertoire) => {
                if (repertoire.userId != req.auth.userId) {
                    res.status(401).json({ repertoire : 'Not authorized'});
                } else {
                    Repertoire.updateOne({ _id: req.params.id}, { ...doc, _id: req.params.id, createdAt: Date.now()})
                    .then(() => res.status(200).json({repertoire : 'repertoire modifié!'}))
                    .catch(error => res.status(401).json({ error }));
                }
            })
            .catch((error) => { res.status(400).json({ error }) });
    },
    
    getAll: async (req, res, next) => {
        await Repertoire.find()
        .then(repertoires => res.status(200).json( { repertoires } ))
        .catch(error => res.status(404).json({ error }));
    },
    
    getByUser: async (req, res, next) => {
        await Repertoire.findOne({ UserId: req.params.id })
        .then(repertoire => res.status(200).json({repertoire}))
        .catch(error => res.status(404).json({ error }));
    },
    
    getOne: async (req, res, next) => {
        await Repertoire.findOne({ _id: req.params.id })
        .then(repertoire => res.status(200).json({repertoire}))
        .catch(error => res.status(404).json({ error }));
    },

    delete: async (req,res,next) => {
        await Repertoire.findOneAndDelete({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
    }
}