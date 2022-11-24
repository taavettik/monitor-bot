variable "service" {
  type = string
}

variable "project_name" {
  type = string
}

variable "project_env" {
  type = string
}

variable "image" {
  type = string
  default = null
}

variable "port" {
  type = number
  default = 8080
}