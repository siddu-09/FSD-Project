const bcrypt = require('bcryptjs');
const UserRepository = require('../repositories/UserRepository');
const AppError = require('../utils/AppError');
const jwt = require('../utils/jwt');

class AuthService {
  async register(email, password) {
    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Default role 'CUSTOMER' is set automatically by database
    const newUser = await UserRepository.create({
      email,
      password: hashedPassword
    });

    const token = jwt.signToken(newUser.id);
    newUser.password = undefined; // Don't send password in output

    return { user: newUser, token };
  }

  async login(email, password) {
    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    const user = await UserRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError('Incorrect email or password', 401);
    }

    const token = jwt.signToken(user.id);
    user.password = undefined;

    return { user, token };
  }

  async getUserById(id) {
    const user = await UserRepository.findById(id);
    if (user) {
      user.password = undefined;
    }
    return user;
  }
}

module.exports = new AuthService();
