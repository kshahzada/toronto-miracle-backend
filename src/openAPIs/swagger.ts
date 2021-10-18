export const swaggerDoc = {
    "openapi": "3.0.1",
    "info": {
      "version": "1.0.0",
      "title": "Toronto Miracle API Documentation",
      "description": "This API allows access to core Toronto Miracle data to enable user facing applications. As of right now, this API is READ-ONLY.",
      "termsOfService": "",
      "contact": {
        "name": "Kaspar Shahzada",
        "email": "kshahzada45@gmail.com"
      },
      "license": {
        "name": "Apache 2.0",
        "url": "https://www.apache.org/licenses/LICENSE-2.0.html"
      }
    },
    "servers": [
      {
        "url": "http://localhost:5000/v1",
        "description": "Local Server"
      },
      {
        "url": "https://dev-api.torontomiracle.org/v1",
        "description": "Development Server"
      },
      {
        "url": "https://api.torontomiracle.org/v1",
        "description": "Production Server"
      }
    ],
    "paths": {
      "/resources/healthcheck": {
        "get": {
          "description": "Returns an alive message to let you know the API is up ",
          "operationId": "getHealthcheck",
          "responses": {
            "200": {
              "description": "Healthcheck Message",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "string",
                    "description": "Healthcheck Message"
                  }
                }
              }
            }
          }
        }
      }
    }
  }