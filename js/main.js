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

    let dropdowns = document.querySelectorAll(".list-button-click")
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("click", (e) => funcionalidadesDropdowns(e, arrayProductos))
    })

}

function desplegar(e) {

    e.stopPropagation()

    let contenedorCarrito = document.getElementById("contenidoCarrito")
    contenedorCarrito.classList.toggle("hide")
}

function detenerCierre(e) {
    e.stopPropagation()
}

function obtenerCarritoLS() {
    // si existe retorno lo que recupero, sino retorno un array vacio //
    return JSON.parse(localStorage.getItem("arrayCarrito")) || []
}

function crearTarjetasProductos(productosElegidos) {

    const contenedorTarjetas = document.getElementById("containerZapas")
    contenedorTarjetas.innerHTML = ""

    // Desestructuro el producto leido y creo variables con las propiedades que yo quiera de ese producto leido //
    productosElegidos.forEach(({ id, nombre, categoria, descrip, img1, img2, img3 }) => {

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

    let idDelProducto = e.target.id.substr(17)

    let posProdcutoEnCarrito = arrayCarrito.findIndex(producto => producto.id == idDelProducto)
    let productoBuscado = arrayProductos.find(producto => producto.id == idDelProducto)

    if (posProdcutoEnCarrito != -1) {
        arrayCarrito[posProdcutoEnCarrito].unidades++
        arrayCarrito[posProdcutoEnCarrito].subtotal = arrayCarrito[posProdcutoEnCarrito].precioUnitario * arrayCarrito[posProdcutoEnCarrito].unidades
    } else {
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
    Toastify({
        text: "Producto agregado",
        duration: 1000,
        gravity: "bottom",
        position: "right",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
    }).showToast()
}

function mostrarOcultarMensajeCarrito() {

    let arrayCarrito = obtenerCarritoLS()
    let mensajeCarritoVacio = document.getElementById("textoCarritoVacio")
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
    arrayCarrito.forEach(({ id, nombre, categoria, unidades, subtotal, img1 }) => {

        let tarjetaProducto = document.createElement("div")
        tarjetaProducto.id = `tarjetaProducto${id}`

        tarjetaProducto.innerHTML = `
        <div class="card mb-3" style="max-width: 540px;">
        <div class="row g-0">
            <div class="col-4">
                <img src="./media/productos/${categoria}/${nombre}/${img1}.jpg" alt="${nombre}" class="img-fluid rounded-start">
            </div>
            <div class="col-8">
                <div class="card-body card-body-carrito d-flex">
                    <div class="container-informaciones d-flex flex-column">
                        <h5 class="card-title">${nombre}</h5>
                        <div class="container-unidades d-flex">
                            <i id="botonMenos${id}" class="fa-solid fa-minus"></i>
                            <p id="textoUnidades${id}" class="card-text">${unidades}</p>
                            <i id="botonMas${id}" class="fa-solid fa-plus"></i>
                        </div>
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

        let botonMenos = document.getElementById(`botonMenos${id}`)
        botonMenos.addEventListener("click", restarUnidad)

        let botonMas = document.getElementById(`botonMas${id}`)
        botonMas.addEventListener("click", agregarUnidad)

        let botonEliminar = document.getElementById(`boton-eliminar${id}`)
        botonEliminar.addEventListener("click", eliminarProductoDelCarrito)

        let botonFinalizarCompra = document.getElementById("BtnFinalizarCompra")
        botonFinalizarCompra.addEventListener("click", (e) => {
            Swal.fire({
                title: "Quiere finalizar la compra?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirmar!",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    finalizarCompra(contenedorCarrito)
                    Swal.fire({
                        title: "Compra Exitosa!",
                        text: "Sus productos fueron confirmados",
                        icon: "success"
                    })
                }
            })
        })

        ContadorProductosCarrito()
        totalCarrito()
    })
}

function restarUnidad(e) {

    let arrayCarrito = obtenerCarritoLS()

    let idProducto = e.target.id.substr(10)

    let indiceProducto = arrayCarrito.findIndex(({ id }) => id == idProducto)
    if (indiceProducto !== -1) {

        if (arrayCarrito[indiceProducto].unidades > 1) {
            arrayCarrito[indiceProducto].unidades--
            arrayCarrito[indiceProducto].subtotal = arrayCarrito[indiceProducto].precioUnitario * arrayCarrito[indiceProducto].unidades
        } else {
            arrayCarrito.splice(indiceProducto, 1)
        }

        // Actualizo el carrito del LS para luego renderizar ese mismo con las modificaciones hechas //
        localStorage.setItem("arrayCarrito", JSON.stringify(arrayCarrito))
        totalCarrito()
        ContadorProductosCarrito()
        renderizarCarrito(arrayCarrito)
    }
}

function agregarUnidad(e) {

    let arrayCarrito = obtenerCarritoLS()

    let idProducto = e.target.id.substr(8)

    let indiceProducto = arrayCarrito.findIndex(({ id }) => id == idProducto)
    if (indiceProducto !== -1) {

        arrayCarrito[indiceProducto].unidades++
        arrayCarrito[indiceProducto].subtotal = arrayCarrito[indiceProducto].precioUnitario * arrayCarrito[indiceProducto].unidades

        // Actualizo el carrito del LS para luego renderizar ese mismo con las modificaciones hechas //
        localStorage.setItem("arrayCarrito", JSON.stringify(arrayCarrito))
        totalCarrito()
        ContadorProductosCarrito()
        renderizarCarrito(arrayCarrito)
    }
}

function totalCarrito() {

    let arrayCarrito = obtenerCarritoLS()
    tituloTotal = document.getElementById("tituloTotal")
    total = arrayCarrito.reduce((acumulador, producto) => acumulador + producto.subtotal, 0)
    tituloTotal.innerText = `
        Total: $${total}
    `
}

function eliminarProductoDelCarrito(e) {

    let id = e.target.id.substr(14)
    let filaAEliminar = document.getElementById(`tarjetaProducto${id}`)
    filaAEliminar.remove()

    // Me traigo el carrito del LS //
    let carrito = obtenerCarritoLS()

    // Me guardo en el carrito todos los productos que ya estaban menos el que quiero eliminar //
    carrito = carrito.filter(producto => producto.id != id)

    // Actualizo el LS con el contenido filtrado //
    localStorage.setItem("arrayCarrito", JSON.stringify(carrito))

    mostrarOcultarMensajeCarrito()
    ContadorProductosCarrito()
    totalCarrito()
    Toastify({
        text: "Producto eliminado",
        duration: 1000,
        gravity: "bottom",
        position: "right",
        style: {
            background: "linear-gradient(to right, #ff0000, #ff6666)"
        },
    }).showToast()
}

function finalizarCompra(contenedorCarrito) {

    localStorage.removeItem("arrayCarrito")
    renderizarCarrito([], contenedorCarrito)
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
        let productosFiltrados = filtrarProductosBarraBusqueda(arrayProductos)
        renderizarProductos(productosFiltrados)
    }
}

function filtrarYRenderizar(arrayProductos) {
    let arrayResultado = filtrarProductos(arrayProductos)
    renderizarProductos(arrayResultado)
}

function filtrarProductosBarraBusqueda(arrayProductos) {

    let inputBusqueda = document.getElementById("inputTexto").value.toLowerCase()

    let resultado = arrayProductos.filter(producto => producto.nombre.toLowerCase().includes(inputBusqueda))

    return resultado
}

function renderizarProductos(arrayProductosFiltrados) {
    crearTarjetasProductos(arrayProductosFiltrados)
}

function funcionalidadesDropdowns(e, arrayProductos) {
    mostrarOcultarOpciones(e)
    filtradoDeOpciones(arrayProductos)
}

function mostrarOcultarOpciones(e) {
    let dropdown = e.currentTarget; // me guardo en dropdown los datos del evento //
    let opciones = dropdown.nextElementSibling; // ahora me guardo en opciones el siguiente elemento al dropdown guardado anteriormente, en este caso el menu de opciones //

    opciones.classList.toggle("hide")
    dropdown.classList.toggle("arrow")
}

function filtradoDeOpciones(arrayProductos) {

    let arrayCategorias = []

    arrayProductos.forEach(producto => {

        if (!arrayCategorias.includes(producto.categoria)) {
            arrayCategorias.push(producto.categoria)
        }
    })

    let contenedorCategorias = document.getElementById("lista-categorias")
    contenedorCategorias.innerHTML = ""

    arrayCategorias.forEach(categoria => {

        contenedorCategorias.innerHTML += `
            <h6 class="botones-categoria">${categoria}</h6>
        `
    })

    let opcionesCategoria = document.querySelectorAll(".botones-categoria")
    opcionesCategoria.forEach(boton => {
        boton.addEventListener("click", (e) => filtrarProductosYCrearFiltros(e, arrayProductos))
    })
}

function filtrarProductosYCrearFiltros(e, arrayProductos) {

    let categoriaSeleccionada = e.target.innerText
    arrayResultado = arrayProductos.filter(producto => producto.categoria == e.target.innerText)
    crearTarjetasProductos(arrayResultado)

    // Relleno los filtros segun por que categoria estoy filtrando //
    const contenedorFiltros = document.getElementById("container-filtros")
    let arrayDeFiltros = ""
    contenedorFiltros.innerHTML = ""

    arrayResultado.forEach(producto => {
        if (!arrayDeFiltros.includes(producto.modelo)) {
            arrayDeFiltros += producto.modelo
            contenedorFiltros.innerHTML += `
                <p id="filtros-${producto.modelo}" class="botones-filtro">${producto.modelo}</p>
            `
        }
    })

    // Le doy funcionalidad a esos botones de filtro creados//
    const botonesFiltro = document.querySelectorAll(".botones-filtro")
    botonesFiltro.forEach(boton => {
        boton.addEventListener("click", (e) => {
            arrayResultado = arrayProductos.filter(producto => producto.modelo.includes(e.target.id.substr(8)) && producto.categoria == categoriaSeleccionada)
            crearTarjetasProductos(arrayResultado)
        })
    })
}