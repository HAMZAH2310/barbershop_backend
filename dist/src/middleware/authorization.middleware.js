export const isAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({
                message: "Akses ditolak! Fitur hanya untuk admin!"
            });
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
