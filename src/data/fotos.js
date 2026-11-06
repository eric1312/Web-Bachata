// ============================================================
//  Fotos de la galería. Para sumar una foto nueva mirá el README
//  (sección "Cómo agregar fotos"). El orden de esta lista es el
//  orden en que aparecen en la web. La primera es la PORTADA.
// ============================================================

import f16 from '../assets/fotos/16.webp'
import t16 from '../assets/fotos/16-thumb.webp'
import f07 from '../assets/fotos/07.webp'
import t07 from '../assets/fotos/07-thumb.webp'
import f12 from '../assets/fotos/12.webp'
import t12 from '../assets/fotos/12-thumb.webp'
import f03 from '../assets/fotos/03.webp'
import t03 from '../assets/fotos/03-thumb.webp'
import f15 from '../assets/fotos/15.webp'
import t15 from '../assets/fotos/15-thumb.webp'
import f05 from '../assets/fotos/05.webp'
import t05 from '../assets/fotos/05-thumb.webp'
import f11 from '../assets/fotos/11.webp'
import t11 from '../assets/fotos/11-thumb.webp'
import f04 from '../assets/fotos/04.webp'
import t04 from '../assets/fotos/04-thumb.webp'
import f09 from '../assets/fotos/09.webp'
import t09 from '../assets/fotos/09-thumb.webp'
import f14 from '../assets/fotos/14.webp'
import t14 from '../assets/fotos/14-thumb.webp'
import f06 from '../assets/fotos/06.webp'
import t06 from '../assets/fotos/06-thumb.webp'
import f17 from '../assets/fotos/17.webp'
import t17 from '../assets/fotos/17-thumb.webp'
import f02 from '../assets/fotos/02.webp'
import t02 from '../assets/fotos/02-thumb.webp'
import f13 from '../assets/fotos/13.webp'
import t13 from '../assets/fotos/13-thumb.webp'
import f08 from '../assets/fotos/08.webp'
import t08 from '../assets/fotos/08-thumb.webp'
import f01 from '../assets/fotos/01.webp'
import t01 from '../assets/fotos/01-thumb.webp'
import f10 from '../assets/fotos/10.webp'
import t10 from '../assets/fotos/10-thumb.webp'
import f18 from '../assets/fotos/18.webp'
import t18 from '../assets/fotos/18-thumb.webp'

export const categorias = [
  { id: 'todas', label: 'Todas' },
  { id: 'baile', label: 'Baile' },
  { id: 'retratos', label: 'Retratos' },
  { id: 'percusion', label: 'Percusión' },
]

export const fotos = [
  { id: 16, cat: 'percusion', src: f16, thumb: t16, w: 1200, h: 1800, tw: 480, th: 720, pos: '50% 35%',
    alt: 'Martin sonriendo y levantando una conga sobre su cabeza' },
  { id: 7, cat: 'retratos', src: f07, thumb: t07, w: 1800, h: 1200, tw: 720, th: 480, pos: '50% 18%',
    alt: 'Martin de blanco con las manos abiertas, mirando a cámara' },
  { id: 12, cat: 'baile', src: f12, thumb: t12, w: 1800, h: 1200, tw: 720, th: 480, pos: '50% 45%',
    alt: 'Martin bailando de traje negro y lentes de sol, con las piernas cruzadas' },
  { id: 3, cat: 'baile', src: f03, thumb: t03, w: 1200, h: 1800, tw: 480, th: 720, pos: '50% 30%',
    alt: 'Martin con un brazo extendido hacia arriba y la mirada alta, frente a un fondo gris' },
  { id: 15, cat: 'percusion', src: f15, thumb: t15, w: 1800, h: 1200, tw: 720, th: 480, pos: '62% 50%',
    alt: 'Martin arrodillado y apoyado sobre dos congas, con otros instrumentos de percusión en el piso' },
  { id: 5, cat: 'baile', src: f05, thumb: t05, w: 1200, h: 1800, tw: 480, th: 720, pos: '50% 22%',
    alt: 'Martin de conjunto blanco junto a una planta y una cortina, en posición de baile' },
  { id: 11, cat: 'retratos', src: f11, thumb: t11, w: 1800, h: 1200, tw: 720, th: 480, pos: '60% 40%',
    alt: 'Martin de traje negro y lentes de sol recostado contra la pared, con una conga desenfocada en primer plano' },
  { id: 4, cat: 'baile', src: f04, thumb: t04, w: 1200, h: 1800, tw: 480, th: 720, pos: '50% 40%',
    alt: 'Martin con las piernas abiertas, sonriendo y mirando hacia un costado' },
  { id: 9, cat: 'retratos', src: f09, thumb: t09, w: 1800, h: 1200, tw: 720, th: 480, pos: '50% 40%',
    alt: 'Martin apoyado en una pared blanca con los brazos abiertos y los ojos cerrados' },
  { id: 14, cat: 'baile', src: f14, thumb: t14, w: 1800, h: 1200, tw: 720, th: 480, pos: '50% 40%',
    alt: 'Martin agachado en pose de baile, vestido de negro y con lentes de sol' },
  { id: 6, cat: 'retratos', src: f06, thumb: t06, w: 1200, h: 1800, tw: 480, th: 720, pos: '50% 25%',
    alt: 'Retrato de Martin de conjunto blanco sin mangas, mirando a cámara' },
  { id: 17, cat: 'percusion', src: f17, thumb: t17, w: 1200, h: 1800, tw: 480, th: 720, pos: '50% 40%',
    alt: 'Martin sosteniendo un güiro y una baqueta hacia la cámara' },
  { id: 2, cat: 'baile', src: f02, thumb: t02, w: 1200, h: 1800, tw: 480, th: 720, pos: '50% 35%',
    alt: 'Martin en pleno paso de baile con remera blanca y pantalón claro' },
  { id: 13, cat: 'baile', src: f13, thumb: t13, w: 1800, h: 1200, tw: 720, th: 480, pos: '50% 40%',
    alt: 'Martin en un paso de baile con saco negro y lentes de sol' },
  { id: 8, cat: 'retratos', src: f08, thumb: t08, w: 1800, h: 1200, tw: 720, th: 480, pos: '50% 30%',
    alt: 'Martin de blanco inclinado hacia un lado con un brazo extendido' },
  { id: 1, cat: 'baile', src: f01, thumb: t01, w: 1800, h: 1200, tw: 720, th: 480, pos: '50% 35%',
    alt: 'Martin bailando en una foto en blanco y negro, con la mirada hacia arriba' },
  { id: 10, cat: 'retratos', src: f10, thumb: t10, w: 1200, h: 1800, tw: 480, th: 720, pos: '50% 30%',
    alt: 'Martin de traje negro y lentes de sol apoyado de costado, con una conga desenfocada al frente' },
  { id: 18, cat: 'retratos', src: f18, thumb: t18, w: 1800, h: 1200, tw: 720, th: 480, pos: '50% 35%',
    alt: 'Primer plano de Martin con lentes de sol y collares, mirando hacia un costado' },
]

// Portada de la web (hero): la primera foto de la lista
export const portada = fotos[0]

// Las 6 fotos de la vista previa que se muestra en la página
export const destacadas = fotos.slice(0, 6)
