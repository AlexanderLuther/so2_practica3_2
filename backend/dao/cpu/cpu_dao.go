package cpu

type CPU struct {
	Root []struct {
		Process  string `json:"process"`
		PID      string `json:"pid"`
		RAM      string `json:"ram"`
		User     string `json:"user"`
		State    string `json:"state"`
		Children []struct {
			Process string `json:"process"`
			PID     string `json:"pid"`
			State   string `json:"state"`
		} `json:"children"`
	} `json:"root"`
	TotalProcesses int64 `json:"totalProcesses"`
	TotalSleeping  int64 `json:"totalSleeping"`
	TotalStopped   int64 `json:"totalStopped"`
	TotalRunning   int64 `json:"totalRunning"`
	TotalZombie    int64 `json:"totalZombie"`
}
