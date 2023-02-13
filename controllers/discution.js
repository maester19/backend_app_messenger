const Discution = require("../models/Discution")
const mongoose = require("mongoose")
const fs = require("fs")

module.exports = {
    create: async (req, res, next) => {
        // const doc = JSON.parse(req.body.discution)
        const doc = req.body.discution

        let objectID = mongoose.Types.ObjectId().toString();
        const discution = {
            _id: objectID,
            ...doc,
            createdAt: Date.now(),
        }

        await Discution.findOneAndUpdate({_id: discution._id}, JSON.parse(JSON.stringify(discution)), {upsert: true, new: true})
        .then(() => res.status(201).json({ discution: 'discution créé avec succès!' }))
        .catch(error => res.status(400).json({ error })) 
    },

    update: async (req, res, next) => {
        const doc = req.file ? {
            ...JSON.parse(req.body.discution),
        } : { ...req.body };
      
        delete doc._userId;
        await Discution.findOne({_id: req.params.id})
            .then((discution) => {
                Discution.updateOne({ _id: req.params.id}, { ...doc, _id: req.params.id, updatedAt: Date.now()})
                    .then(() => res.status(200).json({discution : 'discution modifié!'}))
                    .catch(error => res.status(401).json({ error }));
            })
            .catch((error) => { res.status(400).json({ error }) });
    },
    
    getAll: async (req, res, next) => {
        await Discution.find({ firstUser: req.params.id, secondUser: req.params.id })
        .then(discutions => res.status(200).json( { discutions } ))
        .catch(error => res.status(404).json({ error }));
    },
    
    getOne: async (req, res, next) => {
        await Discution.findOne({ _id: req.params.id })
        .then(discution => res.status(200).json({discution}))
        .catch(error => res.status(404).json({ error }));
    },
    
    getByUser: async (req, res, next) => {
        await Discution.findOne({ userId: req.params.id })
        .then(discution => res.status(200).json({discution}))
        .catch(error => res.status(404).json({ error }));
    },

    delete: async (req, res, next) => {
        Discution.findOne({ _id: req.params.id})
            .then(discution => {
                const filename = discution.imageUrl.split('/images/discutions/')[1];
                    fs.unlink(`images/discutions/${filename}`, () => {
                        Discution.deleteOne({_id: req.params.id})
                            .then(() => { res.status(200).json({discution: 'Objet supprimé !'})})
                            .catch(error => res.status(401).json({ error }));
                    });
            })
            .catch( error => {
                res.status(500).json({ error });
            });
     }
}