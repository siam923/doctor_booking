// src/docs/auth.docs.js

exports.authDocs = {
  "/api/auth/register": {
    post: {
      tags: ["Authentication"],
      summary: "Register a new user",
      description: "Create a new user account",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["fullname", "email", "phone", "password", "role"],
              properties: {
                fullname: {
                  type: "string",
                  description: "User's fullname",
                  example: "John Doe",
                },
                email: {
                  type: "string",
                  format: "email",
                  description: "User's email address",
                  example: "john@example.com",
                },
                phone: {
                  type: "string",
                  pattern: "^[0-9]{11}$",
                  description: "User's phone number (11 digits)",
                  example: "01234567890",
                },
                password: {
                  type: "string",
                  format: "password",
                  description:
                    "User's password (min 8 characters, at least one uppercase, one lowercase, and one number)",
                  example: "Password123",
                },
                role: {
                  type: "string",
                  enum: ["patient", "doctor", "admin"],
                  description: "User's role",
                  example: "patient",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "User registered successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "User registered successfully",
                  },
                  user: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        description: "User ID",
                        example: "60d0fe4f5311236168a109ca",
                      },
                      fullname: {
                        type: "string",
                        description: "User's fullname",
                        example: "John Doe",
                      },
                      email: {
                        type: "string",
                        description: "User's email address",
                        example: "john@example.com",
                      },
                      phone: {
                        type: "string",
                        description: "User's phone number",
                        example: "01234567890",
                      },
                      role: {
                        type: "string",
                        description: "User's role",
                        example: "patient",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "User already exists or Invalid role",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Server Error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Server error",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/auth/login": {
    post: {
      tags: ["Authentication"],
      summary: "Login user",
      description: "Authenticate a user and return tokens",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  description: "User's email address",
                  example: "john@example.com",
                },
                password: {
                  type: "string",
                  format: "password",
                  description: "User's password",
                  example: "Password123",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Login successful",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  accessToken: {
                    type: "string",
                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                  },
                  refreshToken: {
                    type: "string",
                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                  },
                  user: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        example: "60d5ecb74e4d7b2d1c5e7b1a",
                      },
                      fullname: {
                        type: "string",
                        example: "John Doe",
                      },
                      email: {
                        type: "string",
                        example: "john@example.com",
                      },
                      role: {
                        type: "string",
                        example: "patient",
                      },
                      subscriptionStatus: {
                        type: "string",
                        example: "active",
                        nullable: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Bad request",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Invalid credentials",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Server error",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/auth/refresh-token": {
    post: {
      tags: ["Authentication"],
      summary: "Refresh access token",
      description: "Get a new access token using a refresh token",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["refreshToken"],
              properties: {
                refreshToken: {
                  type: "string",
                  description: "Refresh token",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "New tokens generated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  accessToken: {
                    type: "string",
                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                  },
                  refreshToken: {
                    type: "string",
                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Bad request",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Refresh token is required",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Invalid refresh token",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Server error",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/auth/logout": {
    post: {
      tags: ["Authentication"],
      summary: "Logout user",
      description: "Logout the current user",
      responses: {
        200: {
          description: "Logout successful",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Logged out successfully",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
