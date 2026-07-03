import { ITipoarticulo } from "./tipoarticulo"

export interface IArticulo {
  id: number
  descripcion: string
  precio: number
  descuento: number
  imagen: string | null
  tipoarticulo: ITipoarticulo
  comentarioarts: number
  compras: number
  carritos: number
  puntuacionarts: number
  mediaPuntuacion: number
}







