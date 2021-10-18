export const swaggerDoc = {
    "openapi": "3.0.1",
    "info": {
      "version": "0.0.0",
      "title": "Toronto Miracle API Documentation",
      "description": "This API allows access to core Toronto Miracle data to enable user facing applications. As of right now, this API is READ-ONLY.",
      "termsOfService": "",
      "contact": {
        "name": "Kaspar Shahzada",
        "email": "kshahzada45@gmail.com"
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
    "components": {
      "securitySchemes": {
        "id_token": {
          "type": "apiKey",
          "in": "cookie",
          "name": "id_token",
          "description": "To authenticate, use the /resources/authenticate endpoint with a existing captain and then copy the cookie response into here"
        }
      }
    },
    "security": [
      {
        "id_token": [
          "captain"
        ]
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
                    "type": "object",
                    "description": "Response Body",
                    "properties": {
                      "message": {
                        "type": "string",
                        "example": "v1 - Alive!",
                        "description": "Message Body"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/resources/authenticate": {
        "post": {
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "email": {
                      "type": "string",
                      "example": "tony@stark.ca"
                    },
                    "phoneNumber": {
                      "type": "string",
                      "example": 4169671111
                    }
                  }
                }
              }
            }
          },
          "description": "Get all of a captain's volunteers",
          "operationId": "postAuthenticate",
          "responses": {
            "200": {
              "description": "Success",
              "headers": {
                "Set-Cookie": {
                  "description": "Contains the session cookie named `id_token`. Pass this cookie back in subsequent requests.\n",
                  "schema": {
                    "type": "string"
                  }
                }
              },
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "description": "Response Body",
                    "properties": {
                      "id": {
                        "type": "string",
                        "example": "recaaQauqQvbPK0pi"
                      },
                      "email": {
                        "type": "string",
                        "example": "tony@stark.ca"
                      },
                      "firstName": {
                        "type": "string",
                        "example": "Tony"
                      },
                      "lastName": {
                        "type": "string",
                        "example": "Stark"
                      },
                      "phoneNumber": {
                        "type": "string",
                        "example": 1322342342
                      },
                      "isCaptain": {
                        "type": "boolean",
                        "example": true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/resources/loggedin": {
        "get": {
          "description": "Confirm if the user is logged in, return the user details if they are (by checking JWT in cookies; \"id_token\")",
          "operationId": "getLoggedIn",
          "security": [
            {
              "id_token": []
            }
          ],
          "responses": {
            "200": {
              "description": "Success - User is logged in",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "description": "Response Body",
                    "properties": {
                      "id": {
                        "type": "string",
                        "example": "recaaQauqQvbPK0pi"
                      },
                      "email": {
                        "type": "string",
                        "example": "tony@stark.ca"
                      },
                      "firstName": {
                        "type": "string",
                        "example": "Tony"
                      },
                      "lastName": {
                        "type": "string",
                        "example": "Stark"
                      },
                      "phoneNumber": {
                        "type": "string",
                        "example": 1322342342
                      },
                      "isCaptain": {
                        "type": "boolean",
                        "example": true
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Failure - User is not logged in",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "description": "Response Body",
                    "properties": {
                      "error": {
                        "type": "string",
                        "description": "Error Message",
                        "example": "invalid token"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/resources/captains/{captainId}/volunteers": {
        "get": {
          "security": [
            {
              "id_token": [
                "user"
              ]
            }
          ],
          "parameters": [
            {
              "in": "cookie",
              "name": "token_id",
              "schema": {
                "type": "string",
                "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJyZWNhYVFhdXFRdmJQSzBVWSIsImlhdCI6MTYzNDUyMjM5NSwiZXhwIjoxNjM0NTUxMTk1fQ.tCHL84AOSuwNNGeJUikPEPdtg6xe3jv7F_E7LfbnIHk"
              },
              "required": true,
              "description": "JWT stored as cookie with user id"
            },
            {
              "in": "path",
              "name": "captainId",
              "schema": {
                "type": "string",
                "example": "recYIFFC1Uq2HYAuj"
              },
              "required": true,
              "description": "Record ID / User ID of the Captain"
            }
          ],
          "description": "Get all of a captain's volunteers",
          "operationId": "getCaptainVolunteers",
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "description": "Response Body",
                    "properties": {
                      "message": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "id": {
                              "type": "string",
                              "example": "recYIFFC1Uq2HYAuj"
                            },
                            "Email": {
                              "type": "string",
                              "example": "tony@stark.ca"
                            },
                            "First Name": {
                              "type": "string",
                              "example": "Tony"
                            },
                            "Last Name": {
                              "type": "string",
                              "example": "Stark"
                            },
                            "Phone Number": {
                              "type": "string",
                              "example": 4169671111
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }