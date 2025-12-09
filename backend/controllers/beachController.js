import * as BeachService from "../services/beachService.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const getBeachList = async(req, res) => {
    try {
        const list = await BeachService.getBeachList(req.userId);
        res.json(list);
    } catch (err) {
        res.status(500).json({ message: "🚩Error del servidor🚩"})
    }
};

export const getBeachDetail = async(req, res) => {
    try {
        const beach = await BeachService.getBeachDetail(req.userId, req.params.id);
        res.json(beach);
    } catch (err) {
        res.status(500).json({ message: "🚩Error del servidor🚩"});
    }
};

export const sendReport = async(req, res) => {
    try {
        const saved = await BeachService.sendReport(req.userId, req.body);
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

export const getReportsByUser = async(req, res) => {
    try {
        const result = await BeachService.getReportsByUser(req.userId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: "🚩Error del servidor🚩"});
    }
}

export const getFavoritesByUser = async(req, res) => {
    try {
        const result = await BeachService.getFavoritesByUser(req.userId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: "🚩Error del servidor🚩"});
    }
}

export const toggleFavoriteBeach = async(req, res) => {
    try {
        const result = await BeachService.toggleFavoriteBeach(req.userId, req.params.beachId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: "🚩Error del servidor🚩"});
    }
}

export const sendContactMessage = async (req, res) => {
    
    const { name, email, comment } = req.body;

    try {
        const data = await resend.emails.send({
            from: "BlueCheck <onboarding@resend.dev>",
            to: "cmarquezsau@uoc.edu",
            subject: "Nuevo formulario de contacto enviado",
            html: `
            <h2>Nuevo formulario de contacto enviado</h2>
            <p><strong>Nombre: ${name}</strong></p>
            <p><strong>Email: ${email}</strong></p>
            <p><strong>${comment}</strong></p>
            `
        });

        res.json({ok: true});
    } catch (err) {
        res.status(500).json({ ok: false, message: "🚩Error del servidor🚩"});
    }
}