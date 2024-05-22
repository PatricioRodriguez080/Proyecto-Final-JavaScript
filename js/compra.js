main()

function main() {
    arrayCarrito = obtenerCarritoLS()
    let contenedorCompra = document.getElementById("container-compra")
    crearCardsCompra(arrayCarrito, contenedorCompra)
    totalCarritoYFinalizarCompra(contenedorCompra)
}

function obtenerCarritoLS() {
    return JSON.parse(localStorage.getItem("arrayCarrito")) || []
}

function crearCardsCompra(arrayCarrito, contenedorCompra) {
    contenedorCompra.innerHTML = ""

    arrayCarrito.forEach(({ id, nombre, categoria, unidades, subtotal, img1 }) => {

        let tarjetaProducto = document.createElement("div")
        tarjetaProducto.classList.add("tarjetaProducto")

        tarjetaProducto.innerHTML = `
        <div class="card card-compra mb-3" style="max-width: 540px;">
            <div class="row g-0">
                <div class="col">
                    <img src="../media/productos/${categoria}/${nombre}/${img1}.jpg" class="img-fluid rounded-start" alt="...">
                </div>
                <div class="col">
                    <div class="card-body card-info">
                        <h5 class="card-title">${nombre}</h5>
                        <p class="card-text">Unidades: ${unidades}</p>
                        <p class="card-text">$${subtotal}</p>
                    </div>
                </div>
            </div>
        </div>
        `

        contenedorCompra.appendChild(tarjetaProducto)
    })
}

function totalCarritoYFinalizarCompra(contenedorCompra) {

    let arrayCarrito = obtenerCarritoLS()
    tituloTotal = document.getElementById("tituloTotal2")
    total = arrayCarrito.reduce((acumulador, producto) => acumulador + producto.subtotal, 0)
    tituloTotal.innerText = `
        Total: $${total}
    `

    let botonFinalizarCompra = document.getElementById("BtnFinalizarCompraCompraFinal")
    botonFinalizarCompra.addEventListener("click", async () => {
        const { value: email } = await Swal.fire({
            title: "Introduce tu Gmail",
            text: "Te llegara un mensaje de confirmacion (puede que este como spam)",
            input: "email",
            inputPlaceholder: "Ejemplo@gmail.com",
            confirmButtonColor: "darkslategray"
        });
        if (email) {
            let templateParams = {
                to_mail: email
            };

            emailjs.send('service_nghv868', 'template_4kptnsp', templateParams).then(
                (response) => {
                    finalizarCompra(contenedorCompra, tituloTotal, botonFinalizarCompra)
                },
                (error) => {
                    Swal.fire({
                        title: "Error",
                        text: "Error al enviar mail de confirmacion",
                        icon: "error"
                      });
                },
            );
        }
    })
}

function finalizarCompra(contenedor, tituloTotal, botonFinalizarCompra) {
    localStorage.removeItem("arrayCarrito")
    crearCardsCompra([], contenedor)

    let botonSeguirComprando = document.getElementById("btn-seguir-comprando")
    let tituloCompra = document.getElementById("titulo-compra")
    ocultar(botonSeguirComprando)
    ocultar(tituloCompra)
    ocultar(tituloTotal)
    ocultar(botonFinalizarCompra)

    Swal.fire({
        title: "Compra finalizada",
        text: "Gracias por su compra",
        confirmButtonColor: "darkslategray"
    }).then(() => {
        let containerLoader = document.getElementById("container-loader")
        mostrar(containerLoader)

        contenedor.innerHTML = `
            <h1 class="text-center mt-5">Redirigiendo hacia la pagina principal</h1>
        `
        setTimeout(function () {
            window.location.href = "../index.html"
        }, 3000)
    })


}

function mostrar(nodo) {
    nodo.classList.add("show")
    nodo.classList.remove("hide")
}

function ocultar(nodo) {
    nodo.style.display = "none"
}