# Nursery Management System - Backend API Documentation

Welcome to the **Nursery Management System RESTful API**.
This backend is built with **Node.js, Express.js, PostgreSQL, and Prisma ORM**, secured via **JWT** and **bcrypt**.

Base URL: `http://localhost:5000/api`

---

## 1. System Health
### `GET /health`
- **Access:** Public
- **Description:** Verifies that the server is online and healthy.
- **Response:** `200 OK`
```json
{ "status": "ok" }
```

---

## 2. Authentication & Public Registration
### `POST /auth/register`
- **Access:** Public (Parents / Users)
- **Body:**
```json
{
  "name": "Sarah Connor",
  "email": "sarah@example.com",
  "password": "password123"
}
```
- **Response:** `201 Created`
```json
{
  "token": "eyJhbGciOi...",
  "user": {
    "id": "uuid",
    "name": "Sarah Connor",
    "email": "sarah@example.com",
    "role": "PARENT",
    "isActive": true,
    "createdAt": "2026-10-12T..."
  }
}
```

### `POST /auth/login`
- **Access:** Public
- **Body:**
```json
{
  "email": "admin@school.com",
  "password": "admin123"
}
```
- **Response:** `200 OK` (Returns JWT token and user info)

---

## 3. Nursery Programs & Features (Public / Admin)
### `GET /programs`
- **Access:** Public (Anyone can explore nursery activities & programs)
- **Response:** `200 OK` (Array of programs)

### `GET /programs/:id`
- **Access:** Public

### `POST /programs`
- **Access:** Admin only (`Bearer <TOKEN>`)
- **Body:**
```json
{
  "title": "Creative Sensory Play",
  "description": "Sensory exploration, finger painting, and music.",
  "ageGroup": "1 - 3 Years",
  "schedule": "Mon - Thu, 9:00 AM - 11:30 AM"
}
```

### `PUT /programs/:id`
- **Access:** Admin only (`Bearer <TOKEN>`)

### `DELETE /programs/:id`
- **Access:** Admin only (`Bearer <TOKEN>`)

---

## 4. Announcements & Board Updates (Public / Admin)
### `GET /announcements`
- **Access:** Public / Parents

### `POST /announcements`
- **Access:** Admin only (`Bearer <TOKEN>`)
- **Body:**
```json
{
  "title": "Spring Festival Next Week",
  "content": "Join us on Sunday for fun games and costumes!",
  "category": "EVENT"
}
```

### `DELETE /announcements/:id`
- **Access:** Admin only (`Bearer <TOKEN>`)

---

## 5. Admin - User Management
*Requires `Authorization: Bearer <ADMIN_TOKEN>`*

### `GET /admin/users`
- **Query params:** `?role=TEACHER` or `?role=PARENT` (optional)
- **Description:** Returns all teachers and parents (automatically hides the Admin).

### `POST /admin/users`
- **Body:**
```json
{
  "name": "Jane Teacher",
  "email": "jane@nursery.com",
  "password": "password123",
  "role": "TEACHER"
}
```

### `PUT /admin/users/:id`
- **Body:** `{ "name": "Jane New", "role": "TEACHER" }`

### `PATCH /admin/users/:id/status`
- **Description:** Toggles active/inactive status with protection against self-deactivation.

### `DELETE /admin/users/:id`
- **Access:** Admin only (`Bearer <ADMIN_TOKEN>`)
- **Description:** Permanently deletes a user account (Teacher or Parent) along with their related records. Protected against self-deleting the admin account.
- **Response:** `204 No Content`

---

## 6. Admin - Child Management
*Requires `Authorization: Bearer <ADMIN_TOKEN>`*

### `GET /admin/children`
- Returns all enrolled children with their linked parent information.

### `GET /admin/children/:id`
- Returns a single child by ID.

### `POST /admin/children`
- **Body:**
```json
{
  "firstName": "Leo",
  "lastName": "Miller",
  "dateOfBirth": "2023-05-14",
  "gender": "Male",
  "parentId": "USER_UUID"
}
```

### `PUT /admin/children/:id`
- Updates child details or reassigns parent.

### `DELETE /admin/children/:id`
- Deletes child record with cascading dependencies.

---

## 7. Attendance Tracking
*Requires `Authorization: Bearer <TOKEN>`*

### `POST /attendance`
- **Access:** Teacher or Admin
- **Description:** Record single or batch daily attendance.
- **Body (Batch):**
```json
{
  "records": [
    { "childId": "CHILD_UUID_1", "status": "PRESENT", "notes": "Active and playful" },
    { "childId": "CHILD_UUID_2", "status": "ABSENT", "notes": "Sick note submitted" }
  ]
}
```

### `GET /attendance?date=YYYY-MM-DD`
- **Access:** Teacher or Admin
- **Description:** View roll call by date or child.

### `GET /attendance/my-children`
- **Access:** Parent only
- **Description:** View attendance history for the logged-in parent's kids.

---

## 8. Parent Portal APIs
*Requires `Authorization: Bearer <PARENT_TOKEN>`*

### `GET /parent/children`
- Returns only the children belonging to the authenticated parent.

### `GET /parent/profile`
- Returns the parent's profile details and count of enrolled children.

---

## 9. Teacher Classroom APIs
*Requires `Authorization: Bearer <TEACHER_TOKEN>`*

### `GET /teacher/children`
- Returns classroom children with parent contact information.
