const Post = require("../models/Post")
const mongoose = require("mongoose")
const fs = require("fs")

module.exports = {
    create: async (req, res, next) => {
        // const doc = JSON.parse(req.body.post)
        const doc = req.body.post

        let objectID = mongoose.Types.ObjectId().toString();
        const post = {
            _id: objectID,
            ...doc,
            imageUrl: req.file?`${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`: "",
            createdAt: Date.now(),
        }

        await Post.findOneAndUpdate({_id: post._id}, JSON.parse(JSON.stringify(post)), {upsert: true, new: true})
        .then(() => res.status(201).json({ post: 'post créé avec succès!' }))
        .catch(error => res.status(400).json({ error })) 
    },

    update: async (req, res, next) => {
        const doc = req.file ? {
            ...JSON.parse(req.body.post),
            imageUrl: `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`
        } : { ...req.body };
      
        delete doc._userId;
        await Post.findOne({_id: req.params.id})
            .then((post) => {
                if (post.userId != req.auth.userId) {
                    res.status(401).json({ post : 'Not authorized'});
                } else {
                    Post.updateOne({ _id: req.params.id}, { ...doc, _id: req.params.id, updatedAt: Date.now()})
                    .then(() => res.status(200).json({post : 'post modifié!'}))
                    .catch(error => res.status(401).json({ error }));
                }
            })
            .catch((error) => { res.status(400).json({ error }) });
    },
    
    getAll: async (req, res, next) => {
        await Post.find()
        .then(posts => res.status(200).json( { posts } ))
        .catch(error => res.status(404).json({ error }));
    },
    
    getOne: async (req, res, next) => {
        await Post.findOne({ _id: req.params.id })
        .then(post => res.status(200).json({post}))
        .catch(error => res.status(404).json({ error }));
    },
    
    getByUser: async (req, res, next) => {
        await Post.findOne({ userId: req.params.id })
        .then(post => res.status(200).json({post}))
        .catch(error => res.status(404).json({ error }));
    },

    delete: async (req, res, next) => {
        Post.findOne({ _id: req.params.id})
            .then(post => {
                if (post.userId != req.auth.userId) {
                    res.status(401).json({post: 'Not authorized'});
                } else {
                    const filename = post.imageUrl.split('/images/posts/')[1];
                    fs.unlink(`images/posts/${filename}`, () => {
                        Post.deleteOne({_id: req.params.id})
                            .then(() => { res.status(200).json({post: 'Objet supprimé !'})})
                            .catch(error => res.status(401).json({ error }));
                    });
                }
            })
            .catch( error => {
                res.status(500).json({ error });
            });
     }
}