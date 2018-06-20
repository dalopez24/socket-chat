const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios')
const { crearMensaje } = require('../utils/utils')
const usuarios = new Usuarios()


io.on('connection', (client) => {

    client.on('entrarChat', (usuario, callback) => {

        if (!usuario.nombre || !usuario.sala) {
            callback({
                err: true,
                message: 'El nombre y la sala es necesaria'
            })
        }

        client.join(usuario.sala)



        usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala)


        client.broadcast.to(usuario.sala).emit('listaPersonas', usuarios.getPersonaPorSala(usuario.sala))


        callback(usuarios.getPersonaPorSala(usuario.sala))

    })




    client.on('crearMensaje', (data) => {
        let persona = usuarios.getPersona(client.id)
        let mensaje = crearMensaje(persona.nombre, data.mensaje)
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje)

    })

    client.on('mensajePrivado', (data) => {
        let persona = usuarios.getPersona(client.id)
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))
    })

    client.on('disconnect', () => {
        let personaBorrada = usuarios.deletePersona(client.id)


        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Admin', `${personaBorrada.nombre} ha abandonado el chat`))
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonaPorSala(personaBorrada.sala))
    })

})