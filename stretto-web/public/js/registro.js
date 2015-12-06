/* Control de la vista */

var mensaje = document.getElementById("mensaje2");
var divmensaje = document.getElementById("divmensaje2");

//Si se registra bien aparece mensaje verde con transición
function registroBien(resultado) {
	mensaje.innerHTML = resultado;
	mensaje.className = "alert alert-success";
	divmensaje.className = "mensajevisible";
}

//Si se registra bien aparece mensaje rojo con transición
function registroMal(resultado) {
	mensaje.innerHTML = resultado;
	mensaje.className = "alert alert-danger";
	divmensaje.className = "mensajevisible";
}

/* Control modelo llamadas al api*/

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

//Función para añadir un usuario
function addUsuario() {
	var nombre = document.getElementById("nombre").value;
	var email = document.getElementById("email").value;
	var password = document.getElementById("password").value;
	var tlf = document.getElementById("tlf").value;
	var divmensaje = document.getElementById("divmensaje").value;

	$.ajax({
		url: 'http://localhost:3000/stretto/usuarios',
		async: true,
		data : { nombre : nombre, email : email, password : password, tlf : tlf },
		type: 'POST',
		success: function(resultado) {
			registroBien(resultado);
			logeoUsuario(email, password);
		
			//Cuando pasen 2 segundos desaparecerá el modal al clicar en cancelar
			//Acción la cual llamará al controlador que cerrará el modal
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

/* Asociar acción en la vista a función que contacta con modelo */

var botonRegistro = document.getElementById("botonRegistro");
botonRegistro.onclick = addUsuario;