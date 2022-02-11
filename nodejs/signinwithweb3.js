const EthUtil = require('ethereumjs-util');
const EthTx = require('ethereumjs-tx');
//const web3 = require("web3");

// front end would sign the messageToSign (Sent from the backend) with the following code:
//  await web3.eth.personal.sign(hexMsg, address);


exports.module = {
    
    // send this to the client
    messageToSign: (msg ) => {
    
        // you can choose your own message if you pass the parameter "msg"
        const message =  msg || "SignInWithWeb3IsAwesome!";
        const hexMsg = convertUtf8ToHex(message); 
       return hexMsg;
    },
    // Check if the user signed the message successfully.
    Web3SignedVerify:  () => {
        const messageToSign = exports.module.messageToSign;
        try {
            // Create a tx object from signed tx 
        const tx = new EthTx(web3AuthToken)
        // return if the message matches
        return tx.hexMsg == messageToSign

        } catch (ex) {
            console.error("Tried to sign and errored: ",ex)
            return false;
        }
    },

    // Middleware for Express. Add this before the REQUEST,RESPONSE parameters in your app.get or app.post etc
    Web3AuthMiddleware: async (req,res,next) => {
        res.auth.address = "";
        const SignedMessage = req.headers.authorization;
        if (exports.module.Web3SignedVerify(SignedMessage))
        {  // Good sign in
            const tx = new EthTx(SignedMessage)
            // Get an address of sender
            const address = EthUtil.bufferToHex(tx.getSenderAddress())

            // Add a res.auth object with the address that just connected to us
            res.auth.address = address; 
            next();
        } else {
           console.error("Message didn't match!")
           res.status(403).send('Unauthorized');
        }
        return;
      } // end of Web3AuthMiddleware
} // end of export.modules