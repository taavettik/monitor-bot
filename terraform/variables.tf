variable "project_env" {
  type = string
}

variable "project_name" {
  type = string
}

variable "secrets" {
  type = list(string)
  default = []
}