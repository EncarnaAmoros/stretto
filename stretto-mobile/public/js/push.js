document.addEventListener('DOMContentLoaded', function(){
	navigator.serviceWorker
		.register('service_worker.js')
		.then(mostrarEstadoSuscripcion)
});


function mostrarEstadoSuscripcion(registration) {
	//Le preguntamos al pushManager si estamos suscritos
	registration.pushManager.getSubscription().then(function(subscription) {
		if (!subscription) {
			console.log('no estás suscrito')
			document.getElementById('mensaje_suscripcion').innerHTML = 'No estás suscrito. ¿Quieres suscribirte?';
			document.getElementById('cb_suscripcion').checked = false;

		}
		else {
			console.log("hol")
			console.log(subscription);
			document.getElementById('mensaje_suscripcion').innerHTML = 'Ya estás suscrito. Desmarca la casilla para eliminar la suscripción';
			document.getElementById('cb_suscripcion').click();
			document.getElementById('cb_suscripcion').checked = true;
		}
	});

}

document.getElementById('cb_suscripcion').addEventListener('click', cambiarSuscripcion);
document.getElementById('sus').addEventListener('click', cambiarSuscripcion);

function cambiarSuscripcion() {
	if (document.getElementById('cb_suscripcion').checked) {
		//El usuario ha marcado la casilla, suscribirnos
		navigator.serviceWorker.ready.then(function(registration) {
			return registration.pushManager.subscribe({userVisibleOnly: true});
		}).then(function(subscription) {
			console.log(subscription);
			crearSuscripcionEnNuestroServidor(subscription);
			document.getElementById('mensaje_suscripcion').innerHTML = 'Ya estás suscrito. Desmarca la casilla para eliminar la suscripción';
			document.getElementById('cb_suscripcion').checked = true;
		}).catch(function(error){
			console.log(error);
		});
	}
	else {
		var susc;
		navigator.serviceWorker.ready.then(function(registration) {
			console.log(registration)
			console.log(registration.pushManager)
			return registration.pushManager.getSubscription();
		}).then(function(subscription){
			susc = subscription;
			console.log(subscription)
			return subscription.unsubscribe();
		}).then(function(ok){
			eliminarSuscripcionDeNuestroServidor(susc);
			console.log('te has desuscrito OK de GCM: ' +  ok);
			document.getElementById('mensaje_suscripcion').innerHTML = 'No estás suscrito. ¿Quieres suscribirte?';
			document.getElementById('cb_suscripcion').checked = false;
		});

	}
}

function crearSuscripcionEnNuestroServidor(subscription) {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/api/suscripciones', true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onreadystatechange = function() {
		if (xhr.readyState==4 && xhr.status==201) {
			 console.log('suscripción almacenada en nuestro servidor')
		}
	};
	var obj = {};
	obj.id = extraerIdSuscripcionDeEndpoint(subscription.endpoint);
	xhr.send(JSON.stringify(obj));
}


function eliminarSuscripcionDeNuestroServidor(subscription) {
	var xhr = new XMLHttpRequest();
	xhr.open('DELETE', '/api/suscripciones/' + extraerIdSuscripcionDeEndpoint(subscription.endpoint), true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState==4 && xhr.status==200) {
			 console.log('suscripción eliminada de nuestro servidor')
		}
	};
	xhr.send();
}

//En GCM no tenemos acceso por separado al id de la suscripción, tenemos que extraerlo
//de la URL del endpoint. Es la última parte de esta URL
function extraerIdSuscripcionDeEndpoint(endpoint) {
	return endpoint.slice(endpoint.lastIndexOf('/')+1)
}