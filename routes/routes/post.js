const Post = require ("../../models/post");
const multer = require("multer");
const path = require("path");
const PORT = 3007;
const FILE_PATH = `http://localhost:${PORT}/postimage/`;
const User=require("../../models/user")
// const auth = require('../../middlewarre/auth');

const storage = multer.diskStorage({
    destination: (reg, file, cb)=> {
        //let _dir = path.join(__dirname, "../../public/postimage");
        //cb(null, _dir);
		// cb(null, )
		cb(null, "public/postimage")

    },
    filename: (reg, file, cb) =>{
        let filename = file.originalname.toLowerCase();
        cb(null, filename);
    },
});

const postimage = multer({storage: storage});

const routes = function (app) {
    app.get('/post', async function(req,res){
		try{
			let post = await Post.find().lean().populate("tag").populate('user');
			res.json(post)
			
		}catch(err){
			res.status(500).send(err.message)
		}
		// const {title, description, image, tag} = req.body;
		// const newPost = new Post({
		// 	title,
		// 	description,
		// 	image,
		// 	tag,
		// })
		// try{
		// 	// let newPost = new Post(req.body)
		// 	await newPost.save()
		// 	res.json(post)
		// }catch(err){
		// 	res.status(500).send(err.message)
		// }

		// console.log(req.body)
	});

	app.get('/post/:id', async function(req,res){
		try{
			let {id} = req.params;
			let post = await Post.findById(id).populate('tag').populate('user');
            res.json(post);
		}catch(err){
			
			res.status(500).send(err.message)
		}
	});

    app.post('/post', postimage.any(), async function(req,res){
		try{
			console.log('recieved request',req.body);
			console.log('recieved files',req.files);
			let post = new Post(req.body);

            req.files.forEach((e) =>{
                if(e.fieldname === 'image' ){
                    post.image = FILE_PATH + e.filename;
                    // post.image =  e.filename;
                }
            });
			console.log('post created:',post);
            await post.save();

			res.json({msg: "post created", code: 200});
		}catch(err){
			res.status(500).send(err.message)
		}
	});

	app.put('/post/:id', async function(req,res){
		try{
			let {id} = req.params
			let post = await Post.findById(id)
            let new_data = {}

            if (!post)
            return res.status(404).json({msg: "post does not exist", code:404});

            new_data = {...post._doc, ...req.body};

            post.overwrite(new_data);
            await post.save();

            res.json(post)
		}catch(err){
			res.status(500).send(err.message)
		}
	});
    
    app.delete('/post/:id', async function(req,res){
		try{
			let {id} = req.params
			let post = await Post.findOneAndDelete(id)

			if(!post) return res.status(404).json({msg:"post does not exit",code:404});
			res.json({msg:"Post deleted"})
			
		}catch(err){
			res.status(500).send(err.message)
		}
	});

    app.put('/likes/:id', async (req,res)=>{
		try{
			const {id} = req.params
			const post = await Post.findById(id);
            const {user} = req.body;
            const USER = await User.findById(user)
			console.log(USER)

			if(!USER) {
                return res.status(404).json({msg:"User does not exit",code:404})
            }
            if(!post) {
                return res.status(404).json({msg:"post does not exit",code:404})
            }
            if(post.likes.some(data => data.user.toString() === user)) {
                return res.json({msg:"post already liked"});
            }
            post.likes.push({user: USER});
            await post.save();
			res.json(post.likes)
			
		}catch(err){
            console.log(err.message);
			res.status(500).send({msg:"internal server error"});
		}
	})

    app.put('/unlike/:id', async (req, res)=>{
		try {
		  const {id} = req.params
		  const post = await Post.findById(id);
		const {user} = req.body;
		const USER = await User.findById(user)
		if(!USER){
		  return res.status(400).json({msg: "user does not exist"})
		}
		if(!post){
		   return res.status(404).json({ mes: "post does not exist" });  
		}
		// if(post.likes.some(data=> data.user.toString() === user))
		// {
		//   return res.json({msg: 'post already liked'});
		// }
		 const RemoveLike = post.likes.some(like=> like.user.toString()=== USER);
		//  console.log(RemoveLike)
		 post.likes.splice(RemoveLike,1);
		 await post.save();
		 res.json(post.likes);
		} catch (error) {
		 console.error(error.message)
		 res.status(500).send({msg: "internal server error"})
		}
	  })

    app.post('/comment/:id', async (req,res)=>{
		try{
			const {id} = req.params
			const post = await Post.findById(id).populate('user');
            console.log(post)
            const newComment ={
                text: req.body.text,
                // avatar:req.body.avatar,
                user_id:req.body.user_id,
				username:req.body.username,
            };
            post.comments.unshift(newComment);
            
            await post.save();
			res.json(post)
		}catch(err){
            console.log(err.message);
			res.status(500).send({msg:"internal server error"});
		}
	})

	app.get("/comments", async function (req, res) {
		try {
		  let post = await Post.find().lean().populate('user');
		  res.json(post);
		} catch (err) {
		  res.status(500).send(err.message);
		}
	  });

	  app.get('/comment/:id', async (req,res)=>{
		try {
		  const {id} = req.params;
		let post = await Post.findById(id)
		res.json(post);
		} catch (error) {
		  res.status(500).send(error.message);
		}
	  })

	//   app.get('/post/tag/:id', async (req, res) => {
	// 	try {
	// 	  const { id } = req.params;
	  
	// 	  // Find the Post by id
	// 	  let post = await Post.findById(id);
	  
	// 	  // If post not found, return an appropriate response
	// 	  if (!post) {
	// 		return res.status(404).json({ message: 'Post not found' });
	// 	  }
	  
	// 	  // Assuming "tag" is a field in the Post model
	// 	  const tag = post.tag;
	  
	// 	  // Now find all posts that have the same tag
	// 	  const postsByTag = await Post.find({ tag });
	  
	// 	  res.json(postsByTag);
	// 	} catch (error) {
	// 	  res.status(500).send(error.message);
	// 	}
	//   });
	  
	app.get('/post/tag/:tagId', async (req, res) => {
		try {
		  const tagId = req.params.tagId;
		  // Find posts with the given tagId
		  const post = await Post.find({ tag: tagId });
		  res.json(post);
		} catch (error) {
		  res.status(500).json({ error: 'Internal server error' });
		}
	  });
}

module.exports = routes