const requirePageAuthentication = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  return next();
};

const requirePageAdmin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  if (req.session.user.role !== 'admin') {
    return res.status(403).render('errors/403', { title: 'Access denied', error: 'Administrator access is required.' });
  }

  return next();
};

const requireApiAuthentication = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  return next();
};

const requireApiAdmin = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Administrator access is required' });
  }

  return next();
};

export { requireApiAdmin, requireApiAuthentication, requirePageAdmin, requirePageAuthentication };
