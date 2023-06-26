package dao

type RAM struct {
	Total      int `json:"total"`
	Occupied   int `json:"occupied"`
	Percentage int `json:"percentage"`
	Free       int `json:"free"`
}
