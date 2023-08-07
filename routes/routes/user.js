const User = require('../../models/user')
const bcrypt = require('bcryptjs')

const routes = function(app){
	app.get('/',function(req,res){
		res.json({msg:"This is my user index route"})
	})

	app.get('/users', async function(req,res){
		try{
			let users = await User.find().lean()
			res.json(users)
		}catch(err){
			res.status(500).send(err.message)
		}
	})

	app.get('/users/:id', async function(req,res){
		try{
			let {id} = req.params
			let user = await User.findById(id)
		
			if(!user) return res.status(404).json({msg:"User does not exit",code:404})
			
			res.json(user)
		}catch(err){
			res.status(500).send(err.message)
		}
	})

	// app.post('/users', async function(req,res){
	// 	try{
	// 		let user = new User(req.body)
	// 		await user.save()
	// 		res.json(user)
	// 		if(!user){
	// 			res.status(400).send("All input is required");
	// 		}
	// 	}catch(err){
	// 		res.status(500).send(err.message)
	// 	}
	// })

	app.post("/users", async function(req,res){
        try{
            const {username, email, phoneNumber, password,  role,} = req.body
            // encryptedPassword = await bcrypt.harsh(password, 8);
            const user = new User({
                username,
                email:email.toLowerCase(),
                phoneNumber,
                password,  
				// password: encryptedPassword,
                role, 
            })
    
			await user.save()
           
                res.json(user)
		}catch(err){
			res.status(500).send(err.message)
		}
    })

	app.put('/users/:id', async function(req,res){
		try{
			let {id} = req.params
			let user = await User.findById(id)
			let new_data = {};

			if(!user) return res.status(404).json({msg:"User does not exit",code:404})
		
			new_data = {...user._doc,...req.body}
		
			user.overwrite(new_data)
			await user.save()

			res.json(user)
		}catch(err){
			res.status(500).send(err.message)
		}
	})

	app.delete('/user/:id', async function(req,res){
		try{
			let {id} = req.params
			let user = await User.findOneAndDelete(id)
			res.json({msg:"User deleted"})

			if(!user) return res.status(404).json({msg:"User does not exit",code:404})
		
			
		}catch(err){
			res.status(500).send(err.message)
		}
	})

	
	  
	app.post('/login', async function(req, res){
        try{
            console.log(req.body)
            let user = await User.findOne(req.body)
            if(!user)return res.send({msg:"invalid user",code: 404})
            let data = {
                username: user.username,
                phoneNumber: user.phoneNumber,
                email: user.email,
                id: user._id,
                active: true
            }
            res.json({msg:"login successful",data})
			isloggedIn = true;
        }catch(err){
            res.status(505).send("server error occur")
        }
    })
}

module.exports = routes