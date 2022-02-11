const Web3 = require("web3");
const web3 = new Web3();


// front end would sign the messageToSign (Sent from the backend) with the following code:
//  await web3.eth.personal.sign(hexMsg, address);


module.exports =  {
    
    // send this to the client
    messageToSign:  (msg ) => {
        // you can choose your own message if you pass the parameter "msg"
        const message =  msg || "SignInWithWeb3IsAwesome!";
        const hexMsg =  web3.utils.utf8ToHex(message); 
       return hexMsg;
    },
    // Check if the user signed the message successfully.
    GetAddressFromSignature:  async  (signedMessage) => {
        const messageToSign =  module.exports.messageToSign();
        try {
            const address = web3.eth.accounts.recover(messageToSign,signedMessage);
           console.log("returning a good address",address)
            return address
        } catch (ex) {
            console.error("Tried to sign and errored: ",ex)
            return null;
        }
    },

    // Middleware for Express. Add this before the REQUEST,RESPONSE parameters in your app.get or app.post etc
    Web3AuthMiddleware: async (req,res,next) => {
        req.auth  =  {address:""};
        const SignedMessage = req.headers.authorization;
        try
        {  
            // Get an address of sender
            const address =  await module.exports.GetAddressFromSignature(SignedMessage)
            // Add a res.auth object with the address that just connected to us
            req.auth.address = address;  // let's set the address so the rest of the system has it for autherization since we're authenticated
            next();
        } catch (ex) {
           console.error("Message didn't match!",ex)
           res.status(403).send('Unauthorized');
        }
        return;
      } // end of Web3AuthMiddleware
} // end of export.modules