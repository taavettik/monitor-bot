variable "namespace" {
  type = string
}

variable "project_name" {
  type = string
}

variable "domain" {
  type = string
}

variable "paths" {
  type = list(object({
    service = string
    port = number
    path = string
  }))
  default = []
}