const generarMensaje=(username,texto)=>{
  return {
    username,
    texto,
    creado:new Date().getTime()
  }
}

const generarMensajeUbicacion=(username,url)=>{
  return {
    username,
    url,
    creado:new Date().getTime()
  }
}


module.exports={generarMensaje,generarMensajeUbicacion}
