import * as AuthService from "../services/authService.js";

export const register = async(req, res) => {
    try {
        const user = await AuthService.register(req.body);
        res.status(201).json({ user });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message});
    }
};

export const login = async(req, res) => {
    try {
        const result = await AuthService.login(req.body);
        res.json(result);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

export const getUser = async(req, res) => {
    try {
        const result = await AuthService.getUser(req.userId);
        res.json(result);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

export const updateUser = async(req, res) => {
    try {
        const result = await AuthService.updateUser(req.userId, req.body);
        res.json(result);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};