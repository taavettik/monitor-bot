resource "kubernetes_ingress_v1" "ingress" {
  metadata {
    name = var.project_name
    namespace = var.namespace
    annotations = {
      "kubernetes.io/ingress.class": "traefik"
      "traefik.ingress.kubernetes.io/rule-type": "PathPrefixStrip"
      "cert-manager.io/cluster-issuer": "letsencrypt-prod"
    }
  }

  spec {
    tls {
      secret_name = "${var.project_name}-tls"
      hosts = [ var.domain ]
    }

    rule {
      host = var.domain
      http {
        dynamic "path" {
          for_each = toset(var.paths)
          content {
            backend {
              service {
                name = "${var.project_name}-${path.value.service}"
                port {
                  number = path.value.port
                }
              }
            }
            path = path.value.path
          }
        }
      }
    }
  }
}