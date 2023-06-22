package main

import (
	"log"
	"net/http"
	cpuController "so2_practica3_2/backend/controllers/cpu"
	memoryAssignmentController "so2_practica3_2/backend/controllers/memory"
	ramController "so2_practica3_2/backend/controllers/ram"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func main() {
	port := "8080"
	r := mux.NewRouter().StrictSlash(true)
	r.HandleFunc("/ram", ramController.GetRAM).Methods("GET")
	r.HandleFunc("/cpu", cpuController.GetCPU).Methods("GET")
	r.HandleFunc("/memory-assignment/{id}", memoryAssignmentController.GetMemoryAssignment).Methods("GET")
	r.HandleFunc("/kill/{id}", cpuController.KillProcess).Methods("DELETE")

	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS", "DELETE"})
	originsOk := handlers.AllowedOrigins([]string{"*"})

	log.Println("Servidor iniciado en el puerto: " + port)
	error := http.ListenAndServe(":"+port, handlers.CORS(originsOk, headersOk, methodsOk)(r))

	if error != nil {
		log.Fatal("Error al iniciar el servidor.\n", error)
	}

}
