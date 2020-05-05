const express=require('express')
const path=require('path')
const http=require('http')
const app=express()
const socketio=require('socket.io')
const {generarMensaje,generarMensajeUbicacion}=require('./utils/mensajes')
const {adicionarUsuario,eliminarUsuario,obtenerUsuario,obtenerUsuariosEnSala}=require('./utils/usuarios')


const port=process.env.PORT||3000

const server=http.createServer(app)
const io=socketio(server)


//const viewPaths=path.join(__dirname,'../pages/views')

const directorioPublico=path.join(__dirname,'../pages/public/')

let contador=0

app.use('/',express.static(directorioPublico))


io.on('connection',(socket)=>{
  //socket.emit('message','Primer envio')
  socket.broadcast.emit('message','Nuevo Usuario')

  socket.on('enviarMensaje',(mensaje,callback)=>{
    const usuario= obtenerUsuario(socket.id)
    io.to(usuario.sala).emit('message',generarMensaje(usuario.username,mensaje))
    callback('entregado')

    //io.emit('message',mensaje)
  })

  socket.on('enviarLocalizacion',(mensaje,callback)=>{
    const usuario= obtenerUsuario(socket.id)
    io.to(usuario.sala).emit('recibirUbicacion',generarMensajeUbicacion(usuario.username,'https://google.com/maps?q='+mensaje.lat+','+mensaje.lon))
    callback()
  })


  socket.on('enviarUbicacion',(mensaje)=>{
    console.log(mensaje)
    io.emit('message',mensaje)

    //io.emit('message',mensaje)
  })

  socket.on('join',(opciones,callback)=>{
    const {error,usuario}= adicionarUsuario({id:socket.id,...opciones})
    if(error){
        return callback(error)
    }
    socket.join(usuario.sala)
    socket.emit('message',generarMensaje('Admin','Bienvenido!'))
    socket.broadcast.to(usuario.sala).emit('message',generarMensaje('Admin',usuario.username+' se ha unido'))
    io.to(usuario.sala).emit('datosSala',{
      sala:usuario.sala,
      usuarios:obtenerUsuariosEnSala(usuario.sala)
    })
    callback()
  })

  socket.on('disconnect',()=>{
    const usuarioEliminado=eliminarUsuario(socket.id)
    if(usuarioEliminado){
        io.to(usuarioEliminado.sala).emit('message',generarMensaje('Admin',usuarioEliminado.username+' ha salido de la sala'))
        io.to(usuarioEliminado.sala).emit('datosSala',{
          sala:usuarioEliminado.sala,
          usuarios:obtenerUsuariosEnSala(usuarioEliminado.sala)
        })
    }
  })

/*  socket.on('recibirMensaje',()=>{
    io.emit('message','Recibiendo Mensaje')
  })*/
  /*socket.emit('aumentarContador',contador)
  socket.on('incrementar',()=>{
    contador=contador+1
    io.emit('aumentarContador',contador)
  })*/

})

server.listen(port,()=>{
  console.log('El servidor se esta iniciando por el puerto'+port)
})

module.exports=app
