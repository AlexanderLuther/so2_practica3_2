package memory

import (
	"encoding/json"
	"strings"
	"log"
	"net/http"
	"os/exec"
	"so2_practica3_2/backend/commons"
	memory "so2_practica3_2/backend/dao/memory"
	"github.com/gorilla/mux"
)

/**
 * @apiNote Funcion invocada al recibir una peticion http DELETE. Obtiene el valor del query param id
 * contenido en el request. Hace uso de exec para ejecutar el comando cat y asi obtener la informacion 
 * dentro del archivo maps correspondiente al id que se recibio. Convierte los datos obtenidos a un 
 * arreglo de tipo string, en donde cada indice del arreglo corresponde a una linea. Itera en cada una 
 * de las lineas y obtiene la informacion de cada columna, la interpreta(permisos) y la almacena en la 
 * estructura MEMORY. Por ultimo agrega la estructura a un slice de tipo MEMORY, el cual es codificado
 * en formato json.
 * @params @params w Response, r Request
 * @return Slice de tipo MEMORY con todos los datos obtenidos del archivo maps.
 */
func GetMemoryAssignment(w http.ResponseWriter, r *http.Request) {
	pid := mux.Vars(r)["id"]

	command := exec.Command("sh", "-c", "cat /proc/" + pid + "/maps")
	mapsData, catError := command.CombinedOutput()

	if catError != nil {
		log.Println("No se pudo obtener los datos de asginacion de memoria desde maps.\n" + catError.Error())
		commons.SendError(w, http.StatusInternalServerError)
		return
	}

	//Convetir de arreglo de bytes a arreglo de tipo string
	var lines []string = strings.Split(strings.ReplaceAll(string(mapsData[:]), "\r\n", "\n"), "\n")
	
	//Iniciar slice en donde se almacenaran los datos
	assignments := make([]memory.MEMORY, 0, len(lines))

	//Recorrer cada una de las lineas
	for i:=0; i<len(lines)-1; i++{
		
		//Obtener cada columna y setear el valor de la estructura MEMORY
		data := strings.Fields(lines[i])
		assignment := memory.MEMORY{
			Address: data[0],
			Size: data[2],
			Device: data[3],
		}

		//Interpretar y establecer los permisos
		var permisions string
		if(strings.Contains(data[1], "r")){
			permisions = permisions + "Lectura "
		}

		if(strings.Contains(data[1], "w")){
			permisions = permisions + "Escritura "
		}

		if(strings.Contains(data[1], "x")){
			permisions = permisions + "Ejecucion "
		}

		if(strings.Contains(data[1], "s")){
			permisions = permisions + "Compartido "
		}

		if(strings.Contains(data[1], "p")){
			permisions = permisions + "Privado "
		}
		assignment.Permisions = permisions;

		//Establecer el archivo si este existe
		if len(data) == 6{
			assignment.File = data[5]
		}

		//Agregar la estrutura actual al slice
	    assignments = append(assignments, assignment)
	}

	jsonData, _ := json.Marshal(assignments);
	commons.SendResponse(w, http.StatusOK, jsonData)
}
