/* VISTA */

//MOSTRAR MENSAJE
var mostrarMensaje = function(mensaje, codigo) {
	new $.nd2Toast({ // The 'new' keyword is important, otherwise you would overwrite the current toast instance
	 message : codigo+": "+mensaje, // Required
	 action : { // Optional (Defines the action button on the right)
		 fn : function() { // function that will be triggered when action clicked
		 }
	 },
	 ttl : 3000 // optional, time-to-live in ms (default: 3000)
	});
}

//Si se registra bien aparece mensaje verde con transición
function registroBien(data, status) {
	mostrarMensaje(data, status);
}

//Si se registra bien aparece mensaje rojo con transición
function registroMal(data, status) {
	mostrarMensaje(data, status);
}

// Obtiene los datos del usuario de la vista
function obtenerUsuarioVista() {
	return {
		nombre: document.getElementById("nombre").value,
		email: document.getElementById("email").value,
		password: document.getElementById("password").value,
		tlf: document.getElementById("tlf").value,
	}
}

/* CONTROL MODELO LLAMADAS A LA API */

//Para logear un usuario
function logeoUsuario(email, password) {
	$.ajax({
		url: 'http://localhost:3000/stretto/usuarios/login?email='+email+'&password='+password,
		async: true,
		type: 'GET',
		success: function(resultado) {
			localStorage.id = resultado.id;
			localStorage.email = email;
			localStorage.password = password;
	 	}
 });
}

// Función para añadir un usuario
function addUsuario() {
	var nombre = obtenerUsuarioVista().nombre;
	var email = obtenerUsuarioVista().email;
	var password = obtenerUsuarioVista().password;
	var tlf = obtenerUsuarioVista().tlf;

	$.ajax({
		url: 'http://localhost:3000/stretto/usuarios',
		async: true,
		data : { nombre : nombre, email : email, password : password, tlf : tlf },
		type: 'POST',
		success: function(resultado) {
			registroBien(resultado.responseText, resultado.status);
			logeoUsuario(email, password);
		
			//Cuando pasen 2 segundos desaparecerá el modal
			setTimeout(function(){  
				$.mobile.pageContainer.pagecontainer('change', '#principal');
			}, 2000);
	 	}, 
		error: function(resultado) {
			registroMal(resultado.responseText, resultado.status);
		}
 });
}

/* ASOCIAR ACCIÓN EN VISTA A FUNCIÓN CONTROL MODELO */

var botonRegistro = document.getElementById("botonRegistro");
botonRegistro.onclick = addUsuario;