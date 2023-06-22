package cpu

type CPU struct {
	Root []struct {
		Process  string `json:"Process"`
		PID      string `json:"PID"`
		RAM      string `json:"RAM"`
		User     string `json:"User"`
		State    string `json:"State"`
		Children []struct {
			Process string `json:"Process"`
			PID     string `json:"PID"`
			State   string `json:"State"`
		} `json:"Children"`
	} `json:"root"`
}
