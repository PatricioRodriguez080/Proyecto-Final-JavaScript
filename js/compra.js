renderizarCompra()

function obtenerCarritoLS() {
    // si existe retorno lo que recupero, sino retorno un array vacio //
    return JSON.parse(localStorage.getItem("arrayCarrito")) || []
}

function renderizarCompra() {
    arrayCarrito = obtenerCarritoLS()

    let contenedorCompra = document.getElementById("container-compra")
    contenedorCompra.innerHTML = ""
    arrayCarrito.forEach(({ id, nombre, categoria, unidades, subtotal, img1 }) => {
        let tarjetaProducto = document.createElement("div")
        tarjetaProducto.innerHTML = `
        <div class="card mb-3" style="max-width: 540px;">
        <div class="row g-0">
            <div class="col-4">
                <img src="../media/productos/${categoria}/${nombre}/${img1}.jpg" alt="${nombre}" class="img-fluid rounded-start">
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

        contenedorCompra.appendChild(tarjetaProducto)
        console.log("hola")
    })

}