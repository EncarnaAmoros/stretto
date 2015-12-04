'use strict';

describe('Modulo strettoService', function () {
 
    beforeEach(function () {
        module('strettoService');
    });

		describe('Tipos service', function () {
 
        var tiposService;
 
        beforeEach(function () {
            inject(['tiposService', function (service) {
                    tiposService = service;
                }
            ]);
        });
 
        it('debe devolver una lista de 4 tipos', function () {
            tiposService.getTipos().then(function (resultado) {
							console.log(resultado);
							expect(resultado).toBeDefined();
            	expect(resultado.length).toBe(4);
						});
            
        });
    });
});