//variables
const formulario = document.querySelector('#agregar-gasto');
const listadoGastos = document.querySelector('#gastos ul');

//Eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', insertarPresupuesto);
    document.addEventListener('submit', agregarGasto);
}

//Clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = presupuesto;
        this.restante = presupuesto;
        this.gastos = [];
    }

    insertarGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }
    
    eliminarGasto(id) {
        this.gastos = this.gastos.filter( gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI {

    insertarPresupuesto(cantidad) {
        const {presupuesto, restante} = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;

    }

    alertaEntrada(mensaje, tipo) {
        const divMensaje = document.createElement('DIV');
        divMensaje.textContent = mensaje;
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error') 
            divMensaje.classList.add('alert-danger');
        divMensaje.classList.add('alert-success');

        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    mostrarListadoGastos(gastos) {
        this.limpiarHTML(); //Eliminar el HTML previo
        gastos.forEach( iGasto => {

            const {gasto, cantidad, id} = iGasto;
            const li = document.createElement('LI');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.dataset.id = id;

            //Agregamos el HTML del gasto
            li.innerHTML = `${gasto} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span>`;
            
            //Agregamos boton para eliminar
            const btn = document.createElement('button');
            btn.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btn.innerHTML = 'Eliminar &times';
            btn.onclick = () => {
                eliminarGasto(id);
            }
            li.appendChild(btn);
            //Agregarmos al html el gasto
            listadoGastos.appendChild(li);

        })   
    }
    limpiarHTML() {
        while(listadoGastos.firstChild) {
            listadoGastos.removeChild(listadoGastos.firstChild);
        }
    }

    actualizarRestante(restante, totalPresupuesto) {
        const htmlRestante = document.querySelector('.restante');
        document.querySelector('#restante').textContent = restante;

        if(restante <= totalPresupuesto * 0.25) {
            htmlRestante.classList.remove('alert-success', 'alert-warning');
            htmlRestante.classList.add('alert-danger');
        } else if(restante <= totalPresupuesto * 0.5) {
            htmlRestante.classList.remove('alert-success', 'alert-danger');
            htmlRestante.classList.add('alert-warning');
        } else {
            htmlRestante.classList.remove('alert-warning', 'alert-danger');
            htmlRestante.classList.add('alert-success');
        }

        if(restante <= 0) {
            this.alertaEntrada('El presupuesto se agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }

}
const ui = new UI();
let iPresupuesto;
//Funciones
function insertarPresupuesto() {
    const presupuesto = prompt('¿Cuál es tu presupuesto?');
    if(presupuesto === '' || presupuesto === null || isNaN(presupuesto) || presupuesto <= 0) {
        window.location.reload();
    }
    
    iPresupuesto = new Presupuesto(presupuesto);
    ui.insertarPresupuesto(iPresupuesto);
}

function agregarGasto() {
    const gasto = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    if(gasto === '' || cantidad === '' ) {
        ui.alertaEntrada('Los campos son obligatorios', 'error');
        return;
    } else if( cantidad <= 0 || isNaN(cantidad)) {
        ui.alertaEntrada('Cantidad no válida', 'error');
        return;
    }

    const datosGasto = {gasto, cantidad, id: Date.now()};
    iPresupuesto.insertarGasto(datosGasto);

    //Reiniciamos el formulario
    formulario.reset();
    //Mostramos success alert
    ui.alertaEntrada('Agregado correctamente');

    const {gastos, restante, presupuesto} = iPresupuesto;
    ui.mostrarListadoGastos(gastos);
    ui.actualizarRestante(restante, presupuesto);
}

function eliminarGasto(id) {
    //Eliminamos los gastos del obejeto
    iPresupuesto.eliminarGasto(id);
    //Eliminamos los gastos del HTML
    const {gastos, restante, presupuesto} = iPresupuesto;
    ui.mostrarListadoGastos(gastos);
    //actualizamos el restante
    ui.actualizarRestante(restante, presupuesto);
}