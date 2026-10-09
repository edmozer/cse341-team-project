import bcrypt from 'bcryptjs';
import User from '../models/schemas/users.js';

const toSessionUser = (user) => ({ id: user._id.toString(), name: user.name, role: user.role });

const credentialsAreValid = ({ name, email, password }, requireName) => {
  const normalizedEmail = email?.trim().toLowerCase();
  const validName = !requireName || (typeof name === 'string' && name.trim().length >= 2);
  const validPassword = typeof password === 'string' && password.length >= 8;
  const validEmail = typeof normalizedEmail === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

  return validName && validPassword && validEmail;
};

const createUser = async ({ name, email, password }) => {
  if (!credentialsAreValid({ name, email, password }, true)) {
    const error = new Error('Enter a name, a valid email address, and a password with at least 8 characters.');
    error.status = 400;
    throw error;
  }

  try {
    return await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: await bcrypt.hash(password, 12),
      role: 'user'
    });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateError = new Error('An account already exists for that email address.');
      duplicateError.status = 409;
      throw duplicateError;
    }

    throw error;
  }
};

const authenticate = async ({ email, password }) => {
  if (!credentialsAreValid({ email, password }, false)) {
    return null;
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return null;
  }

  return user;
};

const registerPage = (req, res) => res.render('auth/register', { title: 'Create your account', form: {} });
const loginPage = (req, res) => res.render('auth/login', { title: 'Log in', registered: req.query.registered === '1', form: {} });

const register = async (req, res, next) => {
  try {
    await createUser(req.body);
    return res.redirect('/login?registered=1');
  } catch (error) {
    if (error.status) {
      return res.status(error.status).render('auth/register', { title: 'Create your account', error: error.message, form: req.body });
    }

    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await authenticate(req.body);
    if (!user) {
      return res.status(401).render('auth/login', { title: 'Log in', error: 'Email or password is incorrect.', registered: false, form: req.body });
    }

    req.session.user = toSessionUser(user);
    return res.redirect(user.role === 'admin' ? '/admin/dashboard' : '/');
  } catch (error) {
    return next(error);
  }
};

const logout = (req, res, next) => req.session.destroy((error) => {
  if (error) {
    return next(error);
  }

  res.clearCookie('kizuna.sid');
  return res.redirect('/');
});

const adminDashboard = async (req, res, next) => {
  try {
    const users = await User.find({}, 'name email role createdAt').sort({ createdAt: 1 }).lean();
    return res.render('admin/dashboard', { title: 'Admin Dashboard', users });
  } catch (error) {
    return next(error);
  }
};

const apiRegister = async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    return res.status(201).json({ user: toSessionUser(user) });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }

    return next(error);
  }
};

const apiLogin = async (req, res, next) => {
  try {
    const user = await authenticate(req.body);
    if (!user) {
      return res.status(401).json({ error: 'Email or password is incorrect.' });
    }

    req.session.user = toSessionUser(user);
    return res.json({ user: req.session.user });
  } catch (error) {
    return next(error);
  }
};

const apiLogout = (req, res, next) => req.session.destroy((error) => {
  if (error) {
    return next(error);
  }

  res.clearCookie('kizuna.sid');
  return res.status(204).send();
});

const currentUser = (req, res) => res.json({ user: req.session.user });

const apiAdminDashboard = async (req, res, next) => {
  try {
    const users = await User.find({}, 'name email role createdAt').sort({ createdAt: 1 }).lean();
    return res.json({ users });
  } catch (error) {
    return next(error);
  }
};

export { adminDashboard, apiAdminDashboard, apiLogin, apiLogout, apiRegister, currentUser, login, loginPage, logout, register, registerPage };
