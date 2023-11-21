const Author = require('../models/author')
const fs = require('fs');

//read
const getAuthor = async (req, res) => {
    const authorId = req.params.id;

    Author.findById(authorId, (err, author) => {
        if (err) {
            return res.status(400).json({ success: false, err });
        }

        return res.status(200).json({
            success: true,
            author
        });
    });
}

const getAllAuthors = async (req, res) => {
    Author.find({}, (err, authors) => {
        if (err) {
            return res.status(400).json({ success: false, err });
        }

        return res.status(200).json({
            success: true,
            authorsList: authors
        });
    })
}

//create
const addAuthor = async (req, res) => {
    const newAuthor = req.body
    if (req.file) newAuthor.photoUrl = req.file.path
    Author.create(newAuthor, (err, author) => {
        if (err) {
            return res.status(400).json({ success: false, err });
        }

        return res.status(200).json({
            success: true,
            newAuthor: author
        });
    })
}

//update
const updateAuthor = async (req, res) => {
    try {
        const authorId = req.params.id
        const author = await Author.findById(authorId);
        if (!author) {
            return res.status(404).json({ success: false, message: "Author not found" });
        }
        
        console.log('check body data', req.body);

        if (req.body.name) author.name = req.body.name;
        if (req.body.description) author.description = req.body.description;

        if (req.file) {
            if (author.photoUrl) {
                fs.unlinkSync(author.photoUrl)
            }
            author.photoUrl = req.file.path
        }
        const updatedAuthor = await author.save();
        return res.status(200).json({
            success: true,
            updatedAuthor: updatedAuthor
        });
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, err: error.message });
    }
}


//delete
const deleteAuthor = async (req, res) => {
    try {
        const authorId = req.params.id
        Author.findByIdAndDelete(authorId, (err, author) => {
            if (err) {
                return res.status(400).json({ success: false, err });
            }
            if (author.photoUrl) {
                fs.unlinkSync(author.photoUrl)
            }

            return res.status(200).json({
                success: true,
                deletedAuthor: author
            });
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getAuthor,
    getAllAuthors,
    addAuthor,
    updateAuthor,
    deleteAuthor
}
