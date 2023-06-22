import globals from '../utils/global';

const BASE_URL = globals.hostPrincipal;
const URL_GET_RAM = `${BASE_URL}/ram`
const URL_GET_PROCESSES = `${BASE_URL}/cpu`
const URL_KILL_PROCESSES = `${BASE_URL}/kill/`
const URL_GET_MEMORY_ASSIGNMENTS = `${BASE_URL}/memory-assignment/`

//FUNCIÓN OBTENER INFORMACIÓN DE LA RAM
export async function getRamInformation() {
    return window.fetch(URL_GET_RAM, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
}

//FUNCIÓN OBTENER INFORMACIÓN DEL CPU
export async function getCpuProcesses() {
    return window.fetch(URL_GET_PROCESSES, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
}

//FUNCIÓN OBTENER ASIGNACIONES DE MEMORIA DE UN PROCESO
export async function getMemoryAssignments(id) {
    return window.fetch(URL_GET_MEMORY_ASSIGNMENTS+id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
}

//FUNCIÓN MATAR UN PROCESO
export async function killProcess(id) {
    return window.fetch(URL_KILL_PROCESSES+id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
}