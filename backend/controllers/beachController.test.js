import {
    getBeachList, getBeachDetail, sendReport, getBeachReports,
    saveBeachLocations, getNearbyBeaches, getReportsByUser,
    getFavoritesByUser, toggleFavoriteBeach, sendContactMessage
} from "../controllers/beachController.js";
import { Resend } from "resend";
import * as BeachService from "../services/beachService.js";

// Mockear resend
jest.mock('resend', () => ({
    Resend: jest.fn().mockImplementation(() => ({
        emails: {
            send: jest.fn()
        }
    }))
}));

// Mockear BeachService
jest.mock("../services/beachService.js");

describe("BeachController", () => {
    let res;
    let req;

    beforeEach(() => {
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
        req = { userId: 1, params: {}, body: {} };
        jest.clearAllMocks();
    });

    test("getBeachList devuelve una lista de playas", async () => {
        BeachService.getBeachList.mockResolvedValue([
            { id: 0, nombre: "Playa Gran" },
            { id: 1, nombre: "Playa d'en Goixa-els Morts" }
        ]);

        await getBeachList(req, res);

        expect(res.json).toHaveBeenCalledWith([
            { id: 0, nombre: "Playa Gran" },
            { id: 1, nombre: "Playa d'en Goixa-els Morts" }
        ]);
    });


    test("getBeachList devuelve un error", async () => {
        BeachService.getBeachList.mockRejectedValue(new Error("fail"));
        await getBeachList(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "🚩Error del servidor🚩" });
    });

    test("getBeachDetail devuelve los datos de una playa", async () => {
        req.params.id = 5;
        BeachService.getBeachDetail.mockResolvedValue({ id: 5, nombre: "Playa Ejemplo" });
        await getBeachDetail(req, res);
        expect(res.json).toHaveBeenCalledWith({ id: 5, nombre: "Playa Ejemplo" });
    });

    test("sendReport devuelve el id del reporte enviado", async () => {
        BeachService.sendReport.mockResolvedValue({ id: 123 });
        req.body = { beachId: 1, comment: "Test" };
        await sendReport(req, res);
        expect(res.json).toHaveBeenCalledWith(123);
    });

    test("getBeachReports devuelve los reportes de una playa", async () => {
        req.params.id = 1;
        BeachService.getBeachReports.mockResolvedValue([{ reportId: 1 }]);
        await getBeachReports(req, res);
        expect(res.json).toHaveBeenCalledWith([{ reportId: 1 }]);
    });

    test("getNearbyBeaches devuelve las playas cercanas a una playa", async () => {
        req.params.id = 1;
        BeachService.getNearbyBeaches.mockResolvedValue([{ beach_id: 2 }]);
        await getNearbyBeaches(req, res);
        expect(res.json).toHaveBeenCalledWith([{ beach_id: 2 }]);
    });

    test("getReportsByUser devuelve los reportes enviados por un usuario", async () => {
        BeachService.getReportsByUser.mockResolvedValue([{ reportId: 1 }]);
        await getReportsByUser(req, res);
        expect(res.json).toHaveBeenCalledWith([{ reportId: 1 }]);
    });

    test("getFavoritesByUser devuelve las playas marcadas como favoritas de un usuario", async () => {
        BeachService.getFavoritesByUser.mockResolvedValue([{ id: 1, nombre: "Playa" }]);
        await getFavoritesByUser(req, res);
        expect(res.json).toHaveBeenCalledWith([{ id: 1, nombre: "Playa" }]);
    });

    test("toggleFavoriteBeach devuelve el estado actualizado sobre si la playa es favorita o no", async () => {
        BeachService.toggleFavoriteBeach.mockResolvedValue({ favorite: true });
        req.params.beachId = 1;
        await toggleFavoriteBeach(req, res);
        expect(res.json).toHaveBeenCalledWith({ favorite: true });
    });

    test("sendContactMessage responde con ok true", async () => {
        req.body = { name: "Test", email: "test@test.com", comment: "Hola" };
        await sendContactMessage(req, res);
        expect(res.json).toHaveBeenCalledWith({ ok: true });
    });

    test("sendContactMessage responde con ok true", async () => {
        Resend.mockImplementationOnce(() => ({
            emails: { send: jest.fn().mockResolvedValue({ id: "123" }) }
        }));

        await sendContactMessage(req, res);

        expect(res.json).toHaveBeenCalledWith({ ok: true });
    });

    test("saveBeachLocations devuelve el resultado de la inserción", async () => {
        BeachService.saveBeachLocations.mockResolvedValue([{ beach_id: 1 }]);
        await saveBeachLocations(req, res);
        expect(res.json).toHaveBeenCalledWith([{ beach_id: 1 }]);
    });
});
