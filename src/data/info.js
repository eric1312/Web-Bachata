// ============================================================
//  TODA la información editable de la web vive en este archivo.
//  Para cambiar horarios, lugares o contacto, editá solo acá.
// ============================================================

export const profe = {
  nombre: 'Martin del Valle',
  telefono: '1132926319',
  // Formato internacional para WhatsApp (Argentina móvil: 549 + área + número)
  whatsappNumero: '5491132926319',
  whatsappMensaje: 'Hola Martin! Quiero info sobre las clases de salsa y bachata 💃🕺',
  instagramUser: 'Martindelvalle.ok',
  email: 'Martin.xx.delvalle@gmail.com',
  // TODO: reemplazar por el link directo a la playlist/perfil de Spotify cuando lo tengas
  spotifyUrl: 'https://open.spotify.com/search/martin%20del%20valle',
}

export const links = {
  whatsapp: `https://wa.me/${profe.whatsappNumero}?text=${encodeURIComponent(profe.whatsappMensaje)}`,
  instagram: `https://instagram.com/${profe.instagramUser.toLowerCase()}`,
  email: `mailto:${profe.email}`,
  telefono: `tel:+54${profe.telefono}`,
}

// Ciudad para armar el link a Google Maps (completar para que sea más preciso)
const CIUDAD = ''

// dia: 0 = domingo ... 6 = sábado
export const horarios = [
  {
    id: 'martes',
    dia: 'Martes',
    diaNumero: 2,
    lugar: 'Taller Municipal',
    sublugar: 'Galpón cultural',
    direccion: '',
    desde: '15:00',
    hasta: '17:00',
  },
  {
    id: 'miercoles',
    dia: 'Miércoles',
    diaNumero: 3,
    lugar: 'Auditorio Cestel',
    sublugar: '',
    direccion: 'Sarmiento 3177',
    desde: '19:00',
    hasta: '21:00',
  },
  {
    id: 'viernes',
    dia: 'Viernes',
    diaNumero: 5,
    lugar: 'Auditorio Biblioteca Mitre',
    sublugar: '',
    direccion: 'Rivadavia 3402',
    desde: '21:00',
    hasta: '23:00',
  },
].map((h) => ({
  ...h,
  mapsUrl: h.direccion
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        [h.lugar, h.direccion, CIUDAD].filter(Boolean).join(', ')
      )}`
    : null,
}))

export const textos = {
  lema:
    'Bailamos porque es una conducta innata que combina expresión emocional, comunicación social, placer físico y beneficios cognitivos y neurológicos.',
  queHacemos: {
    intro: 'Trabajamos desde cero acompañando el proceso.',
    detalle:
      'Los pasos básicos son el principio: la base necesaria que nos va a acompañar toda la vida, cada vez que bailemos.',
  },
  objetivos:
    'Ayudar a mejorar la confianza con uno mismo y la conexión con el cuerpo, desarrollando habilidades técnicas y creativas.',
  mision: [
    'Promover el rescate de los valores humanos, artísticos y culturales de la región a través del baile.',
    'Proyectar y mantener en el tiempo el baile como medio de enfoque socio-cultural.',
  ],
  plan: {
    intro:
      'Un plan de acción para clases de baile que se adapta según el nivel, el estilo y la edad de los alumnos.',
    puntos: [
      'Definir objetivos: técnica, coordinación, expresión y seguridad.',
      'Selección de música acorde al estilo y al nivel, con tempos progresivos para principiantes o nivel intermedio.',
    ],
  },
}
