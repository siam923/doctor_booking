// src/docs/appointments.docs.js

exports.appointmentDocs = {
    '/api/appointments/available-slots': {
      get: {
        summary: 'Get available appointment slots',
        tags: ['Appointments'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'doctorId',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'ID of the doctor'
          },
          {
            in: 'query',
            name: 'date',
            required: true,
            schema: {
              type: 'string',
              format: 'date'
            },
            description: 'Date for which to check available slots (YYYY-MM-DD)'
          }
        ],
        responses: {
          200: {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success'
                    },
                    data: {
                      type: 'object',
                      properties: {
                        availableSlots: {
                          type: 'array',
                          items: {
                            type: 'string',
                            format: 'date-time'
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'No availability found'
          }
        }
      }
    },
    '/api/appointments': {
      post: {
        summary: 'Create a new appointment',
        tags: ['Appointments'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['doctorId', 'dateTime'],
                properties: {
                  doctorId: {
                    type: 'string'
                  },
                  dateTime: {
                    type: 'string',
                    format: 'date-time'
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Appointment created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success'
                    },
                    data: {
                      type: 'object',
                      properties: {
                        appointment: {
                          type: 'object',
                          // Define appointment object schema here
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Bad request'
          },
          401: {
            description: 'Unauthorized'
          }
        }
      }
    },
    '/api/appointments/{appointmentId}/cancel': {
      put: {
        summary: 'Cancel an appointment',
        tags: ['Appointments'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'appointmentId',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'ID of the appointment to cancel'
          }
        ],
        responses: {
          200: {
            description: 'Appointment cancelled successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success'
                    },
                    data: {
                      type: 'object',
                      properties: {
                        appointment: {
                          type: 'object',
                          // Define appointment object schema here
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Bad request'
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'Appointment not found'
          }
        }
      }
    },
    '/api/appointments/{appointmentId}/reschedule': {
      put: {
        summary: 'Reschedule an appointment',
        tags: ['Appointments'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'appointmentId',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'ID of the appointment to reschedule'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['newDateTime'],
                properties: {
                  newDateTime: {
                    type: 'string',
                    format: 'date-time'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Appointment rescheduled successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success'
                    },
                    data: {
                      type: 'object',
                      properties: {
                        appointment: {
                          type: 'object',
                          // Define appointment object schema here
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Bad request'
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'Appointment not found'
          }
        }
      }
    },
    '/api/appointments/upcoming': {
      get: {
        summary: 'Get upcoming appointments',
        tags: ['Appointments'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success'
                    },
                    data: {
                      type: 'object',
                      properties: {
                        appointments: {
                          type: 'array',
                          items: {
                            type: 'object',
                            // Define appointment object schema here
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          }
        }
      }
    }
  };