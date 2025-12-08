# Lost & Found System - Postman Testing Guide

## Base URL
`http://localhost:5000`

---

## STEP 1: Admin Login
**Endpoint:** `POST /auth/login`
**Auth:** None

**Body:**
```json
{
  "studentId": "ADMIN2025",
  "password": "Admin@1234"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "admin-uuid",
    "studentId": "ADMIN2025",
    "name": "SAO Admin",
    "isAdmin": true,
    "createdAt": "2025-12-08T..."
  },
  "token": "eyJhbGc..."
}
```

**👉 SAVE THIS TOKEN AS: `{{admin_token}}`**

---

## STEP 2: Create Regular User A (Signup)
**Endpoint:** `POST /auth/signup`
**Auth:** None

**Body:**
```json
{
  "name": "John Doe",
  "studentId": "2025001",
  "password": "User@1234"
}
```

**Response:**
```json
{
  "message": "Student registered successfully. Please login to continue.",
  "user": {
    "id": "user-a-uuid",
    "studentId": "2025001",
    "name": "John Doe",
    "createdAt": "2025-12-08T..."
  }
}
```

**👉 NOW LOGIN with User A to get the token in STEP 3A**

---

## STEP 3: Create Regular User B (Signup)
**Endpoint:** `POST /auth/signup`
**Auth:** None

**Body:**
```json
{
  "name": "Jane Smith",
  "studentId": "2025002",
  "password": "User@5678"
}
```

**👉 NOW LOGIN with User B to get the token in STEP 3B**

---

## STEP 3A: User A Login
**Endpoint:** `POST /auth/login`
**Auth:** None

**Body:**
```json
{
  "studentId": "2025001",
  "password": "User@1234"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user-a-uuid",
    "studentId": "2025001",
    "name": "John Doe",
    "isAdmin": false,
    "createdAt": "2025-12-08T..."
  },
  "token": "eyJhbGc..."
}
```

**👉 SAVE THIS TOKEN AS: `{{user_a_token}}`**

---

## STEP 3B: User B Login
**Endpoint:** `POST /auth/login`
**Auth:** None

**Body:**
```json
{
  "studentId": "2025002",
  "password": "User@5678"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user-b-uuid",
    "studentId": "2025002",
    "name": "Jane Smith",
    "isAdmin": false,
    "createdAt": "2025-12-08T..."
  },
  "token": "eyJhbGc..."
}
```

**👉 SAVE THIS TOKEN AS: `{{user_b_token}}`**

---

## ⚠️ IMPORTANT: How to Use Bearer Tokens in Postman

When you see **`Auth: Bearer {{user_a_token}}`**, it means you need to add an Authorization header.

### Method 1: Using the Auth Tab (Easiest)
1. Open your request in Postman
2. Go to the **Auth** tab
3. Select **Bearer Token** from the dropdown
4. Paste your token in the **Token** field
5. Send the request

### Method 2: Using Headers Tab
1. Go to the **Headers** tab
2. Add a new header:
   - **Key:** `Authorization`
   - **Value:** `Bearer <your-token-here>`
3. Send the request

### Example:
If you got this token from Step 1:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJpYXQiOjE2NzUwMDAwMDB9.xxxxx
```

Then in Postman, add this header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJpYXQiOjE2NzUwMDAwMDB9.xxxxx
```

---

## STEP 4: User A Posts a Lost Item (Requires Authentication)
**Endpoint:** `POST /lost-items`
**Auth:** Bearer `{{user_a_token}}`

**Headers:**
```
Authorization: Bearer <your-token-from-step-3a>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Blue Wallet",
  "description": "Lost wallet with blue leather, has initials JDK inside",
  "category": "Accessories",
  "location": "Campus Library - 3rd Floor"
}
```

**Response:**
```json
{
  "message": "Lost item posted successfully",
  "item": {
    "id": "lost-item-uuid-1",
    "title": "Blue Wallet",
    "description": "Lost wallet with blue leather, has initials JDK inside",
    "category": "Accessories",
    "location": "Campus Library - 3rd Floor",
    "status": "active",
    "postedBy": "user-a-uuid",
    "createdAt": "2025-12-08T...",
    "updatedAt": "2025-12-08T..."
  }
}
```

---

## STEP 5: User B Posts Another Lost Item
**Endpoint:** `POST /lost-items`
**Auth:** Bearer `{{user_b_token}}`

**Body:**
```json
{
  "title": "Silver Earbuds",
  "description": "Lost wireless earbuds in silver color with noise cancellation",
  "category": "Electronics",
  "location": "Student Center"
}
```

---

## STEP 6: Public - Browse All Lost Items
**Endpoint:** `GET /lost-items`
**Auth:** None

**Response:** Lists all lost items posted by users
```json
{
  "message": "Lost items retrieved",
  "items": [
    {
      "id": "lost-item-uuid-1",
      "title": "Blue Wallet",
      ...
      "user": {
        "id": "user-a-uuid",
        "name": "John Doe",
        "studentId": "2025001"
      }
    },
    {
      "id": "lost-item-uuid-2",
      "title": "Silver Earbuds",
      ...
      "user": {
        "id": "user-b-uuid",
        "name": "Jane Smith",
        "studentId": "2025002"
      }
    }
  ]
}
```

---

## STEP 7: Admin Posts Found Item (Wallet)
**Endpoint:** `POST /found-items`
**Auth:** Bearer `{{admin_token}}`

**Body:**
```json
{
  "title": "Blue Wallet",
  "description": "Found at the student center on December 8, contains ID and cash. Has initials JDK.",
  "category": "Accessories",
  "location": "SAO Office - Front Desk"
}
```

**Response:**
```json
{
  "message": "Found item posted successfully",
  "item": {
    "id": "found-item-uuid-1",
    "title": "Blue Wallet",
    "description": "Found at the student center on December 8, contains ID and cash. Has initials JDK.",
    "category": "Accessories",
    "location": "SAO Office - Front Desk",
    "postedBy": "admin-uuid",
    "createdAt": "2025-12-08T...",
    "updatedAt": "2025-12-08T..."
  }
}
```

**👉 SAVE THIS ID AS: `{{found_item_id_1}}`**

---

## STEP 8: Admin Posts Found Item (Earbuds)
**Endpoint:** `POST /found-items`
**Auth:** Bearer `{{admin_token}}`

**Body:**
```json
{
  "title": "Silver Earbuds",
  "description": "Found in the student center lost and found box. Wireless earbuds with good condition.",
  "category": "Electronics",
  "location": "SAO Office - Storage"
}
```

**👉 SAVE THIS ID AS: `{{found_item_id_2}}`**

---

## STEP 9: Public - Browse All Found Items
**Endpoint:** `GET /found-items`
**Auth:** None

**Response:** Lists all found items posted by admin
```json
{
  "message": "Found items retrieved",
  "items": [
    {
      "id": "found-item-uuid-1",
      "title": "Blue Wallet",
      ...
      "user": {
        "id": "admin-uuid",
        "name": "SAO Admin",
        "studentId": "ADMIN2025"
      }
    },
    {
      "id": "found-item-uuid-2",
      "title": "Silver Earbuds",
      ...
    }
  ]
}
```

---

## STEP 10: User A Messages Admin About Found Wallet
**Endpoint:** `POST /chat/conversation`
**Auth:** Bearer `{{user_a_token}}`

**Body:**
```json
{
  "foundItemId": "{{found_item_id_1}}",
  "subject": "This might be my wallet that I lost"
}
```

**Response:**
```json
{
  "message": "Conversation started",
  "conversation": {
    "id": "conversation-uuid-1",
    "userId": "user-a-uuid",
    "foundItemId": "found-item-uuid-1",
    "subject": "This might be my wallet that I lost",
    "status": "open",
    "messages": [],
    "user": {
      "id": "user-a-uuid",
      "name": "John Doe",
      "studentId": "2025001"
    },
    "createdAt": "2025-12-08T...",
    "updatedAt": "2025-12-08T..."
  }
}
```

**👉 SAVE THIS ID AS: `{{conversation_id_1}}`**

---

## STEP 11: User B Messages Admin About Found Earbuds
**Endpoint:** `POST /chat/conversation`
**Auth:** Bearer `{{user_b_token}}`

**Body:**
```json
{
  "foundItemId": "{{found_item_id_2}}",
  "subject": "I think these are my earbuds"
}
```

**👉 SAVE THIS ID AS: `{{conversation_id_2}}`**

---

## STEP 12: User A Sends Message to Admin
**Endpoint:** `POST /chat/message`
**Auth:** Bearer `{{user_a_token}}`

**Body:**
```json
{
  "conversationId": "{{conversation_id_1}}",
  "content": "Hi admin, is the blue wallet you found the one with initials JDK? I lost my wallet last week."
}
```

**Response:**
```json
{
  "message": "Message sent",
  "data": {
    "id": "message-uuid-1",
    "conversationId": "conversation-uuid-1",
    "senderId": "user-a-uuid",
    "content": "Hi admin, is the blue wallet you found the one with initials JDK? I lost my wallet last week.",
    "createdAt": "2025-12-08T...",
    "sender": {
      "id": "user-a-uuid",
      "name": "John Doe"
    }
  }
}
```

---

## STEP 13: User B Sends Message to Admin
**Endpoint:** `POST /chat/message`
**Auth:** Bearer `{{user_b_token}}`

**Body:**
```json
{
  "conversationId": "{{conversation_id_2}}",
  "content": "I lost my silver earbuds last week at the student center. Can you confirm if it's mine?"
}
```

---

## STEP 14: Admin Views All Conversations
**Endpoint:** `GET /chat/admin/conversations`
**Auth:** Bearer `{{admin_token}}`

**Response:**
```json
{
  "message": "All conversations retrieved",
  "conversations": [
    {
      "id": "conversation-uuid-1",
      "userId": "user-a-uuid",
      "foundItemId": "found-item-uuid-1",
      "subject": "This might be my wallet that I lost",
      "status": "open",
      "messages": [
        {
          "id": "message-uuid-1",
          "conversationId": "conversation-uuid-1",
          "senderId": "user-a-uuid",
          "content": "Hi admin, is the blue wallet you found the one with initials JDK?...",
          "createdAt": "2025-12-08T...",
          "sender": {
            "id": "user-a-uuid",
            "name": "John Doe"
          }
        }
      ],
      "user": {
        "id": "user-a-uuid",
        "name": "John Doe",
        "studentId": "2025001"
      },
      "createdAt": "2025-12-08T...",
      "updatedAt": "2025-12-08T..."
    },
    {
      "id": "conversation-uuid-2",
      "userId": "user-b-uuid",
      "foundItemId": "found-item-uuid-2",
      "subject": "I think these are my earbuds",
      "status": "open",
      "messages": [...]
    }
  ]
}
```

---

## STEP 15: Admin Replies to User A
**Endpoint:** `POST /chat/message`
**Auth:** Bearer `{{admin_token}}`

**Body:**
```json
{
  "conversationId": "{{conversation_id_1}}",
  "content": "Yes! The wallet matches your description perfectly. Come to the SAO office tomorrow during office hours (9 AM - 5 PM) to claim it. Please bring your ID."
}
```

---

## STEP 16: Admin Replies to User B
**Endpoint:** `POST /chat/message`
**Auth:** Bearer `{{admin_token}}`

**Body:**
```json
{
  "conversationId": "{{conversation_id_2}}",
  "content": "Yes, these earbuds are in our lost and found. They're in great condition. You can pick them up at the SAO office. Bring your student ID for verification."
}
```

---

## STEP 17: View Conversation History (User A)
**Endpoint:** `GET /chat/messages/{{conversation_id_1}}`
**Auth:** None

**Response:**
```json
{
  "message": "Messages retrieved",
  "messages": [
    {
      "id": "message-uuid-1",
      "conversationId": "conversation-uuid-1",
      "senderId": "user-a-uuid",
      "content": "Hi admin, is the blue wallet you found the one with initials JDK?...",
      "createdAt": "2025-12-08T...",
      "sender": {
        "id": "user-a-uuid",
        "name": "John Doe"
      }
    },
    {
      "id": "message-uuid-2",
      "conversationId": "conversation-uuid-1",
      "senderId": "admin-uuid",
      "content": "Yes! The wallet matches your description perfectly...",
      "createdAt": "2025-12-08T...",
      "sender": {
        "id": "admin-uuid",
        "name": "SAO Admin"
      }
    }
  ]
}
```

---

## STEP 18: User A Views Their Conversations
**Endpoint:** `GET /chat/user-conversations`
**Auth:** Bearer `{{user_a_token}}`

**Response:**
```json
{
  "message": "User conversations retrieved",
  "conversations": [
    {
      "id": "conversation-uuid-1",
      "userId": "user-a-uuid",
      "foundItemId": "found-item-uuid-1",
      "subject": "This might be my wallet that I lost",
      "status": "open",
      "messages": [
        {
          "id": "message-uuid-2",
          "conversationId": "conversation-uuid-1",
          "senderId": "admin-uuid",
          "content": "Yes! The wallet matches your description perfectly...",
          "createdAt": "2025-12-08T...",
          "sender": {
            "id": "admin-uuid",
            "name": "SAO Admin"
          }
        }
      ],
      "user": {
        "id": "user-a-uuid",
        "name": "John Doe",
        "studentId": "2025001"
      },
      "createdAt": "2025-12-08T...",
      "updatedAt": "2025-12-08T..."
    }
  ]
}
```

---

## STEP 19: Admin Updates Found Item Status (Optional)
**Endpoint:** `PATCH /found-items/{{found_item_id_1}}`
**Auth:** Bearer `{{admin_token}}`

**Body:**
```json
{
  "title": "Blue Wallet - CLAIMED",
  "description": "Found at the student center on December 8, contains ID and cash. Has initials JDK. Status: Claimed by John Doe"
}
```

---

## STEP 20: Admin Closes Conversation (Optional)
**Endpoint:** `PATCH /chat/conversation/close`
**Auth:** Bearer `{{admin_token}}`

**Body:**
```json
{
  "conversationId": "{{conversation_id_1}}"
}
```

**Response:**
```json
{
  "message": "Conversation closed",
  "conversation": {
    "id": "conversation-uuid-1",
    "userId": "user-a-uuid",
    "foundItemId": "found-item-uuid-1",
    "subject": "This might be my wallet that I lost",
    "status": "resolved",
    "messages": [...],
    "user": {...},
    "createdAt": "2025-12-08T...",
    "updatedAt": "2025-12-08T..."
  }
}
```

---

## Summary of Variables to Save
```
{{admin_token}} = Token from Step 1
{{user_a_token}} = Token from Step 2
{{user_b_token}} = Token from Step 3
{{found_item_id_1}} = Found item ID from Step 7
{{found_item_id_2}} = Found item ID from Step 8
{{conversation_id_1}} = Conversation ID from Step 10
{{conversation_id_2}} = Conversation ID from Step 11
```

---

## Key Points
✅ Users post **lost items** (what they lost)
✅ Admin posts **found items** (what was returned to SAO)
✅ Users browse found items and message admin
✅ Admin views all conversations from users
✅ Real-time back-and-forth messaging
✅ Conversations can be closed when item is claimed

---

## Troubleshooting

### ❌ Error: "Foreign key constraint violated"
**Cause:** You didn't send the Bearer token in the Authorization header
**Solution:** 
- Make sure you're sending the token in the Authorization header
- Token format: `Authorization: Bearer <your-token>`
- Copy the full token from the login response

### ❌ Error: "Invalid token" or "No token provided"
**Cause:** Token is missing, expired, or malformed
**Solution:**
1. Get a fresh token by logging in again (Step 1 or Step 3A/3B)
2. Make sure token is copied correctly (no extra spaces)
3. Check Authorization header format: `Bearer <token>` (with space between)

### ❌ Error: "Unauthorized" on POST requests
**Cause:** Trying to post without authentication
**Solution:**
- Add the Authorization header with your token
- Only GET requests for browsing items work without auth
- POST/PATCH/DELETE requests require authentication

### ✅ How to Test Properly:
1. **Login first** → Get token from response
2. **Copy token** → Use it in Authorization header for next request
3. **Add Authorization header** → Format: `Bearer <token>`
4. **Send request** → Should work now
