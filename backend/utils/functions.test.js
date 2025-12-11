import { randomizeValue, searchBeachTag, searchTemperature } from './functions.js';

describe('BEACH_TAGS functions', () => {

    test('searchBeachTag returns correct param', () => {
        const result = searchBeachTag('_CALIDAD_', '_EXCEL_LENT_');
        expect(result).toBeDefined();
        expect(result.text).toBe('Buenas condiciones');
    });

    test('searchBeachTag returns null for invalid value', () => {
        const result = searchBeachTag('_CALIDAD_', 'INVALID');
        expect(result).toBeNull();
    });

    test('searchTemperature returns color for a temperature in range', () => {
        const color = searchTemperature(16);
        expect(color).toBeDefined();
        expect(typeof color).toBe('string');
    });

    test('randomizeValue returns a param from the category', () => {
        const param = randomizeValue('_MEDUSES_', 123);
        expect(param).toBeDefined();
        expect(param.name).toMatch(/_SENSE_PRES_NCIA_DE_MEDUSES_|_PRES_NCIA_DE_MEDUSES_/);
    });

});
