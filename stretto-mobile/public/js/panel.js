var mostrarUsuarioPanel = function() {
	var usuario = document.getElementById("nombreusuario");
	if(localStorage.email!=undefined)
		usuario.innerHTML = localStorage.email;
	else
		usuario.innerHTML = "Invitado";
}
mostrarUsuarioPanel();

var logout = function() {
	localStorage.clear();
	$.mobile.pageContainer.pagecontainer('change', '#principal');
	location.reload();
}

var verPerfil = function() {
	if(localStorage.id==undefined)
		mostrarMensaje("No has iniciado sesión","404");
	else
		$.mobile.pageContainer.pagecontainer('change', '#usuariodetalle', {usuarioId: localStorage.id});
}

var editarPerfil = function() {
	if(localStorage.id==undefined)
		mostrarMensaje("No has iniciado sesión","404");
	else
		$.mobile.pageContainer.pagecontainer('change', '#usuarioeditable', {usuarioId: localStorage.id});
}

var verMisArticulos = function() {
	if(localStorage.id==undefined)
		mostrarMensaje("No has iniciado sesión","404");
	else
		$.mobile.pageContainer.pagecontainer('change', '#articulosusuario', {usuarioId: localStorage.id});
}