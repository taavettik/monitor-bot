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

module "monitor-prod" {
  source = "./terraform"

  project_env = "prod"
  project_name = local.project_name
}