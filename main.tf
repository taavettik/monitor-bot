terraform {
  backend "kubernetes" {
    secret_suffix    = "monitor-bot"
    config_path      = "./kubeconfig"
  }
}

provider "kubernetes" {
  config_path    = "./kubeconfig"
  config_context = "default"
}

locals {
  project_name = "monitor-bot"
}

module "monitor-dev" {
  source = "./terraform"

  project_env = "dev"
  project_name = local.project_name
}
