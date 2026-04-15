const catchAsync = require('../utils/catchAsync');
const AuthService = require('../services/AuthService');
const jwtUtil = require('../utils/jwt');

exports.register = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const { user, token } = await AuthService.register(email, password);
  
  jwtUtil.setupJwtCookies(res, token);
  
  res.status(201).json({ status: 'success', token, data: { user } });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const { user, token } = await AuthService.login(email, password);
  
  jwtUtil.setupJwtCookies(res, token);
  
  res.status(200).json({ status: 'success', token, data: { user } });
});

exports.protect = catchAsync(async (req, res, next) => {
  // Simple token verifier
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ status: 'fail', message: 'You are not logged in! Please log in to get access.' });
  }

  const jwt = require('jsonwebtoken');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  const currentUser = await AuthService.getUserById(decoded.id);
  if (!currentUser) return res.status(401).json({ status: 'fail', message: 'The user belonging to this token no longer exists.' });

  req.user = currentUser;
  next();
});

exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({ status: 'success', data: { user: req.user } });
});
