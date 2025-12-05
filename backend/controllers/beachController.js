import * as BeachService from "../services/beachService.js";

export const getBeachList = async(req, res) => {
    try {
        const list = await BeachService.getBeachList();
        res.json(list);
    } catch (err) {
        res.status(500).json({ message: "🚩Error del servidor🚩"})
    }
};

export const getBeachDetail = async(req, res) => {
    try {
        const beach = await BeachService.getBeachDetail(req.params.id);
        res.json(beach);
    } catch (err) {
        res.status(500).json({ message: "🚩Error del servidor🚩"});
    }
};

export const sendReport = async(req, res) => {
    try {
        const saved = await BeachService.sendReport(req.body);
        res.json(saved.id);
    } catch (err) {
        console.log("ERROR EN sendReport", err);
        res.status(500).json({ message: "🚩Error del servidor🚩"});
    }
}

export const getBeachReports = async(req, res) => {
    try {
        const beach = await BeachService.getBeachReports(req.params.id);
        res.json(beach);
    } catch (err) {
        res.status(500).json({ message: "🚩Error del servidor🚩"});
    }
};

// Función para añadir la ubicacón de las playas.
export const saveBeachLocations = async(req, res) => {
    try {
        const beach = await BeachService.saveBeachLocations();
        res.json(beach);
    } catch (err) {
        res.status(500).json({ message: "🚩Error del servidor🚩"});
    }
};

// Función para obtener playas cercanas
export const getNearbyBeaches = async(req, res) => {
    try {
        const beach = await BeachService.getNearbyBeaches(req.params.id);
        res.json(beach);
    } catch (err) {
        res.status(500).json({ message: "🚩Error del servidor🚩"});
    }
};