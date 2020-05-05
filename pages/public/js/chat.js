const socket=io.connect()

const $messageForm=document.querySelector('#message-form')
const $messageFormInput=document.querySelector('input')

const $messageFormButton=document.querySelector('button')
const $messageUbicacionButton=document.querySelector('#compartirUbicacion')
const $templateMensaje=document.querySelector('#template-mensaje').innerHTML
const $templateUbicacion=document.querySelector('#template-ubicacion').innerHTML

const $mensajes=document.querySelector('#mensajes')
const $urlUbicacion=document.querySelector('#url')
const $sidebarTemplate=document.querySelector('#sidebar-template').innerHTML

const {username,sala}=Qs.parse(location.search,{ignoreQueryPrefix:true})


const autoscroll=()=>{
  const $mensajeNuevo=$mensajes.lastElementChild
  const mensajeNuevoEstilo=getComputedStyle($mensajeNuevo)
  const margenNueva=parseInt(mensajeNuevoEstilo.marginBottom)
  const mensajeNuevoHeight=$mensajeNuevo.offsetHeight+margenNueva
  const alturaVisible=$mensajeNuevo.offsetHeight
  const alturaContenedor=$mensajeNuevo.scrollHeight
  const scrollOffset=$mensajes.scrollTop+alturaVisible
  if(scrollOffset-mensajeNuevoHeight<=scrollOffset){
    $mensajes.scrollTop=$mensajes.scrollHeight
  }
}


socket.on('message',(mensaje)=>{
  const html=Mustache.render($templateMensaje,{
    username:mensaje.username,
    mensaje:mensaje.texto,
    fechaCreacion: moment(mensaje.creado).format('h:mm a')
  })
  $mensajes.insertAdjacentHTML('beforeend',html)
  autoscroll()
})

socket.on('recibirUbicacion',(mensajeUrl)=>{
  const html=Mustache.render($templateUbicacion,{
    username:mensajeUrl.username,
    url:mensajeUrl.url,
    fechaCreacion: moment(mensajeUrl.creado).format('h:mm a')

  })
  $mensajes.insertAdjacentHTML('beforeend',html)
})






$messageForm.addEventListener('submit',(e)=>{
  e.preventDefault()
  let mensaje=$messageFormInput.value
  $messageFormButton.setAttribute('disabled','disabled')
  socket.emit('enviarMensaje',mensaje,(error)=>{
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value=''
    $messageFormInput.focus()
    if(error){
      return console.log(error)
    }
  })})

$messageUbicacionButton.addEventListener('click',()=>{
  $messageUbicacionButton.setAttribute('disabled','disabled')
  socket.emit('enviarLocalizacion',{
      lat: 4.6493,
      lon: -74.0617
  },()=>{
      $messageUbicacionButton.removeAttribute('disabled')
      console.log('Ubicacion Compartida')
  })
})


socket.emit('join',{username,sala},(error)=>{
  console.log(error)
})

socket.on('datosSala',({sala,usuarios})=>{
  console.log(sala)
  console.log(usuarios)
  const html=Mustache.render($sidebarTemplate,{
    sala,
    usuarios,
  })
  document.querySelector('#sidebar').innerHTML=html

})
