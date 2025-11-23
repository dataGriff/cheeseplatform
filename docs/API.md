# Cheese Platform API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Cheese Company Inc",
  "email": "company@example.com",
  "password": "securepassword"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "company@example.com",
  "password": "securepassword"
}
```

## Cheeses

### Create Cheese
```http
POST /cheeses
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Aged Cheddar",
  "description": "A sharp, mature cheddar with complex flavors",
  "type": "hard",
  "texture": "crumbly",
  "flavorProfile": ["sharp", "nutty", "tangy"],
  "milkType": "cow",
  "intensity": 8,
  "imageUrl": "https://example.com/cheddar.jpg"
}
```

### Get All Cheeses
```http
GET /cheeses
Authorization: Bearer <token>
```

### Get Single Cheese
```http
GET /cheeses/:id
Authorization: Bearer <token>
```

### Update Cheese
```http
PUT /cheeses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Extra Aged Cheddar",
  "intensity": 9
}
```

### Delete Cheese
```http
DELETE /cheeses/:id
Authorization: Bearer <token>
```

## Questionnaires

### Create Questionnaire
```http
POST /questionnaires
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Find Your Perfect Cheese",
  "description": "Discover cheeses that match your taste preferences",
  "questions": [
    {
      "id": "intensity",
      "type": "range",
      "label": "How intense do you like your cheese flavor? (1-10)",
      "required": true
    },
    {
      "id": "texture",
      "type": "multiselect",
      "label": "What textures do you prefer?",
      "options": ["soft", "semi-soft", "hard", "crumbly"],
      "required": true
    },
    {
      "id": "milkType",
      "type": "multiselect",
      "label": "What milk types do you enjoy?",
      "options": ["cow", "goat", "sheep", "buffalo"],
      "required": false
    },
    {
      "id": "flavors",
      "type": "multiselect",
      "label": "What flavors appeal to you?",
      "options": ["mild", "sharp", "nutty", "tangy", "creamy", "earthy"],
      "required": false
    }
  ]
}
```

### Get All Questionnaires
```http
GET /questionnaires
Authorization: Bearer <token>
```

### Get Single Questionnaire
```http
GET /questionnaires/:id
Authorization: Bearer <token>
```

### Update Questionnaire
```http
PUT /questionnaires/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "isActive": true
}
```

### Delete Questionnaire
```http
DELETE /questionnaires/:id
Authorization: Bearer <token>
```

## Responses (Public)

### Submit Questionnaire Response
```http
POST /responses/:questionnaireId/submit
Content-Type: application/json

{
  "customerEmail": "customer@example.com",
  "responses": [
    {
      "questionId": "intensity",
      "answer": 7
    },
    {
      "questionId": "texture",
      "answer": ["hard", "crumbly"]
    },
    {
      "questionId": "milkType",
      "answer": ["cow", "goat"]
    },
    {
      "questionId": "flavors",
      "answer": ["sharp", "nutty"]
    }
  ]
}
```

Response:
```json
{
  "message": "Response submitted successfully",
  "responseId": 1,
  "recommendations": [
    {
      "id": 1,
      "name": "Aged Cheddar",
      "description": "A sharp, mature cheddar with complex flavors",
      "type": "hard",
      "texture": "crumbly",
      "milkType": "cow",
      "intensity": 8,
      "imageUrl": "https://example.com/cheddar.jpg",
      "matchScore": 85,
      "matchReasons": [
        "Matches your intensity preference (7/10)",
        "Has your preferred crumbly texture",
        "Made from cow milk"
      ]
    }
  ]
}
```

### Get Responses for Questionnaire
```http
GET /responses/:questionnaireId
Authorization: Bearer <token>
```

### Get Single Response
```http
GET /responses/response/:id
Authorization: Bearer <token>
```

## Webhooks

### Create Webhook
```http
POST /webhooks
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://your-domain.com/webhook",
  "eventType": "response.created"
}
```

Event types:
- `response.created` - Triggered when a customer submits a questionnaire
- `questionnaire.completed` - Triggered when a questionnaire is filled out
- `recommendation.generated` - Triggered when recommendations are generated

### Get All Webhooks
```http
GET /webhooks
Authorization: Bearer <token>
```

### Update Webhook
```http
PUT /webhooks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "isActive": false
}
```

### Delete Webhook
```http
DELETE /webhooks/:id
Authorization: Bearer <token>
```

## WebSocket Real-Time Events

Connect to WebSocket server:
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

// Join company room to receive company-specific events
socket.emit('join-company', companyId);

// Join questionnaire room to receive questionnaire-specific events
socket.emit('join-questionnaire', questionnaireId);

// Listen for events
socket.on('response-submitted', (data) => {
  console.log('New response:', data);
});

socket.on('recommendation-generated', (data) => {
  console.log('New recommendation:', data);
});
```

## Error Responses

All endpoints return errors in the following format:
```json
{
  "error": "Error message describing what went wrong"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (invalid credentials)
- `404` - Not Found
- `500` - Internal Server Error
