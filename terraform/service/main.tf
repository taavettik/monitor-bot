locals {
  app = "${var.project_name}-${var.service}"
}

resource "kubernetes_deployment" "deployment" {
  metadata {
    name = local.app
    namespace = "${var.project_name}-${var.project_env}"
    labels = {
      app = local.app
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = local.app
      }
    }

    template {
      metadata {
        labels = {
          app = local.app
        }
      }

      spec {
        dynamic "volume" {
          for_each = var.secrets
          content {
            name = volume.value
            secret {
              secret_name = volume.value
            }
          }
        }
        container {
          image = coalesce(var.image, "ghcr.io/taavettik/${var.project_name}:${var.project_env}")
          name  = var.service
          image_pull_policy = "always"

          dynamic "volume_mount" {
            for_each = var.secrets
            content {
              mount_path = "/run/secrets/${volume_mount.key}"
              name = volume_mount.value
            }
          }

          resources {
            limits = {
              cpu    = "0.5"
              memory = "512Mi"
            }
            requests = {
              cpu    = "250m"
              memory = "50Mi"
            }
          }

          liveness_probe {
            http_get {
              path = "/"
              port = 8080
            }

            initial_delay_seconds = 20
            period_seconds        = 10
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "service" {
  metadata {
    name = local.app
    namespace = "${var.project_name}-${var.project_env}"
  }
  spec {
    selector = {
      app = local.app
    }
    port {
      port        = 8080
      target_port = var.port
    }
  }
}