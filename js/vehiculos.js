const formularioVehiculo = document.getElementById("formVehiculo");
const selectCliente = document.getElementById("cliente");
const btnVehiculo = document.getElementById("btnVehiculo");
const listaVehiculos = document.getElementById("listaVehiculos");

let vehiculoEnEdicion = null;

//submit 
formularioVehiculo.addEventListener("submit", async function(evento){
//preventDefault
    evento.preventDefault();
//obtener datos
    const placa = document.getElementById("placa").value;
    const marca = document.getElementById("marca").value;
    const modelo = document.getElementById("modelo").value;
    const color = document.getElementById("color").value;
    const anioFabricacion = document.getElementById("anioFabricacion").value;
    const cliente = document.getElementById("cliente").value;
//validar
    if(placa ==="" || marca ==="" || modelo ==="" || cliente ==="") {
        alert("Debe seleccionar un cliente y completar placa, marca, y modelo.");
        return;
    }

    let error;
//insert
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
//update
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
//verificar error

    if(error){

        console.log(error);
        alert("Error al guardar Vehículo")
        return;

    }

//actualizar lista

    obtenerVehiculos();

//alerta

    alert("Vehículo guardado correctamente");

//reset

    formularioVehiculo.reset();

//volver al modo registrar

    vehiculoEnEdicion = null;
    btnVehiculo.textContent = "Agregar Vehículo"
});