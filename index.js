var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var jwt = require('jsonwebtoken')
var app = express();

app.use(bodyParser());
app.use(cors());

const Message = mongoose.model('Message', {
    user_name: String,
    message: String,
    time: Date
});


app.get("/listezMesMessages", (req, resp) => {
    // Get the token from header
    let token = req.header("GMC-Token");
    // if(!token || token.length == 0){
    //     console.log("Token not sent yet", token)
    //     resp.status(403).send("You're not authorized, login first");
    // }else {
    //     try{
    //         let decoded_token = jwt.verify(token, 'Hello world');
    //         console.log(decoded_token);
            
            Message.find({}, (err, messages) => {
                if(err != null) {
                    resp.status(500).send("Erreur serveur");
                }else {
                    resp.status(200).json(messages);            
                }
            });
    //     }catch(err) {
    //         console.log("Token invalid")
    //         resp.status(403).send("You're not authorized, login first");
    //     }
    // }
});

app.post("/envoyerMonMessage", async (req, resp) => {
    var name = req.body.name;
    var content = req.body.content;
    let message = new Message({
        user_name: name,
        message: content,
        date: Date.now()
    });
    await message.save();
    resp.status(200).send("OK");
});

app.post("/login", async (req, resp) => {
    console.log(req.body)
    // Verifaction de l'identité de la personne
    let token_data = {
        ...req.body,
    }
    let token = jwt.sign(token_data,'Hello world');
    resp.status(200).json({
        status: 'succeded',
        token: token
    });

});




mongoose.connect("mongodb+srv://hello:world@cluster0.foo8h.mongodb.net/facebook2?retryWrites=true&w=majority")
    .then(db => {
        console.log("Database connected")
    }).catch(err => {

    });


app.listen(777);