package memory

import (
	"encoding/json"
	"log"
	"net/http"
	"os/exec"
	"so2_practica3_2/backend/commons"
	memory "so2_practica3_2/backend/dao/memory"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
)

/**
 * @apiNote Función invocada al recibir una petición http GET. Obtiene el valor del query param id
 * contenido en el request. Hace uso de exec para ejecutar el comando cat y asi obtener la información
 * dentro del archivo maps correspondiente al id que se recibió. También obtiene información del archivo
 * smaps en base al id que se recibió y al al valor assignment.Address. Convierte los datos obtenidos a un
 * arreglo de tipo string, en donde cada indice del arreglo corresponde a una linea. Itera en cada una
 * de las lineas y obtiene la información de cada columna, la interpreta(permisos) y la almacena en la
 * estructura MEMORY. Por ultimo agrega la estructura a un slice de tipo MEMORY, el cual es codificado
 * en formato json.
 * @params @params w Response, r Request
 * @return Slice de tipo MEMORY con todos los datos obtenidos del archivo maps.
 */
func GetMemoryAssignment(w http.ResponseWriter, r *http.Request) {
	pid := mux.Vars(r)["id"]

	command := exec.Command("sh", "-c", "cat /proc/"+pid+"/maps")
	mapsData, catError := command.CombinedOutput()

	if catError != nil {
		log.Println("No se pudo obtener los datos de asignación de memoria desde maps.\n" + catError.Error())
		commons.SendError(w, http.StatusInternalServerError)
		return
	}

	//Convertir de arreglo de bytes a arreglo de tipo string
	var lines []string = strings.Split(strings.ReplaceAll(string(mapsData[:]), "\r\n", "\n"), "\n")

	//Iniciar slice en donde se almacenaran los datos
	assignments := make([]memory.MEMORY, 0, len(lines))

	//Recorrer cada una de las lineas
	for i := 0; i < len(lines)-1; i++ {

		//Obtener cada columna y setear el valor de la estructura MEMORY
		data := strings.Fields(lines[i])
		assignment := memory.MEMORY{
			Address: data[0],
			Device:  data[3],
		}

		//Interpretar y establecer los permisos
		var permissions string
		if strings.Contains(data[1], "r") {
			permissions = permissions + "Lectura "
		}

		if strings.Contains(data[1], "w") {
			permissions = permissions + "Escritura "
		}

		if strings.Contains(data[1], "x") {
			permissions = permissions + "Ejecución "
		}

		if strings.Contains(data[1], "s") {
			permissions = permissions + "Compartido "
		}

		if strings.Contains(data[1], "p") {
			permissions = permissions + "Privado "
		}
		assignment.Permissions = permissions

		//Establecer el archivo si este existe
		if len(data) == 6 {
			assignment.File = data[5]
		}

		//Obtener los valores de RSS Y Size desde el archivo smaps
		if !setRssAndSize(&assignment, pid) {
			commons.SendError(w, http.StatusInternalServerError)
			return
		}

		//Agregar la estructura actual al slice
		assignments = append(assignments, assignment)
	}

	jsonData, _ := json.Marshal(assignments)
	commons.SendResponse(w, http.StatusOK, jsonData)
}

/*
 * @apiNote: Método privado hace uso del comando cat para obtener los datos contenidos en el archivo smaps.
 * Filtra los datos utilizando el comando grep y obtiene unicamente los valores de Rss y Size. Convierte
 * el arreglo de bites obtenido en un arreglo de tipo string y obtiene los valores numéricos. Divide los
 * valores obtenidos entre 1024 para tenerlos en MB y los guarda en la estructura assignment.
 * @params assignment, puntero de la estructura donde se guardara la información
 *	       pid, process id del proceso a buscar en la carpeta proc
 * return true, si todo se realizo con éxito
 *        false, si hubo un error obteniendo los datos.
 */
func setRssAndSize(assignment *memory.MEMORY, pid string) bool {
	command := exec.Command("sh", "-c", "cat /proc/"+pid+"/smaps | grep "+assignment.Address+" -A 4 | grep -E 'Rss|^Size'")
	data, catError := command.CombinedOutput()

	if catError != nil {
		log.Println("No se pudo obtener los datos de Rss y Size de memoria desde smaps.\n" + catError.Error())
		return false
	}

	var lines []string = strings.Split(strings.ReplaceAll(string(data[:]), "\r\n", "\n"), "\n")
	size, _ := strconv.ParseFloat(strings.Fields(lines[0])[1], 64)
	rss, _ := strconv.ParseFloat(strings.Fields(lines[1])[1], 64)

	assignment.Size = size / 1024
	assignment.Rss = rss / 1024

	return true
}
