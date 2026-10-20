const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        let token;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                message: "Access denied. No token provided."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretjwtkey123");
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
};

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({
                message: "Unauthorized: User information missing."
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied. Role '${req.user.role}' is not authorized.`
            });
        }

        next();
    };
};

module.exports = {
    auth,
    authorizeRoles
};
