const { roles } = require("../../config/roles/roles");

exports.grantAccess = function (action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        return res.status(400).json({
          error: "You don't have permission to access this",
        });
      }
      res.locals.permission = permission;
      next();
    } catch (error) {
      next(error);
    }
  };
};
