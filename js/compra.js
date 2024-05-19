main()

function main() {
    arrayCarrito = obtenerCarritoLS()
    let contenedorCompra = document.getElementById("container-compra")
    crearCardsCompra(arrayCarrito, contenedorCompra)
    totalCarritoYFinalizarCompra(contenedorCompra)
}

function obtenerCarritoLS() {
    // si existe retorno lo que recupero, sino retorno un array vacio //
    return JSON.parse(localStorage.getItem("arrayCarrito")) || []
}

function crearCardsCompra(arrayCarrito,contenedorCompra) {
    contenedorCompra.innerHTML = ""

    arrayCarrito.forEach(({ id, nombre, categoria, unidades, subtotal, img1 }) => {

        let tarjetaProducto = document.createElement("div")
        tarjetaProducto.classList.add("tarjetaProducto")

        tarjetaProducto.innerHTML = `
        <div class="card card-compra mb-3" style="max-width: 540px;">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="../media/productos/${categoria}/${nombre}/${img1}.jpg" class="img-fluid rounded-start" alt="...">
                </div>
                <div class="col-md-8">
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
            inputPlaceholder: "Ejemplo@gmail.com"
        });
        if (email) {
            let templateParams = {
                to_mail: email
              };
              
              emailjs.send('service_nghv868', 'template_4kptnsp', templateParams).then(
                (response) => {
                  console.log('SUCCESS!', response.status, response.text);
                  finalizarCompra(contenedorCompra, tituloTotal)
                },
                (error) => {
                  console.log('FAILED...', error);
                },
              );
        }
    })
}

function finalizarCompra(contenedor, tituloTotal) {
    localStorage.removeItem("arrayCarrito")
    crearCardsCompra([], contenedor)
    tituloTotal.innerText = "Total: $0"
}