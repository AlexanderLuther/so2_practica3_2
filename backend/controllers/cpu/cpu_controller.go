package cpu

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"os/exec"
	"so2_practica3_2/backend/commons"
	cpu "so2_practica3_2/backend/dao/cpu"
	"strconv"
	"syscall"

	"github.com/gorilla/mux"
)

/**
 * Función invocada cuando se recibe una petición http GET y responde con los datos ded todos los
 * procesos ejecutándose en el servidor. Hace uso del comando cat. Convierte los datos
 * obtenidos de formato json a un formato definido por la estructura CPU definida en el archivo
 * dao/cpu/cpu_dao. Adicionalmente modifica el usuario y el estado del proceso, ya que estos
 * vienen dados como números desde el modulo de CPU y se les asigna el nombre de usuario y
 * el nombre de estado correspondiente.
 * @params @params w Response, r Request
 * @return Estructura CPU con toda la informacion obtenida del modulo de cpu.
 */
func GetCPU(w http.ResponseWriter, r *http.Request) {
	totalProcesses := 0
	runningProcesses := 0
	stoppedProcesses := 0
	sleepingProcesses := 0
	zombieProcesses := 0

	//Obtener procesos
	command := exec.Command("sh", "-c", "cat /proc/cpu_grupo2")
	moduleData, commandError := command.CombinedOutput()

	if commandError != nil {
		log.Println("No se pudo obtener datos desde el modulo de CPU.\n", commandError.Error())
		commons.SendError(w, http.StatusInternalServerError)
		return
	}

	//Convertir datos obtenidos a estructura Processes
	var processes cpu.CPU
	unMarshallError := json.Unmarshal([]byte(string(moduleData)), &processes)
	if unMarshallError != nil {
		log.Println("No se pudieron interpretar los datos obtenidos del modulo de CPU.\n", unMarshallError.Error())
		commons.SendError(w, http.StatusInternalServerError)
		return
	}

	//Completar datos de cada uno de los procesos
	for i := 0; i < len(processes.Root); i++ {

		//Establecer el estado del proceso y aumentar contadores en base al numero de estado que devuelve el modulo.
		switch processes.Root[i].State {
		case "0":
			processes.Root[i].State = "Running"
			runningProcesses++
			break
		case "1":
			processes.Root[i].State = "Sleeping"
			sleepingProcesses++
			break
		case "2":
			processes.Root[i].State = "Sleeping"
			sleepingProcesses++
			break
		case "4":
			processes.Root[i].State = "Stopped"
			stoppedProcesses++
			break
		case "1026":
			processes.Root[i].State = "Zombie"
			zombieProcesses++
			break
		}
		totalProcesses++

		//Establecer el usuario del proceso en base al numero de usuario que devuelve el modulo.
		command := exec.Command("sh", "-c", "getent passwd "+processes.Root[i].User+" | cut -d ':' -f 1 ")
		user, userError := command.CombinedOutput()
		if userError != nil {
			log.Println("Error al obtener el usuario de un proceso.\n", userError.Error())
			commons.SendError(w, http.StatusInternalServerError)
			return
		}
		processes.Root[i].User = string(user)

		//Se verifica si tiene hijos
		if len(processes.Root[i].Children) != 0 {
			for j := 0; j < len(processes.Root[i].Children); j++ {

				//Establecer el estado del proceso hijo en base al numero de estado que devuelve el modulo.
				switch processes.Root[i].Children[j].State {
				case "0":
					processes.Root[i].Children[j].State = "Running"
					runningProcesses++
					break
				case "1":
					processes.Root[i].Children[j].State = "Sleeping"
					sleepingProcesses++
					break
				case "2":
					processes.Root[i].Children[j].State = "Sleeping"
					sleepingProcesses++
					break
				case "4":
					processes.Root[i].Children[j].State = "Stopped"
					stoppedProcesses++
					break
				case "1026":
					processes.Root[i].Children[j].State = "Zombie"
					zombieProcesses++
					break
				}
				totalProcesses++
			}
		}

	}

	processes.TotalProcesses = int64(totalProcesses)
	processes.TotalRunning = int64(runningProcesses)
	processes.TotalSleeping = int64(sleepingProcesses)
	processes.TotalStopped = int64(stoppedProcesses)
	processes.TotalZombie = int64(zombieProcesses)

	jsonData, _ := json.Marshal(&processes)
	commons.SendResponse(w, http.StatusOK, jsonData)
}

/**
 * Función invocada cuando se recibe una petición DELETE para matar un proceso. Obtiene el id enviado como queryParam, lo castea a un entero
 * y hace uso de process.Signal para matar el proceso cuyo pid fue el que se recibió.
 * @params @params w Response, r Request
 * @return Mensaje indicando el exito de la operacion.
 */
func KillProcess(w http.ResponseWriter, r *http.Request) {
	pid := mux.Vars(r)["id"]

	//Casteo a entero del id recibido
	id, strconvError := strconv.Atoi(pid)

	if strconvError != nil {
		log.Println("No se pudo realizar el casteo a entero del PID proporcionado.\n", strconvError.Error())
		commons.SendError(w, http.StatusInternalServerError)
		return
	}

	//Obtener el proceso
	process, _ := os.FindProcess(id)

	//Matar el proceso
	signalError := process.Signal(syscall.SIGKILL)

	if signalError != nil {
		log.Println("No se pudo matar el proceso.\n", signalError.Error())
		commons.SendError(w, http.StatusInternalServerError)
	}

	jsonData, _ := json.Marshal(`Proceso eliminado exitosamente`)
	commons.SendResponse(w, http.StatusOK, jsonData)
}
