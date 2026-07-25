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

## Core Endpoints

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

### Users

#### GET /users/:id
Get user details.

#### PUT /users/:id
Update user profile.

#### PUT /users/:id/balance
Update user balance (admin only).

### Tasks

#### GET /tasks
Get all available tasks.

#### POST /tasks
Create new task (admin only).

#### POST /tasks/:id/complete
Mark task as completed by user.

### Withdrawals

#### GET /withdrawals
Get user's withdrawal history.

#### POST /withdrawals
Request withdrawal.

#### POST /withdrawals/:id/approve
Approve withdrawal (admin only).

#### POST /withdrawals/:id/reject
Reject withdrawal (admin only).

### Referrals

#### GET /referrals
Get user's referrals.

#### POST /referrals/validate
Validate referral code when user joins.

### Notices

#### GET /notices
Get active notices.

#### POST /notices
Create notice (admin only).

### Settings

#### GET /settings
Get application settings.

#### PUT /settings
Update settings (admin only).

### Stats

#### GET /stats
Get application statistics (admin only).

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

### 404 Not Found
```json
{
    "success": false,
    "error": "NOT_FOUND",
    "message": "Resource not found"
}
```

## Rate Limiting

- API Rate Limit: 100 requests per minute
- Auth Rate Limit: 10 requests per minute
- Withdrawal Rate Limit: 5 requests per minute

---

**API Version**: 1.0  
**Last Updated**: 2026-07-25