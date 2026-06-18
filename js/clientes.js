const formulario = document.getElementById("formCliente");
const listaClientes = document.getElementById("listaClientes");
const btnGuardar = document.getElementById("btnGuardar");


let clienteEnEdicion = null;

let clientes = [];

formulario.addEventListener("submit", async function(evento){
    
    evento.preventDefault();
    
    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
    
    if(nombre === "" || telefono === "") {
    
        alert("completa todos los campos");
        return;
    }

    let error;

    if(clienteEnEdicion === null) {

        const resultado = await supabaseClient
            .from("clientes")
            .insert([
                {
                    nombre: nombre,
                    telefono: telefono
                }
            ]);

            error = resultado.error;

    } else {

        const resultado = await supabaseClient
            .from("clientes")
            .update({
                nombre: nombre,
                telefono: telefono
            })
            
            .eq("id", clienteEnEdicion); 

        error = resultado.error;

    }

    if(error) {
        console.log(error);

        alert("Error al guardar cliente");

        return;
    }

    obtenerClientes();

    alert("Cliente guardado correctamente");

    formulario.reset();
    clienteEnEdicion = null;
    btnGuardar.textContent = "Registrar";

    
});

function mostrarClientes(clientes) {

    listaClientes.innerHTML = "";

    clientes.forEach(function(cliente){

        listaClientes.innerHTML += 
            `
            <div>
            <p>${cliente.nombre} - ${cliente.telefono}</p>

            <button onclick="editarCliente(${cliente.id})">Editar</button>

            <button onclick="eliminarCliente(${cliente.id})">Eliminar</button>

            <hr>
            </div>
            `;
            
    });

}

function editarCliente(id) {

    clienteEnEdicion = id;

    const cliente = clientes.find(function(cliente) {

        return cliente.id === id;

    });

    document.getElementById("nombre").value = cliente.nombre;

    document.getElementById("telefono").value = cliente.telefono;

    btnGuardar.textContent = "Actualizar";

}

async function eliminarCliente(id) {
    
    const { error } = await supabaseClient
        .from("clientes")
        .delete()
        .eq("id", id);

        if(error) {
            console.log(error);
        }
        obtenerClientes();

}

async function obtenerClientes() {

    const { data, error } = await supabaseClient
        .from("clientes")
        .select("*");

    clientes = data;

    mostrarClientes(data);

}

obtenerClientes();