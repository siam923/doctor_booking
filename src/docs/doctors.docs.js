// src/docs/doctors.docs.js

exports.doctorDocs = {
    '/api/doctors': {
      get: {
        summary: 'Get all doctors',
        tags: ['Doctors'],
        parameters: [
          {
            in: 'query',
            name: 'page',
            schema: { type: 'integer' },
            description: 'Page number for pagination',
          },
          {
            in: 'query',
            name: 'limit',
            schema: { type: 'integer' },
            description: 'Number of items per page',
          },
          {
            in: 'query',
            name: 'specialization',
            schema: { type: 'string' },
            description: 'Filter by specialization',
          },
          {
            in: 'query',
            name: 'hospital',
            schema: { type: 'string' },
            description: 'Filter by hospital',
          },
          {
            in: 'query',
            name: 'location',
            schema: { type: 'string' },
            description: 'Filter by location (format: lng,lat)',
          },
          {
            in: 'query',
            name: 'search',
            schema: { type: 'string' },
            description: 'Search term for doctors',
          },
        ],
        responses: {
          200: {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Doctor' },
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        totalCount: { type: 'integer' },
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                        totalPages: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new doctor',
        tags: ['Doctors'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/DoctorInput',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Doctor created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Doctor' },
                  },
                },
              },
            },
          },
          400: { description: 'Bad request' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
        },
      },
    },
    '/api/doctors/hospitals': {
      get: {
        summary: 'Get all hospitals',
        tags: ['Doctors'],
        parameters: [
          {
            in: 'query',
            name: 'search',
            schema: { type: 'string' },
            description: 'Search term for hospitals',
          },
        ],
        responses: {
          200: {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/doctors/specializations': {
      get: {
        summary: 'Get all specializations',
        tags: ['Doctors'],
        parameters: [
          {
            in: 'query',
            name: 'search',
            schema: { type: 'string' },
            description: 'Search term for specializations',
          },
        ],
        responses: {
          200: {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Specialization' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/doctors/{id}': {
      get: {
        summary: 'Get a doctor by ID',
        tags: ['Doctors'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Doctor ID',
          },
        ],
        responses: {
          200: {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Doctor' },
                  },
                },
              },
            },
          },
          404: { description: 'Doctor not found' },
        },
      },
      put: {
        summary: 'Update a doctor',
        tags: ['Doctors'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Doctor ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/DoctorUpdateInput',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Doctor updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Doctor' },
                  },
                },
              },
            },
          },
          400: { description: 'Bad request' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
          404: { description: 'Doctor not found' },
        },
      },
      delete: {
        summary: 'Delete a doctor',
        tags: ['Doctors'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Doctor ID',
          },
        ],
        responses: {
          204: { description: 'Doctor deleted successfully' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
          404: { description: 'Doctor not found' },
        },
      },
    },
    '/api/doctors/{id}/schedule': {
      put: {
        summary: 'Update doctor schedule',
        tags: ['Doctors'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Doctor ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  schedule: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/ScheduleSlot' },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Schedule updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/ScheduleSlot' },
                    },
                  },
                },
              },
            },
          },
          400: { description: 'Bad request' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
          404: { description: 'Doctor not found' },
        },
      },
    },
  };
  
  // Add these schema definitions at the end of the file
  exports.doctorSchemas = {
    Doctor: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        userId: { $ref: '#/components/schemas/User' },
        specialization: { $ref: '#/components/schemas/Specialization' },
        qualifications: { type: 'array', items: { type: 'string' } },
        yearsOfExperience: { type: 'number' },
        availableSlots: {
          type: 'array',
          items: { $ref: '#/components/schemas/ScheduleSlot' },
        },
        rating: { type: 'number' },
        reviewsCount: { type: 'number' },
        consultationFee: { type: 'number' },
        bio: { type: 'string' },
        profilePicture: { type: 'string' },
        hospitals: { type: 'array', items: { type: 'string' } },
        location: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['Point'] },
            coordinates: { type: 'array', items: { type: 'number' } },
          },
        },
      },
    },
    DoctorInput: {
      type: 'object',
      required: ['userId', 'specialization', 'qualifications', 'yearsOfExperience', 'consultationFee'],
      properties: {
        userId: { type: 'string' },
        specialization: { type: 'string' },
        qualifications: { type: 'array', items: { type: 'string' } },
        yearsOfExperience: { type: 'number' },
        consultationFee: { type: 'number' },
        bio: { type: 'string' },
        profilePicture: { type: 'string' },
        hospitals: { type: 'array', items: { type: 'string' } },
        location: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['Point'] },
            coordinates: { type: 'array', items: { type: 'number' } },
          },
        },
      },
    },
    DoctorUpdateInput: {
      type: 'object',
      properties: {
        specialization: { type: 'string' },
        qualifications: { type: 'array', items: { type: 'string' } },
        yearsOfExperience: { type: 'number' },
        consultationFee: { type: 'number' },
        bio: { type: 'string' },
        profilePicture: { type: 'string' },
        hospitals: { type: 'array', items: { type: 'string' } },
        location: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['Point'] },
            coordinates: { type: 'array', items: { type: 'number' } },
          },
        },
      },
    },
    User: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string' },
      },
    },
    Specialization: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
      },
    },
    ScheduleSlot: {
      type: 'object',
      properties: {
        day: { type: 'string', enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
        slots: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              startTime: { type: 'string' },
              endTime: { type: 'string' },
            },
          },
        },
      },
    },
  };