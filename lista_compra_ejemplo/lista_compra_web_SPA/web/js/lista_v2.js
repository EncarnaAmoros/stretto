
var ITEMS_URL = 'http://localhost:3000/api/items';

var PLANTILLA_ITEM = '<li id="id_{{id}}">{{nombre}} ' +
                     '<a href="javascript:deleteItem({{id}})">Eliminar</a> ' +
                     '<a href="javascript:verDetalles({{id}})">Detalles</a> ' +  
                     '</li>';
var plantillaItem = Handlebars.compile(PLANTILLA_ITEM);


function addItem() {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', ITEMS_URL, true);
      xhr.onreadystatechange = function() {
           if (xhr.readyState==4 && xhr.status==201) {
              alert('item creado');
              //aunque no sea estándar en REST, asumimos que el servidor nos envía el obj. creado
              var nuevo = JSON.parse(xhr.responseText);
              document
                .getElementById('lista')
                .insertAdjacentHTML('beforeend',
                    plantillaItem(nuevo));
           }
      }
      var nuevoItem = {nombre: document.getElementById('nuevo_item').value}
      xhr.setRequestHeader("Content-type", "application/json")
      xhr.send(JSON.stringify(nuevoItem));
}


function deleteItem(id) {
      var xhr = new XMLHttpRequest();
      xhr.open('DELETE', ITEMS_URL+'/'+id, true);
      xhr.onreadystatechange = function() {
           if (xhr.readyState==4 && xhr.status==204) {
              alert('Item eliminado');
              document.getElementById('id_'+id).remove();
           }
      }
      xhr.send();
}

function verDetalles(id) {
    location.href="detalles.html?id=" + id;
}