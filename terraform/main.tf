locals {
  namespace_name = "${var.project_name}-${var.project_env}"
}

resource "kubernetes_namespace" "namespace" {
  metadata {
    name = local.namespace_name
  }
}

module "service" {
  source = "./service"

  service = "server"
  project_name = var.project_name
  project_env = var.project_env

  secrets = {
    BOT_TOKEN = "bot-token"
    RTSP_URL = "rtsp-url"
    TG_CHAT_ID = "tg-chat-id"
  }
}

module "ingress" {
  source = "./ingress"

  domain = "monitor.kukkonen.dev"
  project_name = var.project_name
  namespace = local.namespace_name
  paths = [{
    service = "server"
    port = 8080
    path = "/"
  }]
}