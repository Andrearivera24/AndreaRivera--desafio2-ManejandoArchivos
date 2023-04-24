// // Realizar una clase de nombre “ProductManager”, el cual permitirá trabajar con múltiples productos. Éste debe poder agregar, consultar, modificar y eliminar un producto y manejarlo en persistencia de archivos (basado en entregable 1).
// // Aspectos a incluir

const fs = require("fs");

class ProductManager {
  #id = 0; // id oomo variable privada.
  constructor() {
    // escribo el archivo Síncrona, pero antes, valido que no exista.
    if (!fs.existsSync("./files/products.json")) {
      this.path = fs.writeFileSync("./files/products.json", JSON.stringify([])); //--> varible this.path Lo tengo que stringicar para que sea leido en el formato .json
    }
  }
  //--------------------------------- Debe guardar objetos con el siguiente formato ------------------------------------------------------------------
  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
      const product = { title, description, price, thumbnail, code, stock };
      product.id = this.#getID(); // asignarle un id autoincrementable
      const productosAct = await this.getProducts(); //obtengo el archivo con los productos actuales, llamando a la función que ya sabe hacerlo.
      productosAct.push(product); // Agrego el nuevo producto a la lista anterior

      //Debido a que la lista anterior se modificó, tengo que escribirla nuevamente(actualizada y en formato stringify);
      await fs.promises.writeFile(
        "./files/products.json",
        JSON.stringify(productosAct)
      );
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
      const productosAct = await fs.promises.readFile(
        "./files/products.json",
        "utf-8"
      ); //leo y guardo en variable los productos
      const productosActParseados = JSON.parse(productosAct); // parseo.
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
        : console.log(`El producto que coincide con este ID es: ${filtroID}`); //--> Operador ternario, que valida que la lista tenga algo y devuelta el array.
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

  async updateProduct(idProduct,upDate) {
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
        const newProductosAct = [...productosAct]; // Creo una copia de la lista.
        newProductosAct[indiceID] = [...newProductosAct[indiceID], upDate]; // a la copia, le sumo lo nuevo y lo pusheo.
        productosAct = newProductosAct; // reasigno el valor de productosAct

        //Debido a que la lista anterior se modificó, tengo que escribirla nuevamente(actualizada y en formato stringify);
        await fs.promises.writeFile(
          "./files/products.json",
          JSON.stringify(productosAct)
        );
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
      const nuevaLista = productosAct.filter(
        //Devuelvo una lista con los productos que NO tengan ese ID.
        (product) => product.id !== idProduct
      );
      productosAct.push(nuevaLista); // agrego los cambios
      //Debido a que la lista anterior se modificó, tengo que escribirla nuevamente(actualizada y en formato stringify);
      await fs.promises.writeFile(
        "./files/products.json",
        JSON.stringify(productosAct)
      );
    } catch (err) {
      console.log(
        `Algo salió mal al intentar eliminar un producto por su ID, ERROR: ${err}`
      );
    }
  }
}

//----------------------- CREO UNA INSTRANCIA DE LA CLASE Y HAGO LAS PRUEBAS CON UNA FUNCIÓN ASÍNCRONA -------------------------

const products = new ProductManager();

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

    // await products.addProduct(
    //   "Prueba 2", //--> Agrego otro producto
    //   "Este es el desafío 2",
    //   "20 USD",
    //   "ruta de imagen2",
    //   154,
    //   2
    // );

    //await products.getProductById(2); //--> Obtengo el producto con id==2.
    await products.updateProduct(1, [
      "Prueba 2 con cambios",
      "Acá actualicé los datos",
      "10 USD",
      "Ruta de imagen",
      "154",
      2,
    ]);
    //await products.deleteProduct(1);
    //console.log(await products.getProducts()); //--> Muestro por consola los productos.
  } catch (err) {
    console.log(`Algo salió mal al hacer las pruebas, ERROR: ${err}`);
  }
};

pruebas(); // ejecuto las pruebas
