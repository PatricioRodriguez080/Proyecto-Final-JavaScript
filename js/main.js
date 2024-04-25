main(arrayProductos)

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function main(arrayProductos) {

    let arrayCarrito = obtenerCarritoLS()

    renderizarCarrito(arrayCarrito)
    mostrarOcultarMensajeCarrito()

    crearTarjetasProductos(arrayProductos)

    let inputTexto = document.getElementById("inputTexto")
    inputTexto.addEventListener("keypress", (e) => filtrarYRenderizarEnter(arrayProductos, e))

    let botonBuscar = document.getElementById("botonBuscar")
    botonBuscar.addEventListener("click", (e) => filtrarYRenderizar(arrayProductos))

}

function desplegar(e) {

    e.stopPropagation();

    let contenedorCarrito = document.getElementById("contenidoCarrito")
    contenedorCarrito.classList.toggle("hide")
}

function detenerCierre(e) {
    e.stopPropagation();
}

function obtenerCarritoLS() {
    // si existe retorno lo que recupero, sino retorno un array vacio //
    return JSON.parse(localStorage.getItem("arrayCarrito")) || []
}

function crearTarjetasProductos(productosElegidos) {

    const contenedorTarjetas = document.getElementById("containerZapas")
    contenedorTarjetas.innerHTML = ""

    // Desestructuro el producto leido y creo variables con las propiedades que yo quiera de ese producto leido //
    productosElegidos.forEach(({id, nombre, categoria, descrip, img1, img2, img3}) => {

        let tarjetaProducto = document.createElement("div")
        tarjetaProducto.classList.add("col-lg-3")
        tarjetaProducto.classList.add("col-md-6")
        tarjetaProducto.classList.add("col-sm-12")

        tarjetaProducto.innerHTML = `
            <div class="colZapasIndex">
                <div class="card" style="width: 18rem;">
                    <div id="slider-1">
                        <div class="swiper" id="swiper-1">
                            <div class="swiper-wrapper">
                                <div class="swiper-slide">
                                    <img src="./media/productos/${categoria}/${nombre}/${img1}.jpg" alt="${nombre}">
                                </div>
                                <div class="swiper-slide">
                                    <img src="./media/productos/${categoria}/${nombre}/${img2}.jpg" alt="${nombre}">
                                </div>
                                <div class="swiper-slide">
                                    <img src="./media/productos/${categoria}/${nombre}/${img3}.jpg" alt="${nombre}">
                                </div>
                            </div>
                            <div class="swiper-pagination"></div>
                        </div>
                    </div>
                    <div class="card-body"
                        <h5 class="card-title">${nombre}</h5>
                        <h6>${descrip}</h6>
                        <div class="containerPrecioColores d-flex justify-content-between align-items-center mt-3">
                            <button id="btnAgregarCarrito${id}">Agregar</button>
                        </div>
                    </div>
                </div>
            </div>
        `

        contenedorTarjetas.appendChild(tarjetaProducto)

        let botonAgregarAlCarrito = document.getElementById(`btnAgregarCarrito${id}`)
        botonAgregarAlCarrito.addEventListener("click", (e) => {
            agregarAlCarrito(e, productosElegidos)
        })
    })


    // Inicializo Swiper después de agregar todas las tarjetas al DOM //
    new Swiper("#swiper-1", {
        effect: "fade",
        pagination: {
            el: "#swiper-1 .swiper-pagination"
        }
    })
}

function agregarAlCarrito(e, arrayProductos) {

    let arrayCarrito = obtenerCarritoLS()
    console.log("arrayCarrito:", arrayCarrito);

    let idDelProducto = e.target.id.substr(17)

    let posProdcutoEnCarrito = arrayCarrito.findIndex(producto => producto.id == idDelProducto)
    let productoBuscado = arrayProductos.find(producto => producto.id == idDelProducto)

    if (posProdcutoEnCarrito != -1) {
        arrayCarrito[posProdcutoEnCarrito].unidades++
        arrayCarrito[posProdcutoEnCarrito].subtotal = arrayCarrito[posProdcutoEnCarrito].precioUnitario * arrayCarrito[posProdcutoEnCarrito].unidades
    }else{
        arrayCarrito.push({
            id: productoBuscado.id,
            nombre: productoBuscado.nombre,
            descrip: productoBuscado.descrip,
            categoria: productoBuscado.categoria,
            img1: productoBuscado.img1,
            img2: productoBuscado.img2,
            img3: productoBuscado.img3,
            precioUnitario: productoBuscado.precio,
            unidades: 1,
            subtotal: productoBuscado.precio
        })
    }

    localStorage.setItem("arrayCarrito", JSON.stringify(arrayCarrito))
    renderizarCarrito(arrayCarrito)
    mostrarOcultarMensajeCarrito()
    ContadorProductosCarrito()
}

function mostrarOcultarMensajeCarrito() {

    let arrayCarrito = obtenerCarritoLS();
    let mensajeCarritoVacio = document.getElementById("textoCarritoVacio");
    let tituloTotal = document.getElementById("tituloTotal")
    let botonFinalizarCompra = document.getElementById("BtnFinalizarCompra")
    
    if (arrayCarrito && arrayCarrito.length > 0) {
        ocultar(mensajeCarritoVacio)
        mostrar(tituloTotal)
        mostrar(botonFinalizarCompra)
    } else {
        mostrar(mensajeCarritoVacio)
        ocultar(tituloTotal)
        ocultar(botonFinalizarCompra)
    }
}

function mostrar(nodo) {
    nodo.classList.add("show")
    nodo.classList.remove("hide")
}

function ocultar(nodo) {
    nodo.classList.add("hide")
    nodo.classList.remove("show")
}

function renderizarCarrito(arrayCarrito) {

    mostrarOcultarMensajeCarrito()
    
    let contenedorCarrito = document.getElementById("productosEnCarrito")
    contenedorCarrito.innerHTML = ""

    // Desestructuro el producto leido y me guardo en nuevas variables las propiedades que coincidan con el nombre dado//
    arrayCarrito.forEach(({id, nombre, categoria, unidades, subtotal, img1}) => {

        let tarjetaProducto = document.createElement("div")
        tarjetaProducto.id = `tarjetaProducto${id}`

        tarjetaProducto.innerHTML = `
        <div class="card mb-3" style="max-width: 540px;">
        <div class="row g-0">
            <div class="col-4">
                <img src="../media/productos/${categoria}/${nombre}/${img1}.jpg" alt="${nombre}" class="img-fluid rounded-start" alt="...">
            </div>
            <div class="col-8">
                <div class="card-body d-flex">
                    <div class="container-informaciones d-flex flex-column">
                        <h5 class="card-title">${nombre}</h5>
                        <p class="card-text">${unidades}</p>
                        <p class="card-text"><small class="text-body-secondary">$${subtotal}</small></p>
                    </div>
                    <div class="container-borrar">
                        <i id="boton-eliminar${id}" class="fa-solid fa-trash"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
        `

        contenedorCarrito.appendChild(tarjetaProducto)

        let botonEliminar = document.getElementById(`boton-eliminar${id}`)
        botonEliminar.addEventListener("click", eliminarProductoDelCarrito)

        let botonFinalizarCompra = document.getElementById("BtnFinalizarCompra")
        botonFinalizarCompra.addEventListener("click", (e) => {
            finalizarCompra(contenedorCarrito)
        })

        ContadorProductosCarrito()
        totalCarrito()
    })
}

function totalCarrito() {

    arrayCarrito = obtenerCarritoLS()
    tituloTotal = document.getElementById("tituloTotal")
    total = arrayCarrito.reduce((acumulador, producto) => acumulador + producto.subtotal, 0)
    tituloTotal.innerText = `
        Total: $${total}
    `
}

function eliminarProductoDelCarrito(e) {

    let id = e.target.id.substr(14);
    let filaAEliminar = document.getElementById(`tarjetaProducto${id}`);
    filaAEliminar.remove();

    // Me traigo el carrito del LS //
    let carrito = obtenerCarritoLS()

    // Me guardo en el carrito todos los productos que ya estaban menos el que quiero eliminar //
    carrito = carrito.filter(producto => producto.id != id);

    // Actualizo el LS con el contenido filtrado //
    localStorage.setItem("arrayCarrito", JSON.stringify(carrito));

    mostrarOcultarMensajeCarrito()
    ContadorProductosCarrito()
    totalCarrito()
}

function finalizarCompra(contenedorCarrito) {
    
    localStorage.removeItem("arrayCarrito")
    renderizarCarrito([],contenedorCarrito)
    mostrarOcultarMensajeCarrito()
    ContadorProductosCarrito()
}

function ContadorProductosCarrito() {
    
    let contador = document.getElementById("contadorElementosCarrito")
    let cant = 0
    arrayCarrito = obtenerCarritoLS()
    arrayCarrito.forEach(producto => cant++)
    
    contador.innerText = cant
}

function filtrarYRenderizarEnter(arrayProductos, e) {

    if (e.keyCode == 13) {
        let productosFiltrados = filtrarProductos(arrayProductos)
        renderizarProductos(productosFiltrados)
    }
}

function filtrarYRenderizar(arrayProductos) {
    let arrayResultado = filtrarProductos(arrayProductos) 
    renderizarProductos(arrayResultado)
}

function filtrarProductos(arrayProductos) {

    let inputBusqueda = document.getElementById("inputTexto").value.toLowerCase();

    let resultado = arrayProductos.filter(producto => producto.nombre.toLowerCase().includes(inputBusqueda));

    return resultado;
}

function renderizarProductos(arrayProductosFiltrados) {
    crearTarjetasProductos(arrayProductosFiltrados)
}