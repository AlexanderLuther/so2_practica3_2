package memory

type MEMORY struct {
	Address     string  `json:"address"`
	Permissions string  `json:"permissions"`
	Device      string  `json:"device"`
	File        string  `json:"file"`
	Rss         float64 `json:"rss"`
	Size        float64 `json:"size"`
}
