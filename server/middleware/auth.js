 

export const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication invalid',
    });
  }

  try {
    const payload = verifyJWT(token);
    req.user = {
      userId: payload.userId,
      name: payload.name,
      email: payload.email,
      role: payload.role
    };
    next();
  } catch (error) {
    return res.status(401).json({success: false, message: 'Authentication invalid' });
  }
};

 
 