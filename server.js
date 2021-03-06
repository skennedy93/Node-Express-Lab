// import your node modules
const express = require('express');
const server = express();
const db = require('./data/db.js');
const cors = require('cors');

const corsOptions = { origin: `http://localhost:3000`, credentials: true };
server.use(cors(corsOptions));

// add your server code starting here
server.use(express.json())


server.get("/api/posts", (req, res) => {
    db.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            console.error('error', err)
            res.status(500).json({errorMessage: 'Failed to retrieve data'})
        })
});

server.get("/api/posts/:id", (req, res) => {
   db.findById(req.params.id)
        .then(post => {
            if (post.length < 1){
                res.status(404).json({error: "The Post with the specificed ID does not exist."})
            }
            else{
                res.status(200).json(post);
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: "The posts information could not be retrieved."})
        })

});

server.post('/posts/:id', (req, res) => {
    const user = req.body
    if(user.title && user.contents){
        db.insert(user).then(response =>
            db.findById(response.id).then(post => {
                res.status(201).json(post)
            })
        ).catch(err => {
            res.status(500).json({error: "Cannot Save to database"})
        })
    }else {
        res.status(400).json( {errorMessage: "Must insert title and Contents"})
    }
})

server.delete("/posts/:id", (req, res) => {
    const { id } = req.params;
    db.remove(id)
      .then(count => {
          if(count){
              res.status(204).end()
          }else{
              res.status(404).json({message: "No Post with that id"})
          }
      })
      .catch(err => res.status(500).json(err));
  });
  
  server.put('/posts/:id', (req, res)=>{
      db.update(req.params.id, req.body).then(posts =>{
          res.status(200).json(posts)
      })
      .catch(err => res.status(500).json({message: "Update failed"}))
  })

 server.listen(9000, () => console.log(`\n=== API on port 9000 ===\n`))