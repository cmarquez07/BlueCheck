import jwt from "jsonwebtoken"

export const authOptional = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        req.userId = null;
        return next();
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
    } catch (err) {
        req.userId = null;
    }

    next();
}

export const authRequired = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith ("Bearer ")) {
        return res.status(401).json({ message: "Token no proporcionado"});
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token inválido o expirado"});
    }
}