# TakaEarn API Documentation

This document describes the REST API endpoints for TakaEarn backend.

## Base URL

```
https://api.takaearn.com/v1
```

## Authentication

All requests require Telegram user verification. Include the telegram init data:

```bash
Authorization: Bearer <telegram_init_data>
```

## Response Format

All responses are in JSON format:

```json
{
    "success": true,
    "data": {},
    "message": "Success",
    "timestamp": "2026-07-25T12:00:00Z"
}
```

## Endpoints

### Authentication

#### POST /auth/login
Verify Telegram user and create session.

**Request:**
```bash
curl -X POST https://api.takaearn.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "initData": "<telegram_init_data>"
  }'
```

**Response:**
```json
{
    "success": true,
    "data": {
        "user": { ... },
        "token": "<jwt_token>"
    }
}
```

### Users

#### GET /users/:id
Get user details.

**Response:**
```json
{
    "success": true,
    "data": {
        "id": 123456,
        "firstName": "John",
        "lastName": "Doe",
        "username": "johndoe",
        "balance": 150.50,
        "taskBalance": 100.00,
        "referralBalance": 50.50,
        "tasksCompleted": 10,
        "activeReferrals": 5,
        "totalWithdrawn": 200.00,
        "referralCode": "TAK123ABC456",
        "joinedDate": "2026-07-01T00:00:00Z"
    }
}
```

#### PUT /users/:id
Update user profile.

**Request:**
```json
{
    "firstName": "John",
    "lastName": "Doe"
}
```

#### PUT /users/:id/balance
Update user balance (admin only).

**Request:**
```json
{
    "amount": 100.00,
    "reason": "Manual adjustment"
}
```

### Tasks

#### GET /tasks
Get all available tasks.

**Query Parameters:**
- `status`: available, completed, inactive
- `type`: follow, join, subscribe, like
- `limit`: 10
- `offset`: 0

**Response:**
```json
{
    "success": true,
    "data": {
        "tasks": [
            {
                "id": 1,
                "title": "Follow Instagram",
                "description": "Follow @takaearn on Instagram",
                "reward": 10,
                "type": "follow",
                "url": "https://instagram.com/takaearn",
                "status": "available",
                "completedCount": 45
            }
        ],
        "total": 100
    }
}
```

#### POST /tasks
Create new task (admin only).

**Request:**
```json
{
    "title": "Follow Instagram",
    "description": "Follow @takaearn on Instagram",
    "reward": 10,
    "type": "follow",
    "url": "https://instagram.com/takaearn",
    "status": "available"
}
```

#### PUT /tasks/:id
Update task (admin only).

#### DELETE /tasks/:id
Delete task (admin only).

#### POST /tasks/:id/complete
Mark task as completed by user.

**Response:**
```json
{
    "success": true,
    "data": {
        "message": "Task completed",
        "earnedAmount": 10
    }
}
```

### Withdrawals

#### GET /withdrawals
Get user's withdrawal history.

**Query Parameters:**
- `status`: pending, approved, rejected
- `limit`: 10
- `offset`: 0

**Response:**
```json
{
    "success": true,
    "data": {
        "withdrawals": [
            {
                "id": 1,
                "amount": 200.00,
                "method": "bkash",
                "phone": "01712345678",
                "status": "pending",
                "requestDate": "2026-07-25T10:00:00Z",
                "approvalDate": null
            }
        ],
        "total": 5
    }
}
```

#### POST /withdrawals
Request withdrawal.

**Request:**
```json
{
    "amount": 200.00,
    "method": "bkash",
    "phone": "01712345678"
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "withdrawalId": 1,
        "status": "pending",
        "message": "Withdrawal request submitted"
    }
}
```

#### GET /withdrawals/admin
Get all withdrawals (admin only).

#### POST /withdrawals/:id/approve
Approve withdrawal (admin only).

**Response:**
```json
{
    "success": true,
    "data": {
        "message": "Withdrawal approved"
    }
}
```

#### POST /withdrawals/:id/reject
Reject withdrawal (admin only).

**Request:**
```json
{
    "reason": "Insufficient verification"
}
```

### Referrals

#### GET /referrals
Get user's referrals.

**Response:**
```json
{
    "success": true,
    "data": {
        "referrals": [
            {
                "id": 1,
                "referrerCode": "TAK123ABC456",
                "refereeName": "Jane Doe",
                "status": "active",
                "joinedDate": "2026-07-20T00:00:00Z",
                "earned": 20.00
            }
        ],
        "stats": {
            "total": 5,
            "active": 3,
            "pending": 2,
            "totalEarned": 60.00
        }
    }
}
```

#### POST /referrals/validate
Validate referral code when user joins.

**Request:**
```json
{
    "referralCode": "TAK123ABC456"
}
```

### Notices

#### GET /notices
Get active notices.

**Response:**
```json
{
    "success": true,
    "data": {
        "notices": [
            {
                "id": 1,
                "title": "System Maintenance",
                "message": "System will be under maintenance on Friday",
                "type": "warning",
                "status": "active",
                "createdAt": "2026-07-25T00:00:00Z"
            }
        ]
    }
}
```

#### POST /notices
Create notice (admin only).

**Request:**
```json
{
    "title": "System Maintenance",
    "message": "System will be under maintenance",
    "type": "warning",
    "status": "active"
}
```

### Banners

#### GET /banners
Get active banners.

**Response:**
```json
{
    "success": true,
    "data": {
        "banners": [
            {
                "id": 1,
                "title": "New Year Promo",
                "imageUrl": "https://...",
                "link": "https://...",
                "status": "active"
            }
        ]
    }
}
```

#### POST /banners
Create banner (admin only).

**Request:**
```json
{
    "title": "New Year Promo",
    "imageUrl": "https://...",
    "link": "https://...",
    "status": "active"
}
```

### Settings

#### GET /settings
Get application settings.

**Response:**
```json
{
    "success": true,
    "data": {
        "taskReward": 10,
        "referralReward": 20,
        "minWithdrawal": 200,
        "requiredReferrals": 5,
        "appStatus": "active"
    }
}
```

#### PUT /settings
Update settings (admin only).

**Request:**
```json
{
    "taskReward": 15,
    "referralReward": 25,
    "minWithdrawal": 300
}
```

### Stats

#### GET /stats
Get application statistics (admin only).

**Response:**
```json
{
    "success": true,
    "data": {
        "totalUsers": 1000,
        "totalBalance": 50000.00,
        "totalWithdrawn": 30000.00,
        "pendingWithdrawals": 5,
        "totalTasks": 50,
        "completedTasks": 2500,
        "totalReferrals": 500,
        "activeReferrals": 300
    }
}
```

## Error Responses

### 400 Bad Request
```json
{
    "success": false,
    "error": "INVALID_REQUEST",
    "message": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
    "success": false,
    "error": "UNAUTHORIZED",
    "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
    "success": false,
    "error": "FORBIDDEN",
    "message": "You don't have permission for this action"
}
```

### 404 Not Found
```json
{
    "success": false,
    "error": "NOT_FOUND",
    "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
    "success": false,
    "error": "INTERNAL_ERROR",
    "message": "Internal server error"
}
```

## Rate Limiting

- API Rate Limit: 100 requests per minute
- Auth Rate Limit: 10 requests per minute
- Withdrawal Rate Limit: 5 requests per minute

## Pagination

For list endpoints, use:
- `limit`: Items per page (default: 10, max: 100)
- `offset`: Starting position (default: 0)

## Sorting

For sortable fields:
- `sort`: Field name
- `order`: asc or desc

## Filtering

Use query parameters for filtering:
```bash
/tasks?status=available&type=follow&limit=20&offset=0
```

## WebSocket Events (Real-time)

### Connect
```javascript
const ws = new WebSocket('wss://api.takaearn.com/ws');
ws.send(JSON.stringify({type: 'auth', token: '<token>'}));
```

### Events
- `notification`: New notification
- `balance_update`: Balance changed
- `withdrawal_status`: Withdrawal status changed
- `task_completed`: Task completed

## Testing

Use these tools for API testing:
- Postman
- curl
- Insomnia
- Thunder Client

---

**API Version**: 1.0
**Last Updated**: 2026-07-25