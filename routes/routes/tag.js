const Tag = require("../../models/tag");
const multer = require("multer");
const path = require("path");
const PORT = 3007;
const FILE_PATH  = `http://127.0.0.1:${PORT}/postimage/`;

const routes = function (app) {
    app.get('/tag', async function(req,res){
		try{
			let tag = await Tag.find().lean()
			res.json(tag)
		}catch(err){
			res.status(500).send(err.message)
		}
	});

	// app.get('/tag/:id', async function(req,res){
	// 	try{
	// 		let {id} = req.params
	// 		let tag = await Tag.findById(id).populate('tag')
    //         let data = {
    //             title: tag.title,
                
    //         }
	// 		if(!tag) return res.status(404).json({msg:"Tag does not exit",code:404})
	// 		console.log(tag)
    //         res.json(tag)
	// 	}catch(err){
	// 		res.status(500).send({msg: "server error"})
	// 	}
	// });

	app.get('/tag/:id', async function(req,res){
		try{
		 let {id} = req.params
		 let tag = await Tag.findById(id)
		 let data = {
			 title: tag.title,
			 id:tag.id
		 }
		 // console.log(category)
		 res.json(data)
		}catch(err){
		 res.status(505).send({msg:"server error"})
		}
	 })

	app.put('/tag/:id', async function(req,res){
		try{
			let {id} = req.params
			let tag = await Tag.findById(id)
            let new_data = {}

            if (!tag)
            return res.status(404).json({msg: "tag does not exist", code:404});

            new_data = {...tag._doc, ...req.body};

            tag.overwrite(new_data);
            await tag.save();

            res.json(tag)
		}catch(err){
			res.status(500).send(err.message)
		}
	});
    
    app.delete('/tag/:id', async function(req,res){
		try{
			let {id} = req.params
			let tag = await Tag.findOneAndDelete(id)

			if(!tag) return res.status(404).json({msg:"tag does not exit",code:404});
			res.json({msg:"Tag deleted"})
			
		}catch(err){
			res.status(500).send(err.message)
		}
	});

	app.post('/tag', async function(req,res){
		try{
			let tag = new Tag(req.body)
			await tag.save()
			res.json(tag)
		}catch(err){
			res.status(500).send(err.message)
		}
	})

 
}
module.exports = routes