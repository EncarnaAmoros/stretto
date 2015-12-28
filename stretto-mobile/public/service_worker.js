console.log('hola soy el Service Worker');

self.addEventListener('push', function(notificacion) {
	console.log('notificación push');
	console.log(notificacion);
	fetch('api/notificaciones/ultima').then(function(resp){
		resp.json().then(function(datos) {
			self.registration.showNotification(datos.titulo, {
				body: datos.contenido,
				icon: 'icono.png'
			});			
		});
	});
})