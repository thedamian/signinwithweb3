const express = require('express');
const path = require("path"); // some hosts don't like the built in "path" for the /views 
const app = express();
const port = 3000;
app.use(express.json());
app.set('view engine', 'ejs'); // I choose you:  ejs
app.set("views", path.join(__dirname, `/views`)); 


const signinwithweb3 = require("../signinwithweb3");

app.get('/', (req, res) => {
    res.render("index.ejs");
  })

  app.get("/getMessage",(req,res) => {
      res.json(signinwithweb3.messageToSign());
  })

  app.post("/checkSignature", async (req,res) => {
    //console.log(req.body);
    let SignedCorrectly = await signinwithweb3.GetAddressFromSignature(req.body.signedMessage);
    res.json(SignedCorrectly);
  })

  app.get("/secureAPIEndpoint",signinwithweb3.Web3AuthMiddleware,(req,res) => {
    res.json(req.auth.address)
  })
  
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })