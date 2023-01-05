const Message = require("../models/Message")
const fs = require("fs")

module.exports = {
    create: async (req, res, next) => {
        const doc = JSON.parse(req.body.message)
        delete doc.userId

        let objectID = mongoose.Types.ObjectId().toString();
        const message = {
            _id: objectID,
            ...doc,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/messages/${req.file.filename}`,
            createdAt: Date.now(),
            updateAt: Date.now()
        }

        await Message.findOneAndUpdate({_id: message._id}, JSON.parse(JSON.stringify(message)), {upsert: true, new: true})
        .then(() => res.status(201).json({ message: 'message créé avec succès!' }))
        .catch(error => res.status(400).json({ error })) 
    },

    update: async (req, res, next) => {
        const doc = req.file ? {
            ...JSON.parse(req.body.message),
            imageUrl: `${req.protocol}://${req.get('host')}/images/messages/${req.file.filename}`
        } : { ...req.body };
      
        delete doc._userId;
        await Message.findOne({_id: req.params.id})
            .then((message) => {
                if (message.userId != req.auth.userId) {
                    res.status(401).json({ message : 'Not authorized'});
                } else {
                    Message.updateOne({ _id: req.params.id}, { ...doc, _id: req.params.id, updatedAt: Date.now()})
                    .then(() => res.status(200).json({message : 'message modifié!'}))
                    .catch(error => res.status(401).json({ error }));
                }
            })
            .catch((error) => { res.status(400).json({ error }) });
    },
    
    getAll: async (req, res, next) => {
        await Message.find({ userId: req.auth.userId })
        .then(messages => res.status(200).json( { messages: messages.find(recevedId == req.params.id) } ))
        .catch(error => res.status(404).json({ error }));
    },
    
    // getOne: async (req, res, next) => {
    //     await Message.findOne({ _id: req.params.id })
    //     .then(message => res.status(200).json({message}))
    //     .catch(error => res.status(404).json({ error }));
    // },

    delete: async (req, res, next) => {
        Message.findOne({ _id: req.params.id})
            .then(message => {
                if (message.userId != req.auth.userId) {
                    res.status(401).json({message: 'Not authorized'});
                } else {
                    const filename = message.imageUrl.split('/images/messages/')[1];
                    fs.unlink(`images/messages/${filename}`, () => {
                        Message.deleteOne({_id: req.params.id})
                            .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                            .catch(error => res.status(401).json({ error }));
                    });
                }
            })
            .catch( error => {
                res.status(500).json({ error });
            });
     }
}