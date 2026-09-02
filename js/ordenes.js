const formularioOrdenes = document.getElementById("formOrden");
const selectCliente = document.getElementById("cliente");
const selectVehiculo = document.getElementById("vehiculo");
const diagnosticoCliente = document.getElementById("diagnosticoCliente");
const btnOrden = document.getElementById("btnOrden");
const listaOrdenes = document.getElementById("listaOrdenes");


let ordenEnEdicion = null;

async function cargarClientes() {

    const { data, error } = await supabaseClient
        .from("clientes")
        .select("*");

        if (error) {
            console.log(error);
            return;
        }
        selectCliente.innerHTML = `
            <option value = "">Seleccione Un Cliente</option> 
        `;


        data.forEach(function(cliente) {

            const opcion = document.createElement("option");

            opcion.value = cliente.id;
            opcion.textContent = cliente.nombre;

            selectCliente.appendChild(opcion);

        });

        
}

selectCliente.addEventListener("change", async function (evento) {

    const clienteId = selectCliente.value;

    const { data , error } = await supabaseClient
        .from("vehiculos")
        .select("*")
        .eq("cliente_id", clienteId);

        if (error) {
            console.log(error);
            return;
        }

        selectVehiculo.innerHTML = `
            <option value = "">Seleccione Un Vehículo</option>
        `;

    
    data.forEach(function(vehiculo) {

        const option = document.createElement("option");

        option.value = vehiculo.id;
        option.textContent = `${vehiculo.placa} - ${vehiculo.marca} - ${vehiculo.modelo}`;
        selectVehiculo.appendChild(option)

    });

    


});

formularioOrdenes.addEventListener("submit", async function(evento) {
    
    evento.preventDefault();

    const vehiculoId = selectVehiculo.value;
    const diagnostico = diagnosticoCliente.value;
    
    if (ordenEnEdicion === null) {

         const nuevaOrden = {

        vehiculo_id: vehiculoId,
        estado: "pendiente",
        diagnostico_cliente: diagnostico

    }

    const { data, error } = await supabaseClient
        .from("ordenes_trabajo")
        .insert(nuevaOrden);

    if (error) {
        console.log(error);
        alert("Error Al Crear La Orden")
        return;

    } else {
            alert("Orden Creada");

            formularioOrdenes.reset();

            obtenerOrdenes();
    }

    } else {

        const { data, error } = await supabaseClient
            .from("ordenes_trabajo")
            .update({
                diagnostico_cliente: diagnostico
            })
            .eq("id", ordenEnEdicion);

        if (error) {
            console.log(error);
            alert("Error Al actualizar La Orden");
            return;
        }
        alert ("orden Actualizada");

        formularioOrdenes.reset();
        obtenerOrdenes();

        
        ordenEnEdicion = null;
        btnOrden.textContent = "Crear Orden"
    } 
});

async function obtenerOrdenes() {

    const { data, error } = await supabaseClient
        .from("ordenes_trabajo")
        .select(`
            *,
            vehiculos (*, clientes(*))
            `);

    if (error) {
        console.log(error);
        alert("Error Al Cargar Las Ordenes");
        return;
    }

    listaOrdenes.innerHTML = "";

    data.forEach(function(orden) {
        

        const fecha = new Date(orden.fecha_ingreso);

        const fechaFormateada = fecha.toLocaleString();

        const divOrden = document.createElement("div");

        let botonEliminar = "";

        if (orden.estado === "pendiente") {

            botonEliminar = `
                <button type="button" class="btn-eliminar" data-id="${orden.id}">Eliminar</button>
            `;

        }

        let botonEstado = "";

        if (orden.estado === "pendiente") {
            botonEstado = `
                <button type="button" class="btn-estado" data-id="${orden.id}"> Iniciar Proceso</button>
            `;
        }

        if (orden.estado === "en proceso") {

            botonEstado = `
                <button type="button" class="btn-estado" data-id="${orden.id}">Terminar Orden</button>

                <button type="button" class="btn-abortar" data-id="${orden.id}">Abortar Orden</button>
            `;

        }

        if (orden.estado === "terminada") {
            botonEstado = `
            <button type="button" class="btn-entregar" data-id="${orden.id}">Entregar Orden</button>
            `
        }

        let botonEditar = "";
        if (orden.estado !== "terminada" && orden.estado !== "entregada" && orden.estado !== "abortada") {
            botonEditar = `
            <button type= "button" class= "btn-editar" data-id="${orden.id}">Editar</button>
            `;
        }

        divOrden.innerHTML = `
        
            <h3>Orden #${orden.id}</h3>
            <p>Cliente : ${orden.vehiculos.clientes.nombre}</p>
            <p>Vehiculo: ${orden.vehiculos.placa} - ${orden.vehiculos.marca} - ${orden.vehiculos.modelo}</p>
            <p>Diagnóstico: ${orden.diagnostico_cliente}</p>
            <p>Estado: ${orden.estado}</p>
            <p>Fecha: ${fechaFormateada}</p>
            ${botonEditar}
            ${botonEliminar}
            ${botonEstado} 
         
        `;

        const btnEliminar = divOrden.querySelector (".btn-eliminar");
            
        if (btnEliminar) {

            btnEliminar.addEventListener("click", async function() {

                const ordenId = this.dataset.id;
                
                if(!confirm("Estás seguro de eliminar esta orden?")) {
                    return;
                }

                const { data, error } = await supabaseClient

                    .from("ordenes_trabajo")
                    .delete()
                    .eq("id", ordenId);

                    if (error) {
                        console.log(error);
                        alert("Error Al Eliminar La Orden")
                        return;
                    }

                    alert ("Orden Eliminada");
                    obtenerOrdenes();

            });

        }

        const btnEditar = divOrden.querySelector(".btn-editar");

        if (btnEditar) {
        btnEditar.addEventListener("click", function() {
                ordenEnEdicion= this.dataset.id;

                diagnosticoCliente.value = orden.diagnostico_cliente;
                btnOrden.textContent = "Actualizar Orden";
        });
    }

        const btnEstado = divOrden.querySelector(".btn-estado");

        if (btnEstado) {
            btnEstado.addEventListener("click", async function () {
                const ordenId = this.dataset.id;

                let nuevoEstado; 

                if (orden.estado === "pendiente") {
                    nuevoEstado = "en proceso";
                }

                if (orden.estado === "en proceso") {
                    nuevoEstado = "terminada"
                }
               
                const { data, error } = await supabaseClient

                .from("ordenes_trabajo")
                .update({
                    estado: nuevoEstado
                })
                .eq("id", ordenId);

                if (error) {
                    console.log(error);
                    alert("Error Al Cambiar El Estado");
                    return;
                }

                alert("Estado actualizado")
                obtenerOrdenes();
            });
        }

        const btnAbortar = divOrden.querySelector(".btn-abortar");

        if (btnAbortar) {
            btnAbortar.addEventListener("click", async function () {

                const ordenId = this.dataset.id;

                const { data, error } = await supabaseClient
                .from("ordenes_trabajo")
                .update({
                    estado: "abortada"
                })
                .eq("id", ordenId);

                if (error) {
                    console.log(error);
                    alert("Error Al Abortar La Orden");
                    return;
                }
                alert("Orden Abortada");
                obtenerOrdenes();

            });

        }

        const btnEntregar = divOrden.querySelector(".btn-entregar");

        if (btnEntregar) {

            btnEntregar.addEventListener("click", async function() {
                const ordenId = this.dataset.id;

                const { data, error } = await supabaseClient

                .from("ordenes_trabajo")
                .update({
                    estado: "entregada"
                })
                .eq("id", ordenId);

                if (error) {
                    console.log(error);
                    alert("Error Al Entregar La Orden");
                    return;
                }
                alert("Orden Entregada");
                obtenerOrdenes();

            });

        }

        listaOrdenes.appendChild(divOrden);

    });

}

obtenerOrdenes();
cargarClientes();

