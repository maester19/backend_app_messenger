const Conversation = require("../models/Conversation")
const mongoose = require("mongoose")
const fs = require("fs")

module.exports = {
    create: async (req, res, next) => {
        const doc = req.body.conversation

        let objectID = mongoose.Types.ObjectId().toString();
        const conversation = {
            _id: objectID,
            ...doc,
            createdAt: Date.now(),
        }

        await Conversation.findOneAndUpdate({_id: conversation._id}, JSON.parse(JSON.stringify(conversation)), {upsert: true, new: true})
        .then(() => res.status(201).json({ conversation: 'conversation créé avec succès!' }))
        .catch(error => res.status(400).json({ error })) 
    },

    update: async (req, res, next) => {
        const doc = {...req.body };
      
        await Conversation.findOne({_id: req.params.id})
            .then((conversation) => {
                Conversation.updateOne({ _id: req.params.id}, { ...doc, _id: req.params.id, createdAt: Date.now()})
                .then(() => res.status(200).json({conversation : 'conversation modifié!'}))
                .catch(error => res.status(401).json({ error }));
                
            })
            .catch((error) => { res.status(400).json({ error }) });
    },
    
    getAll: async (req, res, next) => {
        await Conversation.find()
        .then(conversations => res.status(200).json( conversations ))
        .catch(error => res.status(404).json({ error }));
    },
    
    getOne: async (req, res, next) => {
        await Conversation.findOne({ _id: req.params.id })
        .then(conversation => res.status(200).json({conversation}))
        .catch(error => res.status(404).json({ error }));
    },

    delete: async (req,res,next) => {
        await Conversation.findOneAndDelete({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
    }
}