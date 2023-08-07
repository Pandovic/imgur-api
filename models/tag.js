const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	title: {type: String, required:true,}
})

const Tag = mongoose.model("tags",UserSchema)
module.exports = Tag;