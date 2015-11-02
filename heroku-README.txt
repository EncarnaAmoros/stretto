Pasos seguidos para desplegar el API en Heroku:

1. Creamos una cuenta en heroku:
	https://signup.heroku.com/identity
2. Lo instalamos para nuestro S.O (en este caso windows):
	https://toolbelt.heroku.com/
3. Instalamos, abrimos su consola e iniciamos sesión en ella:
	heroku login (con la cuenta recién creada)
4. Desde la consola vamos a la carpeta donde este nuestra app y:
	heroku create
5. Inicializamos git
	git init
	git add (añadimos los que queramos subir, por ejemplo 	dejamos las dependencias)
	git commit -m "mensaje del commit"
	git push heroku master (lo subimos a la nube)
6. heroku open (para el despliege en la web)
7. Podemos cambiarle el nombre con:
	heroku apps:rename <newnombre> --app <nombre_dado_defecto>
	EJ:	heroku apps:rename stretto --app warm-mountain-9731
8. Si tenemos algun error para verlos:
	heroku logs 
8. Vamos a la web
	https://<nombre>.herokuapp.com/
	EJ:	https://stretto.herokuapp.com/
	
	Navegamos por la api por nuestras rutas, ejemplos:
	https://stretto.herokuapp.com/stretto
	https://stretto.herokuapp.com/stretto/usuarios/1
	https://stretto.herokuapp.com/stretto/articulos

9. Cada vez que haya cambios subir con:
	git add (lo que sea)
	git commit -m "mensaje del commit"
	git push heroku master