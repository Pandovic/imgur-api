const Comment = require('../../models/comment')

const routes = function(app){

	// app.post('/comments/id', async (req,res)=>{
	// 	try{
	// 		const {id} = req.params
	// 		const comment = await Comment.findById(id);
          
    //         const newComment ={
    //             text: req.body.text,
              
    //             name:user.name,
    //         };
    //         comment.comments.unshift(newComment);
            
    //         await comment.save();
	// 		res.json(comment)
	// 	}catch(err){
    //         console.log(err.message);
	// 		res.status(500).send({msg:"internal server error"});
	// 	}
	// })

	// app.get("/comments", async function (req, res) {
	// 	try {
	// 	  let comment = await Comment.find().lean().populate('user');
	// 	  res.json(comment);
	// 	} catch (err) {
	// 	  res.status(500).send(err.message);
	// 	}
	//   });

	
}

module.exports = routes