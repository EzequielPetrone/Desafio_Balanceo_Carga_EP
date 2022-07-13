//Importo Clase Contenedor para luego extender de ella
const ContenedorMongo = require('../../contenedores/ContenedorMongo')

// Importo Model del schema 'productos' 
const { productosModel } = require('../../models/productos')

//DAO que extiende de clase Contenedor
class ProductosDaoMongo extends ContenedorMongo {

    constructor() {
        super(productosModel);
    }

    async saveProducto(obj) {
        //La única dif con el save de la clase Contenedor es que valido la estructura del objeto
        if (obj &&
            typeof (obj.title) == 'string' &&
            typeof (obj.price) == 'number' &&
            typeof (obj.thumbnail) == 'string') {

            return await this.save(obj)

        } else {
            console.log(`Estructura del objeto Producto INCORRECTA. Se esperaba: { title : string , price : number , thumbnail : string }`);
            return null
        }
    }
}

module.exports = { ProductosDaoMongo }