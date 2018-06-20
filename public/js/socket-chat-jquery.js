var params = new URLSearchParams(window.location.search)

var nombre = params.get('nombre')
var sala = params.get('sala')


var divUsuarios = $('#divUsuarios')
var formEnviar = $('#formEnviar')
var txtMensaje = $('#txtMensaje')
var divChatbox = $('#divChatbox')
    //Funciones para renderizar usuarios
function renderizarUsuarios(personas) {

    var html = ''
    html += '<li>'
    html += '  <a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + '</span></a>'
    html += '</li>'


    for (var i = 0; i < personas.length; i++) {
        html += '<li>'
        html += '    <a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + '<small class="text-success">online</small></span></a>'
        html += '</li>'
    }


    divUsuarios.html(html)


}

function renderizarMensajes(mensaje, yo) {
    var htmlMensaje = ''
    var fecha = new Date(mensaje.fecha)
    var hora = fecha.getHours() + ':' + fecha.getMinutes()

    var adminClass = 'info'

    if (mensaje.nombre !== 'Administrador') {
        adminClass = 'danger'
    }

    if (yo) {
        htmlMensaje += '<li class="reverse">'
        htmlMensaje += '        <div class="chat-content">'
        htmlMensaje += '               <h5>' + mensaje.nombre + '</h5>'
        htmlMensaje += '                <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>'
        htmlMensaje += '        </div>'
        htmlMensaje += '        <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>'
        htmlMensaje += '        <div class="chat-time">' + hora + '</div>'
        htmlMensaje += '</li>'

    } else {

        htmlMensaje += '<li class="animated fadeIn">'
        htmlMensaje += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>'
        htmlMensaje += '    <div class="chat-content">'
        htmlMensaje += '        <h5>' + mensaje.nombre + '</h5>'
        htmlMensaje += '        <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>'
        htmlMensaje += '    </div>'
        htmlMensaje += '    <div class="chat-time">' + hora + '</div>'
        htmlMensaje += '</li>'
    }
    divChatbox.append(htmlMensaje)
    scrollBottom()

}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}
//Listeners

divUsuarios.on('click', 'a', function() {

    var id = $(this).data('id')
    if (id) {
        console.log(id);
    }

})


formEnviar.on('submit', function(e) {
    e.preventDefault()

    if (txtMensaje.val().trim().length === 0) return

    socket.emit('crearMensaje', {
        nombre: nombre,
        sala: sala,
        mensaje: txtMensaje.val()
    }, function(resp) {
        txtMensaje.val('').focus()
        renderizarMensajes(resp, true)
    });

})