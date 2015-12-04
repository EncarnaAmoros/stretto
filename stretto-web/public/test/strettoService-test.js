'use strict';

describe('Modulo strettoService', function () {
 
    beforeEach(function () {
        module('strettoService');
    });
 
    describe('Tipos service', function () {
 
        var tiposService;
 
        beforeEach(function () {
            inject(['TiposService', function (service) {
                    tiposService = service;
                }
            ]);
        });
 
        it('debe devolver una lista de 4 tipos', function () {
            var tipos = tiposService.getTipos();
            expect(tipos).toBeDefined();
            expect(tipos.length).toBe(4);
        });
    });
});