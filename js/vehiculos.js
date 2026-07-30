const formularioVehiculo = document.getElementById("formVehiculo");
const selectCliente = document.getElementById("cliente");
const btnVehiculo = document.getElementById("btnVehiculo");
const listaVehiculos = document.getElementById("listaVehiculos");

let vehiculoEnEdicion = null;

//Capturar el envío del formulario 
formularioVehiculo.addEventListener("submit", async function(evento){
//Evitar recarga de la página
    evento.preventDefault();
//Obtener datos del formulario
    const placa = document.getElementById("placa").value;
    const marca = document.getElementById("marca").value;
    const modelo = document.getElementById("modelo").value;
    const color = document.getElementById("color").value;
    let anioFabricacion = document.getElementById("anioFabricacion").value;

        if (anioFabricacion === "") {
        anioFabricacion = null;
        }
    const cliente = document.getElementById("cliente").value;
//Validar datos
    if(placa ==="" || marca ==="" || modelo ==="" || cliente ==="") {
        alert("Debe seleccionar un cliente y completar placa, marca, y modelo.");
        return;
    }

    let error;
//Registrar o actualizar vehículo
    if(vehiculoEnEdicion === null) {
        const resultado = await supabaseClient
            .from("vehiculos")
            .insert([
//1. name of colum in postgreSQL 2. " JS variable 
                {
                 placa: placa,
                 marca: marca,
                 modelo: modelo,
                 color: color,
                 anio_fabricacion: anioFabricacion,
                 cliente_id: cliente   
                }
            ]);

        error = resultado.error;

    } else {
        const resultado = await supabaseClient
            .from("vehiculos")
            .update({
                placa: placa,
                marca: marca,
                modelo: modelo,
                color: color,
                anio_fabricacion: anioFabricacion,
                cliente_id: cliente
            })

        
            .eq("id", vehiculoEnEdicion);

            error = resultado.error;

    }
//Verificar si ocurrió un error 

    if(error){

        console.log(error);
        alert("Error al guardar Vehículo")
        return;

    }

//actualizar la interfaz

    obtenerVehiculos();


    alert("Vehículo guardado correctamente");

//limpiar formulario 

    formularioVehiculo.reset();

//Restablecer estado del formulario

    vehiculoEnEdicion = null;
    btnVehiculo.textContent = "Agregar Vehículo"
});

async function obtenerVehiculos() {
    const { data, error } = await supabaseClient
        .from("vehiculos")
        .select("*");

    if (error) {
        console.log(error);
        alert("Error al obtener los vehiculos registrados.")
        return;
    }

    mostrarVehiculos(data);

}

function mostrarVehiculos(vehiculos) {

    listaVehiculos.innerHTML = "";

    vehiculos.forEach(function(vehiculo){

        const tarjeta = document.createElement("div");

        tarjeta.innerHTML = `
        <p><strong>Placa:</strong>${vehiculo.placa}</p>
        <p><strong>Marca:</strong>${vehiculo.marca}</p>
        <p><strong>Modelo:</strong>${vehiculo.modelo}</p>
        <p><strong>Color:</strong>${vehiculo.color || "No registrado"}</p>
        <p><strong>Año:</strong>${vehiculo.anio_fabricacion || "No registrado"}</p>
        
            <button onclick="editarVehiculo(${vehiculo.id})">Editar</button>
        
        
            <button onclick="eliminarVehiculo(${vehiculo.id})">Eliminar</button>
        
        `;

        listaVehiculos.appendChild(tarjeta);

    });

}

async function editarVehiculo(id) {

    const { data, error } = await supabaseClient
    .from("vehiculos")
    .select("*")
    .eq("id", id)
    .single();
    
    if(error){
        console.log(error);
        return;
    }

    document.getElementById("placa").value = data.placa
    document.getElementById("marca").value = data.marca;
    document.getElementById("modelo").value = data.modelo;
    document.getElementById("color").value = data.color;
    document.getElementById("anioFabricacion").value = data.anio_fabricacion;
    selectCliente.value = data.cliente_id;

    vehiculoEnEdicion = id;
    btnVehiculo.textContent = "Actualizar vehículo";
    

}

async function eliminarVehiculo(id) {

    const confirmar = confirm("¿Está seguro de que desea eliminar este vehículo?")

    if (!confirmar) {
        return;
    }
    
    const{ error } = await supabaseClient
        .from("vehiculos")
        .delete()
        .eq("id", id);

        if(error) {
            console.log(error);
            alert("Error al eliminar vehículo.")
            return;
        } 

        alert("Vehículo eliminado correctamente.");

        obtenerVehiculos();
}

async function cargarClientes() {
    
    const { data, error } = await supabaseClient
        .from("clientes")
        .select("*");

        if(error) {
            console.log(error);
            return;
        }
        selectCliente.innerHTML = `
            <option value="">Seleccione un cliente</option>
        `;

       

        data.forEach(function(cliente){

             const opcion = document.createElement("option");

            opcion.value = cliente.id;
            opcion.textContent = cliente.nombre;

            selectCliente.appendChild(opcion);

        });
}

cargarClientes();
obtenerVehiculos();