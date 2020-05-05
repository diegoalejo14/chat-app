const usuarios=[]


const adicionarUsuario=({id,username,sala})=>{
    username=username.trim().toLowerCase()
    sala=sala.trim().toLowerCase()
    if(!username|| !sala){
      return {
        error:'Usuario y sala es requerida'
      }
    }

    const usuarioExistente=usuarios.find((usuario)=>{
      return usuario.sala === sala && usuario.username===username
    })

    if(usuarioExistente){
      return {
        error:'Usuario ya está en uso'
      }
    }
    const usuario={id,username,sala}
    usuarios.push(usuario)
    return {usuario}
}


const eliminarUsuario=(id)=>{
    const indice=usuarios.findIndex((usuario)=>usuario.id===id)
    if(indice!==-1){
      return usuarios.splice(indice,1)[0]
    }
  }

const obtenerUsuario=(id)=>{
  return usuarios.find((usuario)=>usuario.id===id)
}

const obtenerUsuariosEnSala=(nombreSala)=>{
  return usuarios.filter((usuario)=>usuario.sala===nombreSala)
}

/*
adicionarUsuario({
    id:22,
    username:'AlejoPrueba',
    sala:'Sala1'
  })



  const usuarioprueba=adicionarUsuario({
      id:25,
      username:'AlejoPrueba',
      sala:'Sala1'
    })


    adicionarUsuario({
        id:26,
        username:'AlejoPrueba26',
        sala:'Sala2'
      })


      adicionarUsuario({
          id:40,
          username:'AlejoPrueba40',
          sala:'Sala2'
        })

console.log(usuarios)
elUsuario=eliminarUsuario(22)
  console.log('Eliminando el 22',usuarios)

const usuarioEncontrado=obtenerUsuario(40)
console.log('Obteniendo 40',usuarioEncontrado)
const usuariosSala=obtenerUsuariosEnSala('sala1')
console.log('Obteniendo Sala 2',usuariosSala)*/

module.exports={adicionarUsuario,eliminarUsuario,obtenerUsuario,obtenerUsuariosEnSala}
