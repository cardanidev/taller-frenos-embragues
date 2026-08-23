const formularioOrdenes = document.getElementById("formOrden");
const selectCliente = document.getElementById("cliente");
const selectVehiculo = document.getElementById("vehiculo");
const diagnosticoCliente = document.getElementById("diagnosticoCliente");
const btnOrden = document.getElementById("btnOrden");
const listaOrdenes = document.getElementById("listaOrdenes");


let ordenEnEdicion = null;


async function cargarClientes() {

    console.log("cargarClientes ejecutándose")

    const { data, error } = await supabaseClient
        .from("clientes")
        .select("*");

        if(error){
            console.log(error);
            return;
        }
        console.log(data);
        selectCliente.innerHTML = `
            <option value = "">Seleccione Un Cliente</option> 
        `;


        data.forEach(function(cliente){

            const opcion = document.createElement("option");

            opcion.value = cliente.id;
            opcion.textContent = cliente.nombre;

            selectCliente.appendChild(opcion);

        });

        
}

selectCliente.addEventListener("change", async function (evento){

    const clienteId = selectCliente.value;

    const { data , error } = await supabaseClient
        .from("vehiculos")
        .select("*")
        .eq("cliente_id", clienteId);

        console.log("vehiculos encontrados", data)

        console.log(data);

        selectVehiculo.innerHTML = `
            <option value = "">Seleccione Un Vehículo</option>
        `;

    
    data.forEach(function(vehiculo){

        const option = document.createElement("option");

        option.value = vehiculo.id;
        option.textContent = `${vehiculo.placa} - ${vehiculo.marca} - ${vehiculo.modelo}`;
        selectVehiculo.appendChild(option)

    });

    


});

formularioOrdenes.addEventListener("submit", async function(evento){
    
    evento.preventDefault();

    const vehiculoId = selectVehiculo.value;
    const diagnostico = diagnosticoCliente.value;
    
    const nuevaOrden = {

        vehiculo_id: vehiculoId,
        estado: "pendiente",
        diagnostico_cliente: diagnostico

    }

    const { data, error } = await supabaseClient
        .from("ordenes_trabajo")
        .insert(nuevaOrden);

    if(error){
        console.log(error);
        alert("Error Al Crear La Orden")
        return;

    } else {

            console.log(data);
            alert("Orden Creada");

            formularioOrdenes.reset();

            obtenerOrdenes();

            
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

    console.log(data);

    listaOrdenes.innerHTML = "";

    data.forEach(function(orden){
        

        const fecha = new Date(orden.fecha_ingreso);

        const fechaFormateada = fecha.toLocaleString();

        const divOrden = document.createElement("div");

        divOrden.innerHTML = `
        
            <h3>Orden #${orden.id}</h3>
            <p>Cliente : ${orden.vehiculos.clientes.nombre}</p>
            <p>Vehiculo: ${orden.vehiculos.placa} - ${orden.vehiculos.marca} - ${orden.vehiculos.modelo}</p>
            <p>Diagnóstico: ${orden.diagnostico_cliente}</p>
            <p>Estado: ${orden.estado}</p>
            <p>Fecha: ${fechaFormateada}</p>
         
        `;

        listaOrdenes.appendChild(divOrden);

    });

}

obtenerOrdenes();
cargarClientes();

