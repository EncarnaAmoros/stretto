/* VISTA */

var mensaje = document.getElementById("mensajeregistro");
var divmensaje = document.getElementById("divmensajeregistro");

function visible() {
	divmensaje.className = "mensajevisible";
}

//Si se registra bien aparece mensaje verde con transición
function registroBien(resultado) {
	mensaje.innerHTML = resultado;
	mensaje.className = "alert alert-success";
	visible();
}

//Si se registra bien aparece mensaje rojo con transición
function registroMal(resultado) {
	mensaje.innerHTML = resultado;
	mensaje.className = "alert alert-danger";
	visible();
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
			registroBien(resultado);
			logeoUsuario(email, password);
		
			//Cuando pasen 2 segundos desaparecerá el modal
			setTimeout(function(){  
				var cancelar = document.getElementById("cancelar");
				cancelar.click();
			}, 2000);
	 	}, 
		error: function(resultado) {
			registroMal("Error código: "+resultado.status+" "+resultado.responseText);
		}
 });
}

/* ASOCIAR ACCIÓN EN VISTA A FUNCIÓN CONTROL MODELO */

var botonRegistro = document.getElementById("botonRegistro");
botonRegistro.onclick = addUsuario;