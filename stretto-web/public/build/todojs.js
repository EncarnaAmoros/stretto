function visible(){divmensaje.className="mensajevisible"}function registroBien(e){mensaje.innerHTML=e,mensaje.className="alert alert-success",visible()}function registroMal(e){mensaje.innerHTML=e,mensaje.className="alert alert-danger",visible()}function obtenerUsuarioVista(){return{nombre:document.getElementById("nombre").value,email:document.getElementById("email").value,password:document.getElementById("password").value,tlf:document.getElementById("tlf").value}}function logeoUsuario(e,o){$.ajax({url:"http://localhost:3000/stretto/usuarios/login?email="+e+"&password="+o,async:!0,type:"GET",success:function(t){localStorage.id=t.id,localStorage.email=e,localStorage.password=o}})}function addUsuario(){var e=obtenerUsuarioVista().nombre,o=obtenerUsuarioVista().email,t=obtenerUsuarioVista().password,a=obtenerUsuarioVista().tlf;$.ajax({url:"http://localhost:3000/stretto/usuarios",async:!0,data:{nombre:e,email:o,password:t,tlf:a},type:"POST",success:function(e){registroBien(e),logeoUsuario(o,t),setTimeout(function(){var e=document.getElementById("cancelar");e.click()},2e3)},error:function(e){registroMal("Error código: "+e.status+" "+e.responseText)}})}var strettoApp=angular.module("strettoApp",["ngRoute","strettoControllers","strettoService"]),rutaorigen="/";strettoApp.config(function(e,o){o.when("/registro",{templateUrl:rutaorigen+"partials/registro.html",controller:"RegistroCtrl"}).when("/articulos",{templateUrl:rutaorigen+"partials/articulos-list.html",controller:"ArticulosCtrl"}).when("/articulos/:id",{templateUrl:rutaorigen+"partials/articulo-detalle.html",controller:"ArticuloCtrl"}).when("/usuarios/:id",{templateUrl:rutaorigen+"partials/usuario-detalle.html",controller:"UsuarioCtrl"}).when("/usuarios/:id/articulos",{templateUrl:rutaorigen+"partials/articulos-usuario-list.html",controller:"UsuarioArticulosCtrl"}).otherwise({redirectTo:"/articulos"}),e.html5Mode({enabled:!0,requireBase:!1})});var strettoControllers=angular.module("strettoControllers",["ui.bootstrap","ngRoute","strettoService"]),rutaorigen="/";strettoControllers.controller("NavCtrl",["$scope","$modal","$window",function(e,o,t){var a=function(){void 0!=localStorage.email?(e.showme=!1,e.usuario=localStorage.email,e.id=localStorage.id):(e.showme=!0,e.mensaje="Iniciar sesión")};a(),e.showModalLogin=function(){mostrarLogin(o,t)},e.logout=function(){localStorage.clear(),a()}}]),strettoControllers.controller("ArticulosCtrl",["$scope","$http","$routeParams","articulosService","tiposService",function(e,o,t,a,i){var r=function(){a.getArticulos(t.page).success(function(o){e.articulos=o.data}).error(function(e){}),i.getTipos().success(function(o){e.tipos=o}).error(function(e){})};r(),e.pasarPaginaSiguiente=function(){if(""==t.page||void 0==t.page)t.page=2,r();else{var e=1+parseInt(t.page);t.page=e,r()}window.scrollTo(0,0)},e.pasarPaginaAnterior=function(){if(""==t.page||void 0==t.page||1==t.page||"1"==t.page)console.log("no hay anterior");else{var e=parseInt(t.page)-1;t.page=e,r()}window.scrollTo(0,0)}}]),strettoControllers.controller("ArticuloCtrl",["$scope","$http","$routeParams","articuloService",function(e,o,t,a){a.getArticulo(t.id).success(function(o){e.articulo=o.data,e.usuario=o.usuario}).error(function(e){}),e.comprarArticulo=function(){e.mensaje="Compra realizada con éxito. ¡Gracias por confiar en Stretto!",a.compradoBien()}}]),strettoControllers.controller("UsuarioArticulosCtrl",["$scope","$http","$routeParams","$window","$modal","articulosService","tiposService","articuloService","$timeout",function(e,o,t,a,i,r,n,s,l){t.id==localStorage.id?e.sonmisarticulos=!0:e.sonmisarticulos=!1;var c,u=function(){r.getArticulosUsuario(t.id,t.page).success(function(o){e.articulos=o.data}).error(function(e){}),n.getTipos().success(function(o){e.tipos=o,c=o}).error(function(e){})};u(),e.pasarPaginaSiguiente=function(){if(""==t.page||void 0==t.page)t.page=2,u();else{var e=1+parseInt(t.page);t.page=e,u()}window.scrollTo(0,0)},e.pasarPaginaAnterior=function(){if(""==t.page||void 0==t.page||1==t.page);else{var e=parseInt(t.page)-1;t.page=e,u()}window.scrollTo(0,0)},e.editableView=function(e){void 0==localStorage.email&&void 0==localStorage.password?mostrarLogin(i,a):e.showdetailedit=!0},e.cancelarEdit=function(o){u(),e.detailView(o),r.modificadoDesaparece()},e.detailView=function(e){e.showdetailedit=!1},e.showModalAddArticulo=function(){e.datos={};var o=i.open({templateUrl:rutaorigen+"partials/add-articulo.html",resolve:{Tipos:function(){return c}},controller:"AddArticulosCtrl"});o.result.then(function(e){u()})},e.updateArticulo=function(o){s.updateArticulo(o).success(function(t,a,i,n){u(),e.detailView(o),e.mensaje="Artículo actualizado con éxito",r.modificadoBien(),l(function(){r.modificadoDesaparece()},2e3)}).error(function(o,t,a,i){e.mensaje="Error código: "+t+" "+o,r.modificadoMal()})},e.deleteArticulo=function(o){void 0==localStorage.email&&void 0==localStorage.password?mostrarLogin(i,a):s.deleteArticulo(o).success(function(o,t,a,i){u(),e.mensaje="Artículo eliminado con éxito",r.modificadoBien(),l(function(){r.modificadoDesaparece()},2e3)}).error(function(o,t,a,i){e.mensaje="Error código: "+t+" "+o,r.modificadoMal(),l(function(){r.modificadoDesaparece()},2e3)})}}]),strettoControllers.controller("AddArticulosCtrl",["$scope","$http","$modalInstance","Tipos","articulosService","$timeout","articuloService",function(e,o,t,a,i,r,n){e.tipos=a,e.cancelshowModalAddArticulo=function(){t.dismiss()},e.addArticulo=function(o){n.addArticulo(e.datos).success(function(o,a,n,s){e.mensaje=o,i.addBien(),r(function(){var o=e.datos;t.close(o)},2e3)}).error(function(o,t,a,r){e.mensaje="Error código: "+t+" "+o,i.addMal()})}}]),strettoControllers.controller("UsuarioCtrl",["$scope","$http","$routeParams","$window","usuarioService","$timeout",function(e,o,t,a,r,n){var s=function(){t.id==localStorage.id?e.showusuario=!1:e.showusuario=!0,r.getUsuario(t.id).success(function(o){if(e.usuario=o.data,e.last_articulos=o.articulos,void 0!=e.last_articulos)for(i=0;i<e.last_articulos.length;i++)e.last_articulos[i].descripcion=e.last_articulos[i].descripcion.slice(0,161)+"..."}).error(function(e){})};s(),e.editableView=function(){e.showdetailedit=!0},e.cancelarEdit=function(){s(),e.detailView(),r.modificadoDesaparece()},e.detailView=function(){e.showdetailedit=!1},e.updateUsuario=function(o){r.updateUsuario(o).success(function(o,t,a,i){e.mensaje="Usuario actualizado con éxito",s(),e.detailView(),r.modificadoBien(),n(function(){r.modificadoDesaparece()},2e3)}).error(function(o,t,a,i){e.mensaje="Error código: "+t+" "+o,r.modificadoMal()})},e.deleteUsuario=function(o){r.deleteUsuario(o).success(function(e,o,t,i){alert("Cuenta eliminada con éxito"),localStorage.clear(),a.location.href="/"}).error(function(o,t,a,i){e.mensaje="Error código: "+t+" "+o,r.modificadoMal()})}}]),strettoControllers.controller("LoginCtrl",["$scope","$http","$window","$modalInstance","loginService","$timeout","$location",function(e,o,t,a,i,r,n){e.cancelshowModalLogin=function(){a.dismiss()},e.vistaRegistro=function(){e.showInicioRegistro=!0},e.vistaInicioSesion=function(){e.showInicioRegistro=!1},e.datos={},e.login=function(){i.getLogin(e.datos.email,e.datos.password).success(function(o){localStorage.email=e.datos.email,localStorage.password=e.datos.password,localStorage.id=o.id,e.mensaje=o.mensaje,i.loginBien(),r(function(){a.close(),n.path("/articulos")},2e3)}).error(function(o){e.mensaje="Error código: "+status+" "+o,i.loginMal()})},e.cancelshowModalRegistro=function(){a.dismiss()},e.registroCorrecto=function(){r(function(){a.close(),t.location.href="articulos"},2e3)},e.registroError=function(){e.mensaje="Error código: "+status+" "+data,i.loginMal()}}]);var mostrarLogin=function(e,o){var t=e.open({templateUrl:rutaorigen+"partials/login.html",controller:"LoginCtrl"});t.result["finally"](function(){o.location.href="/"})},mensaje=document.getElementById("mensajeregistro"),divmensaje=document.getElementById("divmensajeregistro"),botonRegistro=document.getElementById("botonRegistro");botonRegistro.onclick=addUsuario;var strettoService=angular.module("strettoService",["ngRoute"]),URL_API="http://localhost:3000/stretto/";strettoService.service("tiposService",function(e){return{getTipos:function(){return e.get(URL_API+"tipos")}}}),strettoService.service("articuloService",function(e){return{getArticulo:function(o){return e.get(URL_API+"articulos/"+o)},addArticulo:function(o){return e({method:"POST",url:URL_API+"articulos",data:o,headers:{Authorization:"Basic "+btoa(localStorage.email+":"+localStorage.password)}})},deleteArticulo:function(o){return e({method:"DELETE",url:URL_API+"articulos/"+o,headers:{Authorization:"Basic "+btoa(localStorage.email+":"+localStorage.password)}})},updateArticulo:function(o){return e({method:"PUT",url:URL_API+"articulos/"+o.id,data:o,headers:{Authorization:"Basic "+btoa(localStorage.email+":"+localStorage.password)}})},divmensaje:document.getElementById("divmensaje"),compradoBien:function(){divmensaje.className="mensajevisible"},compradoDesaparece:function(){divmensaje.className="mensajedesaparece"}}}),strettoService.service("articulosService",function(e){return{getArticulos:function(o){return e.get(URL_API+"articulos?page="+o)},getArticulosUsuario:function(o,t){return e.get(URL_API+"usuarios/"+o+"/articulos?page="+t)},mensaje:document.getElementById("mensaje"),divmensaje:document.getElementById("divmensaje"),mensaje2:document.getElementById("mensaje"),divmensaje2:document.getElementById("divmensaje"),modificadoBien:function(){mensaje.className="alert alert-success",divmensaje.className="mensajevisible"},modificadoMal:function(){mensaje.className="alert alert-danger",divmensaje.className="mensajevisible"},modificadoDesaparece:function(){divmensaje.className="mensajedesaparece"},addBien:function(){mensaje2.className="alert alert-success",divmensaje2.className="mensajevisible"},addMal:function(){mensaje2.className="alert alert-danger",divmensaje2.className="mensajevisible"}}}),strettoService.service("usuarioService",function(e){return{getUsuario:function(o){return e.get(URL_API+"usuarios/"+o)},deleteUsuario:function(o){return e({method:"DELETE",url:URL_API+"usuarios/"+o,headers:{Authorization:"Basic "+btoa(localStorage.email+":"+localStorage.password)}})},updateUsuario:function(o){return e({method:"PUT",url:URL_API+"usuarios/"+o.id,data:o,headers:{Authorization:"Basic "+btoa(localStorage.email+":"+localStorage.password)}})},mensaje:document.getElementById("mensaje"),divmensaje:document.getElementById("divmensaje"),modificadoBien:function(){mensaje.className="alert alert-success",divmensaje.className="mensajevisible"},modificadoMal:function(){mensaje.className="alert alert-danger",divmensaje.className="mensajevisible"},modificadoDesaparece:function(){divmensaje.className="mensajedesaparece"}}}),strettoService.service("loginService",function(e){return{getLogin:function(o,t){return e.get(URL_API+"usuarios/login?email="+o+"&password="+t)},loginBien:function(){var e=document.getElementById("mensajelogin"),o=document.getElementById("divmensajelogin");e.className="alert alert-success",o.className="mensajevisible"},loginMal:function(){var e=document.getElementById("mensajelogin"),o=document.getElementById("divmensajelogin");e.className="alert alert-danger",o.className="mensajevisible"}}});