import * as BeachService from "../services/beachService.js";
import { pool } from "../config/db.js";
import * as utils from "../utils/functions.js";

global.fetch = jest.fn();

jest.mock("../config/db.js", () => ({
    pool: { query: jest.fn() }
}));

jest.mock("../utils/functions.js", () => ({
    randomizeValue: jest.fn(),
    searchBeachTag: jest.fn(),
    searchTemperature: jest.fn()
}));

describe("BeachService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getBeachList", () => {
        test("Devuelve la lista de playas", async () => {
            fetch.mockResolvedValue({
                ok: true,
                json: async () => ({
                    playas: [
                        { id: 0, nombre: "Playa Gran", municipio: "Portbou" },
                        { id: 1, nombre: "Playa d'en Goixa-els Morts", municipio: "Y" }
                    ]
                })
            });

            pool.query.mockResolvedValue({ rows: [{ beach_id: 1 }] });
            utils.randomizeValue.mockReturnValue("random");
            utils.searchBeachTag.mockReturnValue("cielo");

            const result = await BeachService.getBeachList(1);

            expect(result).toHaveLength(2);
            expect(result[0].isFavorite).toBe(false);
            expect(result[1].isFavorite).toBe(true);
        });

        test("lanza error si fetch falla", async () => {
            fetch.mockResolvedValue({ ok: false });
            await expect(BeachService.getBeachList()).rejects.toThrow(
                "🪼Error al recibir los datos oficiales🪼"
            );
        });
    });

    describe("getBeachDetail", () => {
        test("Devuelve el detalle de la playa", async () => {
            const beachDetailData = {
                items: {
                    calidadPlaya: "buena",
                    estadoMar: {
                        alturaOlas: 0.2,
                        direccionolas: 268.3
                    },
                    estadoPlaya: {
                        temperatura: 25,
                        temperaturaAgua: 20,
                        traduccionCielo: "despejado",
                        etiquetaCielo: 1
                    },
                    playa: { id: 0, nombre: "Playa Gran" }
                }
            };

            const beachListData = {
                playas: [
                    { id: 0, nombre: "Playa Gran", municipio: "Portbou" },
                    { id: 1, nombre: "Playa d'en Goixa-els Morts", municipio: "Colera" }
                ]
            };

            fetch
                .mockResolvedValueOnce({ ok: true, json: async () => beachDetailData })
                .mockResolvedValueOnce({ ok: true, json: async () => beachListData });

            // DB mocks
            pool.query
                .mockResolvedValueOnce({ rows: [{ is_favorite: true }] }) // favorite
                .mockResolvedValueOnce({ rows: [{ beach_id: 1, distance: 1 }] }) // nearby
                .mockResolvedValueOnce({ rows: [{ beach_id: 1 }] }); // nearby favorites

            utils.randomizeValue.mockReturnValue("random");
            utils.searchBeachTag.mockReturnValue("cielo");
            utils.searchTemperature.mockReturnValue("caliente");

            const result = await BeachService.getBeachDetail(1, 1);

            expect(result.playa.nombre).toBe("Playa Gran");
            expect(result.isFavorite).toBe(true);
            expect(result.nearbyBeaches).toHaveLength(1);
            expect(result.nearbyBeaches[0].id).toBe(1);
        });
    });

    describe("sendReport", () => {
        test("Envia un reporte y devuelve su id", async () => {
            pool.query.mockResolvedValue({ rows: [{ id: 123 }] });

            const result = await BeachService.sendReport(1, {
                beachId: 0,
                waterStatus: "ok",
                waterCleanliness: "buena",
                beachCleanliness: "media",
                peopleNumber: 5,
                jellyfishPresence: false,
                flagColor: "verde",
                comment: "todo bien",
                beachName: "Playa d'en Goixa-els Morts"
            });

            expect(result.id).toBe(123);
        });
    });

    describe("getBeachReports", () => {
        test("Devuelve los reportes de una playa", async () => {
            pool.query.mockResolvedValue({ rows: [{ reportId: 0, username: "user" }] });
            const result = await BeachService.getBeachReports(2);
            expect(result[0].reportId).toBe(0);
            expect(result[0].username).toBe("user");
        });
    });

    describe("toggleFavoriteBeach", () => {
        test("Marca la playa com favorita", async () => {
            pool.query.mockResolvedValueOnce({ rows: [] }); // no existe
            pool.query.mockResolvedValueOnce({}); // insert
            const result = await BeachService.toggleFavoriteBeach(1, 2);
            expect(result.favorite).toBe(true);
        });

        test("Elimina la playa de favoritas", async () => {
            pool.query.mockResolvedValueOnce({ rows: [1] }); // ya existe
            pool.query.mockResolvedValueOnce({}); // delete
            const result = await BeachService.toggleFavoriteBeach(1, 2);
            expect(result.favorite).toBe(false);
        });
    });
});
