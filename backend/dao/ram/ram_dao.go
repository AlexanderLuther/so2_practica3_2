package dao

type RAM struct {
	Total      int `json:"Total"`
	Occupied   int `json:"Occupied"`
	Percentage int `json:"Percentage"`
	Free       int `json:"Free"`
}
