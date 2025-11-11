const jwt = require('jsonwebtoken');
const { messageInRaw } = require('svix');

// middleware function to decode jwt token to get clerk id   
// after this create new session on clerkweb hook for crekId : user.id
const authUser = async (req, res, next) => {
  try {
    //   for development phase (not production)
    const { token } = req.headers;
    if (!token) {
      return res.json({ success: false, message: 'Not authorised ,Login again' });
    }
    const token_decode = jwt.decode(token);  // here we got body of seesion created on web hook 
    console.log("🟢 Decoded token:", token_decode);

    // Clerk provides user ID under `sub`
    if (!token_decode || !token_decode.sub) {
      return res.json({ success: false, message: 'Invalid token format or expired token' });
    }

    req.user = { clerkId: token_decode.sub };  // set clerkId in req.user to use it in controller
    // req.body.clerkId =token_decode.clerkId;  // set clerkId in req.body to use it in controller (clerkId :user.id)
    next();

  } catch (error) {
    console.log("auth middleware error", error.message);
    res.json({ success: false, message: error.message });
  }
}
module.exports = authUser;