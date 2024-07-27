// src/docs/patients.docs.js

exports.patientDocs = {
    '/api/patients/register': {
      post: {
        summary: 'Register a new patient',
        tags: ['Patients'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['dateOfBirth', 'gender'],
                properties: {
                  dateOfBirth: {
                    type: 'string',
                    format: 'date',
                    description: 'Patient\'s date of birth'
                  },
                  gender: {
                    type: 'string',
                    enum: ['male', 'female', 'other'],
                    description: 'Patient\'s gender'
                  },
                  medicalHistory: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        condition: { type: 'string' },
                        diagnosisDate: { type: 'string', format: 'date' },
                        notes: { type: 'string' }
                      }
                    }
                  },
                  allergies: {
                    type: 'array',
                    items: { type: 'string' }
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Patient registered successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        patient: { type: 'object' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/patients/profile': {
      get: {
        summary: 'Get patient profile',
        tags: ['Patients'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Patient profile retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        patient: { type: 'object' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      put: {
        summary: 'Update patient profile',
        tags: ['Patients'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  dateOfBirth: { type: 'string', format: 'date' },
                  gender: { type: 'string', enum: ['male', 'female', 'other'] },
                  medicalHistory: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        condition: { type: 'string' },
                        diagnosisDate: { type: 'string', format: 'date' },
                        notes: { type: 'string' }
                      }
                    }
                  },
                  allergies: {
                    type: 'array',
                    items: { type: 'string' }
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Patient profile updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        patient: { type: 'object' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/patients/medical-history': {
      post: {
        summary: 'Add medical history',
        tags: ['Patients'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['condition', 'diagnosisDate'],
                properties: {
                  condition: { type: 'string' },
                  diagnosisDate: { type: 'string', format: 'date' },
                  notes: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Medical history added successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        patient: { type: 'object' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/patients/medical-history/{historyId}': {
      put: {
        summary: 'Update medical history',
        tags: ['Patients'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'historyId',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  condition: { type: 'string' },
                  diagnosisDate: { type: 'string', format: 'date' },
                  notes: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Medical history updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        patient: { type: 'object' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      delete: {
        summary: 'Delete medical history',
        tags: ['Patients'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'historyId',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'Medical history deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        patient: { type: 'object' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/patients/allergies': {
      post: {
        summary: 'Add allergy',
        tags: ['Patients'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['allergy'],
                properties: {
                  allergy: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Allergy added successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        patient: { type: 'object' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/patients/allergies/{allergy}': {
      delete: {
        summary: 'Remove allergy',
        tags: ['Patients'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'allergy',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'Allergy removed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        patient: { type: 'object' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/patients/appointments': {
      get: {
        summary: 'Get appointment history',
        tags: ['Patients'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'page',
            schema: {
              type: 'integer',
              default: 1
            }
          },
          {
            in: 'query',
            name: 'limit',
            schema: {
              type: 'integer',
              default: 10
            }
          }
        ],
        responses: {
          200: {
            description: 'Appointment history retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        appointments: { type: 'array', items: { type: 'object' } },
                        currentPage: { type: 'number' },
                        totalPages: { type: 'number' },
                        totalAppointments: { type: 'number' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/patients/favorite-doctors/{doctorId}': {
      post: {
        summary: 'Add favorite doctor',
        tags: ['Patients'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'doctorId',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'Favorite doctor added successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        patient: { type: 'object' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      delete: {
        summary: 'Remove favorite doctor',
        tags: ['Patients'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'doctorId',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'Favorite doctor removed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        patient: { type: 'object' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/patients/favorite-doctors': {
      get: {
        summary: 'Get favorite doctors',
        tags: ['Patients'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Favorite doctors retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        favoriteDoctors: { type: 'array', items: { type: 'object' } }
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
  };