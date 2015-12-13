- Ejecutar parte del API:

Dentro de la carpeta stretto-api ejecutar:
	node ./bin/www

- Ejecutar parte del cliente SPA=servidor web:

Dentro de la carpeta stretto-web ejecutar:
Sin gulp: node app.js
Con gulp: gulp 
					o
					gulp servidor

- Ejecutar los test del servidor web:
	npm test
	
- Ejecutar los test del servidor api:
	mocha ./test/<nombreArchivoTest>.js

Nota: Tener el servidor de redis en marcha.