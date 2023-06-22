package ram

import (
	"log"
	"net/http"
	"os/exec"
	"so2_practica3_2/backend/commons"
)

/**
 * @apiNote Función invocada cuando se recibe una petición http GET. Hace uso de exec para ejecutar
 * el comando cat y obtener los datos del modulo de memoria mem_grupop2.
 * @params w Response, r Request
 * @return Datos obtenidos desde el modulo de memoria.
 */
func GetRAM(w http.ResponseWriter, r *http.Request) {
	command := exec.Command("sh", "-c", "cat /proc/mem_grupo2")
	moduleData, catError := command.CombinedOutput()

	if catError != nil {
		log.Println("No se pudo obtener datos desde el modulo de memoria.\n" + catError.Error())
		commons.SendError(w, http.StatusInternalServerError)
		return
	}

	commons.SendResponse(w, http.StatusOK, moduleData)
}
