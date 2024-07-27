// src/docs/subscription.docs.js

exports.subscriptionDocs = {
    '/api/subscriptions/payment-info': {
      get: {
        summary: 'Get payment information',
        tags: ['Subscriptions'],
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
                      type: 'object',
                      // Add properties based on your PaymentInfo model
                    }
                  }
                }
              }
            }
          },
          404: {
            description: 'Payment information not found'
          }
        }
      }
    },
    '/api/subscriptions/plans': {
      post: {
        summary: 'Create a new subscription plan',
        tags: ['Subscriptions'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                // Add properties based on your SubscriptionPlan model
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Plan created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      // Add properties based on your SubscriptionPlan model
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          },
          403: {
            description: 'Forbidden - Admin access required'
          }
        }
      },
      get: {
        summary: 'Get all subscription plans',
        tags: ['Subscriptions'],
        security: [{ bearerAuth: [] }],
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
                      items: {
                        type: 'object',
                        // Add properties based on your SubscriptionPlan model
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
          403: {
            description: 'Forbidden - Admin access required'
          }
        }
      }
    },
    '/api/subscriptions/plans/{id}': {
      put: {
        summary: 'Update a subscription plan',
        tags: ['Subscriptions'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'Subscription plan ID'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                // Add properties based on your SubscriptionPlan model
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Plan updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      // Add properties based on your SubscriptionPlan model
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          },
          403: {
            description: 'Forbidden - Admin access required'
          },
          404: {
            description: 'Plan not found'
          }
        }
      },
      delete: {
        summary: 'Delete a subscription plan',
        tags: ['Subscriptions'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'Subscription plan ID'
          }
        ],
        responses: {
          204: {
            description: 'Plan deleted successfully'
          },
          401: {
            description: 'Unauthorized'
          },
          403: {
            description: 'Forbidden - Admin access required'
          },
          404: {
            description: 'Plan not found'
          }
        }
      }
    },
    '/api/subscriptions/subscribe': {
      post: {
        summary: 'Subscribe to a plan',
        tags: ['Subscriptions'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  planId: { type: 'string' },
                  paymentMethod: { type: 'string' },
                  paymentDetails: { type: 'object' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Subscription created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      // Add properties based on your DoctorSubscription model
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          },
          403: {
            description: 'Forbidden - Doctor access required'
          },
          404: {
            description: 'Subscription plan not found'
          }
        }
      }
    },
    '/api/subscriptions/my-subscription': {
      get: {
        summary: 'Get doctor\'s active subscription',
        tags: ['Subscriptions'],
        security: [{ bearerAuth: [] }],
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
                      type: 'object',
                      // Add properties based on your DoctorSubscription model
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          },
          403: {
            description: 'Forbidden - Doctor access required'
          },
          404: {
            description: 'No active subscription found'
          }
        }
      }
    },
    '/api/subscriptions/payment-info': {
      put: {
        summary: 'Update payment information',
        tags: ['Subscriptions'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                // Add properties based on your PaymentInfo model
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Payment information updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      // Add properties based on your PaymentInfo model
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          },
          403: {
            description: 'Forbidden - Admin access required'
          }
        }
      }
    },
    '/api/subscriptions/pending-subscriptions': {
      get: {
        summary: 'Get all pending subscriptions',
        tags: ['Subscriptions'],
        security: [{ bearerAuth: [] }],
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
                      items: {
                        type: 'object',
                        // Add properties based on your DoctorSubscription model
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
          403: {
            description: 'Forbidden - Admin access required'
          }
        }
      }
    },
    '/api/subscriptions/approve-payment/{subscriptionId}': {
      put: {
        summary: 'Approve subscription payment',
        tags: ['Subscriptions'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'subscriptionId',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'Subscription ID'
          }
        ],
        responses: {
          200: {
            description: 'Payment approved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      // Add properties based on your DoctorSubscription model
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          },
          403: {
            description: 'Forbidden - Admin access required'
          },
          404: {
            description: 'Subscription not found'
          }
        }
      }
    },
    '/api/subscriptions/reject-payment/{subscriptionId}': {
      put: {
        summary: 'Reject subscription payment',
        tags: ['Subscriptions'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'subscriptionId',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'Subscription ID'
          }
        ],
        responses: {
          200: {
            description: 'Payment rejected successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      // Add properties based on your DoctorSubscription model
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized'
          },
          403: {
            description: 'Forbidden - Admin access required'
          },
          404: {
            description: 'Subscription not found'
          }
        }
      }
    }
  };