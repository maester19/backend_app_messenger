const Statut = require("../models/Statut")
const mongoose = require("mongoose")
const fs = require("fs")

module.exports = {
    create: async (req, res, next) => {
        const doc = JSON.parse(req.body.statut)
        delete doc.userId

        let objectID = mongoose.Types.ObjectId().toString();
        const statut = {
            _id: objectID,
            ...doc,
            userId: req.auth.userId,
            mediaUrl: req.file?`${req.protocol}://${req.get('host')}/images/statuts/${req.file.filename}`: "",
            createdAt: Date.now(),
        }

        await Statut.findOneAndUpdate({_id: statut._id}, JSON.parse(JSON.stringify(statut)), {upsert: true, new: true})
        .then(() => res.status(201).json({ statut: 'statut créé avec succès!' }))
        .catch(error => res.status(400).json({ error })) 
    },

    update: async (req, res, next) => {
        const doc = req.file ? {
            ...JSON.parse(req.body.statut),
            mediaUrl: `${req.protocol}://${req.get('host')}/images/statuts/${req.file.filename}`
        } : { ...req.body };
      
        delete doc._userId;
        await Statut.findOne({_id: req.params.id})
            .then((statut) => {
                if (statut.userId != req.auth.userId) {
                    res.status(401).json({ statut : 'Not authorized'});
                } else {
                    Statut.updateOne({ _id: req.params.id}, { ...doc, _id: req.params.id, createdAt: Date.now()})
                    .then(() => res.status(200).json({statut : 'statut modifié!'}))
                    .catch(error => res.status(401).json({ error }));
                }
            })
            .catch((error) => { res.status(400).json({ error }) });
    },
    
    getAll: async (req, res, next) => {
        await Statut.find()
        .then(statuts => res.status(200).json( statuts ))
        .catch(error => res.status(404).json({ error }));
    },
    
    getOne: async (req, res, next) => {
        await Statut.findOne({ _id: req.params.id })
        .then(statut => res.status(200).json({statut}))
        .catch(error => res.status(404).json({ error }));
    },

    delete: async (req, res, next) => {
        Statut.findOne({ _id: req.params.id})
            .then(statut => {
                if (statut.userId != req.auth.userId) {
                    res.status(401).json({statut: 'Not authorized'});
                } else {
                    const filename = statut.imageUrl.split('/images/statuts/')[1];
                    fs.unlink(`images/statuts/${filename}`, () => {
                        Statut.deleteOne({_id: req.params.id})
                            .then(() => { res.status(200).json({statut: 'Objet supprimé !'})})
                            .catch(error => res.status(401).json({ error }));
                    });
                }
            })
            .catch( error => {
                res.status(500).json({ error });
            });
     }
}