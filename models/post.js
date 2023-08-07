const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	title:{type:String,required:false},
	image:{type:String,required:true,unique:false},
	description:{type:String,required:true},
	tag:{type: mongoose.Types.ObjectId, ref: "tags"},
	user: { type: mongoose.Types.ObjectId, ref: "users" },
	likes: [],
	comments: [
		{
			user_id: {type: mongoose.Types.ObjectId, ref: "users"},
		    text: {type: String, required: true},
			date: {type: Date, default: Date.now},
			user: { type: mongoose.Types.ObjectId, ref: "users" },
		}
	],
	date:{type: Date, default:Date.now}

})

const Post = mongoose.model("posts",UserSchema)
module.exports = Post;