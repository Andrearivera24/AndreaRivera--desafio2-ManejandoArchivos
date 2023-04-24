//------------------------------------------------------------------------------ DESAFÍO 2 ----------------------------------------------------------------------------------

const fs = require("fs");

class ProductManager {
  #id = 0; // id oomo variable privada.
  constructor(path) {
    //--> La ruta como parámetro, para luego al instanciar la clase, pasarle la ruta real.
    this.path = path;
    // escribo el archivo Síncrona, pero antes, valido que no exista.
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]));
    }
  }
  //--------------------------------- Debe guardar objetos con el siguiente formato ------------------------------------------------------------------
  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
      const product = { title, description, price, thumbnail, code, stock };
      product.id = this.#getID(); // asignarle un id autoincrementable
      const productosAct = await this.getProducts(); //obtengo el archivo con los productos actuales, llamando a getProducts()
      if (
        //--> Valido que ningun campo sea undefined, antes de pushear el producto.
        (product.title != undefined) &
        (product.description != undefined) &
        (product.price != undefined) &
        (product.thumbnail != undefined) &
        (product.code != undefined) &
        (product.stock != undefined)
      ) {
        productosAct.push(product); // Agrego el nuevo producto a la lista anterior
        //Debido a que la lista anterior se modificó, tengo que escribirla nuevamente(actualizada y en formato stringify);
        await fs.promises.writeFile(this.path, JSON.stringify(productosAct));
      } else {
        console.log("Todos los campos son obligatorios");
      }
    } catch (err) {
      console.log(
        `Algo salió mal al intentar agregar un producto ERROR:${err}`
      );
    }
  }
  //--------------------------------- Método privado para incrementar en uno la variable privada ---------------------------------------------------------------
  #getID() {
    this.#id++; //
    return this.#id;
  }
  //----------------------------- Debe tener un método addProduct (retorna los productos parseados) -----------------------------------------------------------------
  async getProducts() {
    try {
      const productosAct = await fs.promises.readFile(this.path, "utf-8"); //leo y guardo en variable los productos
      const productosActParseados = JSON.parse(productosAct); // Retorno los productos parseados.
      return productosActParseados;
    } catch (err) {
      console.log(
        `Algo salió mal al intentar obtener los objetos parseados, ERROR: ${err}`
      );
    }
  }
  //------------------------------- Debe tener un método getProductById -----------------------------------------------------------------------
  // el cual debe recibir un id, y tras leer el archivo, debe buscar el producto con el id especificado y devolverlo en formato objeto.
  async getProductById(idProduct) {
    try {
      const productosAct = await this.getProducts(); // Objeto los productos parseados con el método que ya sabe cómo hacerlo.
      //El método filter() crea un nuevo array con todos los elementos que cumplan la condición implementada por la función dada.
      const filtroID = productosAct.filter(
        (product) => product.id === idProduct
      );
      filtroID.length === 0
        ? console.log("No existe ningún producto con el ID especificado.")
        : console.log("Producto encontrado exitosamente"); //--> Operador ternario, que valida que la lista tenga algo y devuelta el array.
      return filtroID;
    } catch (err) {
      console.log(
        `Algo salió mal al intentar obtener un producto por su ID, ERROR: ${err}`
      );
    }
  }

  //--------------------------------- Debe tener un método updateProduct ------------------------------------------------------------------------------------

  //el cual debe recibir el id del producto a actualizar, así también como el campo a actualizar (puede ser el objeto completo, como en una DB), y debe actualizar el producto que tenga ese id en el archivo.
  // NO DEBE BORRARSE SU ID  (Spread operator).

  async updateProduct(idProduct, key, newValue) {
    try {
      //obtengo la lista, luego con dinIndex, obtengo el índice específico del producto.
      const productosAct = await this.getProducts();
      const indiceID = productosAct.findIndex(
        (producto) => producto.id === idProduct
      );
      if (indiceID === -1) {
        // Valido que exista el ínice con tal id.
        console.log(
          "No existe ningún producto con el ID especificado, no se puede actualizar."
        );
      } else {
        productosAct[indiceID][key] = newValue; // dentro de los productos, al índice indicado, le hago las modificaciones.
        //Debido a que la lista anterior se modificó, tengo que escribirla nuevamente(actualizada y en formato stringify);
        await fs.promises.writeFile(this.path, JSON.stringify(productosAct));
      }
    } catch (err) {
      console.log(
        `Algo salió mal al intentar actualizar los productos, ERROR: ${err}`
      );
    }
  }

  // -------------------------------- Debe tener un método deleteProduct -----------------------------------------------------------------
  async deleteProduct(idProduct) {
    try {
      const productosAct = await this.getProducts(); // obtengo los productos actuales
      const findIndex = productosAct.findIndex(
        (product) => product.id == idProduct
      );
      productosAct.splice(findIndex, 1); // Con el método splica, el primer argumento el índice en donde comienza a eliminar, y el segundo es cuántos elimina. Con el 1, sólo elimina ese.

      //Debido a que la lista anterior se modificó, tengo que escribirla nuevamente(actualizada y en formato stringify);
      await fs.promises.writeFile(this.path, JSON.stringify(productosAct));

      return console.log(
        "Producto eliminado exitosamente, los productos actuales ahora son: ",
        await this.getProducts()
      );
    } catch (err) {
      console.log(
        `Algo salió mal al intentar eliminar un producto por su ID, ERROR: ${err}`
      );
    }
  }
}

//----------------------- CREO UNA INSTRANCIA DE LA CLASE Y HAGO LAS PRUEBAS CON UNA FUNCIÓN ASÍNCRONA -------------------------

const products = new ProductManager("./files/products.json"); // le paso a ruta.

const pruebas = async () => {
  try {
    await products.addProduct(
      "Prueba 1", //--> Agrego un producto
      "Este es el desafío 2",
      "10 USD",
      "ruta de imagen",
      123,
      1
    );

    await products.addProduct(
      "Prueba 2", //--> Agrego otro producto
      "Este es el desafío 2",
      "20 USD",
      "ruta de imagen2",
      154,
      2
    );
    await products.updateProduct(1, "title", "Nuevo titulo usando update"); //--> actualizo datos. 
    await products.updateProduct(
      1,
      "description",
      "Esta es una nueva descripción"
    );
    await products.updateProduct(1, "price", 500);
    console.log(await products.getProductById(2)); //--> Obtengo el producto con id === 2.
    await products.deleteProduct(1);
    console.log(await products.getProducts()); //--> Muestro por consola los productos.
  } catch (err) {
    console.log(`Algo salió mal al hacer las pruebas, ERROR: ${err}`);
  }
};

pruebas(); // ejecuto las pruebas
