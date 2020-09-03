function requireUser(req, res, next) {
    if (!req.user) {
        next({
            name: "error",
            message: "log in pleasae"
        });
    }

    next();
}

module.exports = {
    requireUser
}