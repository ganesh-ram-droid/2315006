# Notification System Design
Objective:
    To Design REST API NOtification Paltfrom ,so that an user can recieive ,view and manage notification

1. Development:
    base URl:http://localhost:3000/api
   
2.Authentication
 Authorization - `Bearer JWT_TOKEN` Accept - application/json 
 3. Notification Body
 {
    "id":"d146095a-0d86-4a34-9e69-3900a14576bc",
    "type":"Placement",
    "title":"Placement Drive",
    "message":"CSX Corporation is hiring.",
    "priority":"High",
    "isRead":false,
    "createdAt":"2026-04-22T17:51:18Z",
    "updatedAt":"2026-04-22T17:51:18Z"
}

4. API -GET All notifications
End Point -GET /api/notifications

Query Parameters:-
Paramenter -Page(Integer),limit(Integer),type(String),read(Boolean)
    request:
    Example request -GET /api/notifications?page=1&limit=10&type=Placement
    Response:
    Status Code


    200 OK


    json fromat 
    {
    "page":1,
    "limit":10,
    "totalNotifications":125,
    "notifications":[
        {
            "id":"123",
            "type":"Placement",
            "title":"Placement Drive",
            "message":"Amazon Hiring",
            "priority":"High",
            "isRead":false,
            "createdAt":"2026-04-22T17:51:18Z"
        }
    ]
    }
    Error Response

    json
    {
    "message":"Unauthorized"
    }

5. API 2 - Get Notification By ID

    Returns complete information of one notification.


    endpoint :GET /api/notifications/{id}


    Example request


    GET /api/notifications/123
 Response

    json
    {
        "id":"123",
        "type":"Placement",
        "title":"Placement Drive",
        "message":"Amazon Hiring",
        "priority":"High",
        "isRead":false,
        "createdAt":"2026-04-22T17:51:18Z"
    }


6. API 3 - Get Priority Notifications

Returns highest priority notifications.


endpoint :GET /api/notifications/priority


Query Parameter:limit=10


Example

GET /api/notifications/priority?limit=10

 Response:

json
    {
    "notifications":[
        {
            "id":"123",
            "type":"Placement",
            "priority":"High",
            "message":"Microsoft Hiring"
        },
        {
            "id":"124",
            "type":"Result",
            "priority":"Medium",
            "message":"Semester Results Published"
        }
    ]
    }



7. API 4 - Mark Notification as Read

Marks a notification as read.

Endpoint:PATCH /api/notifications/{id}/read

Example:
PATCH /api/notifications/123/read


 Response:

json fromant
{
    "message":"Notification marked as read successfully."
}




8. API 5 - Mark All Notifications as Read

Marks every unread notification as read.

Endpoint:-PATCH /api/notifications/read-all


Response

json
{
    "message":"All notifications marked as read."
}


9. API 6 - Delete Notification

Deletes one notification.

Endpoint:-DELETE /api/notifications/{id}

Example


DELETE /api/notifications/123

 Response

json
{
    "message":"Notification deleted successfully."
}

10. API 7 - Get Unread Notification Count

Returns total unread notifications.

Endpoint:-GET /api/notifications/unread-count
Response:
json
{
    "unreadCount":15
}

Notification Types


| 1.Placement 
 2.Result 
3.Event 



Priority Levels are

1.Notification Type -Placement,Result, Event 
2.Priority -High, Medium , Low 




json
{
    "success":false,
    "message":"Notification not found"
}



 Real-Time Notification Design

To provide instant notification updates without refreshing the application, the system uses **WebSockets**.

 Workflow
        Notification API-----> New Notification----->WebSocket Server------>goes to users

Steps

1. User logs into the application.
2. Client establishes a WebSocket connection.
3. Server authenticates the connection using the access token.
4. Whenever a new notification is created, the server immediately pushes it to connected users.
5. The frontend updates:
   - Notification list
   - Unread badge
   - Priority notifications
   without requiring a page refresh.



Why we use WebSockets? is

1.Real-time communication
2.Very low latency
3. Better user experience
4. Scalable 



REST API Design Principles

1.Plural resource names
2. Appropriate HTTP methods
3.JSON request/response format
4.Proper HTTP status codes
5.Pagination support
6.Filtering support
7.Secure authenticated endpoints



Stage 2 - Database Design

Objective:
To design a database that stores users and notifications efficiently. The database should support fast retrieval of notifications, unread counts, filtering, and should be scalable for a large number of users.



1. Database Used

Database : PostgreSQL

Reason for Choosing PostgreSQL

1. Supports ACID properties.
2. Fast query execution.
3. Easy to create indexes.
4. Good support for joins and relationships.
5. Suitable for large-scale applications.
6. Reliable and secure.



2. Database Tables

Table 1 : Users

Stores user information.
sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


Fields

- id
- name
- email
- created_at



Table 2 : Notifications

Stores notification details.

sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    type VARCHAR(30),
    title VARCHAR(200),
    message TEXT,
    priority VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


Fields

- id
- type
- title
- message
- priority
- created_at


Table 3 : User_Notifications

Stores notification status for every user.


CREATE TABLE user_notifications (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    notification_id UUID REFERENCES notifications(id),
    is_read BOOLEAN DEFAULT FALSE,
    viewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


Fields

- id
- user_id
- notification_id
- is_read
- viewed_at
- created_at



3. Relationship

One User can have many Notifications.

One Notification can be sent to many Users.

Relationship

Users (1) --------< User_Notifications >-------- (1) Notifications

This creates a many-to-many relationship between Users and Notifications.


4. Indexing

To improve query performance, indexes are created.

1.sql
CREATE INDEX idx_user
ON user_notifications(user_id);


2.sql
CREATE INDEX idx_type
ON notifications(type);


3.sql
CREATE INDEX idx_priority
ON notifications(priority);


4.sql
CREATE INDEX idx_read
ON user_notifications(is_read);


Benefits

1. Faster search.
2. Faster filtering.
3. Faster unread count.
4. Better overall performance.



5. SQL Queries

Get all notifications

sql
SELECT *
FROM notifications;




Get notifications of a user

sql
SELECT n.*
FROM notifications n
JOIN user_notifications un
ON n.id = un.notification_id
WHERE un.user_id='USER_ID';




Get unread notifications


SELECT n.*
FROM notifications n
JOIN user_notifications un
ON n.id=un.notification_id
WHERE un.user_id='USER_ID'
AND un.is_read=false;



Unread notification count

sql
SELECT COUNT(*)
FROM user_notifications
WHERE user_id='USER_ID'
AND is_read=false;




Get Placement notifications

sql
SELECT *
FROM notifications
WHERE type='Placement';




Top 10 Priority Notifications

sql
SELECT *
FROM notifications
ORDER BY
CASE
WHEN priority='High' THEN 1
WHEN priority='Medium' THEN 2
ELSE 3
END,
created_at DESC
LIMIT 10;




Mark notification as read

sql
UPDATE user_notifications
SET is_read=true,
viewed_at=CURRENT_TIMESTAMP
WHERE user_id='USER_ID'
AND notification_id='NOTIFICATION_ID';



6. Scalability

To support a large number of users, the following techniques can be used.

1. Create indexes on frequently searched columns.
2. Use paginatio instead of loading all notifications.
3. Cache unread notification count using Redis.
4. Use read replicas to reduce database load.
5. Optimize SQL queries to avoid unnecessary scans.


7. Advantages

    1. fast notification retrieval.
    2. easy to maintain.
    3. efficient unread notification tracking.
4. Supports filtering by type.
5. Supports priority-based notifications.
6. Scalable for millions of notifications.
7. Reduces database load using indexes and caching.


# Stage 3 - SQL Query Optimization

Objective:
To improve the performance of SQL queries used in the notification system by reducing execution time and database load.


1. Existing Query

sql
SELECT *
FROM notifications
WHERE type = 'Placement'
ORDER BY created_at DESC;


Problem

This query works correctly, but it can become slow when the notifications table contains millions of records because the database has to scan many rows before sorting them.



2. Performance Issues

1. Full Table Scan may occur if there is no index.
2. Sorting large amounts of data increases execution time.
3. Selecting all columns using `SELECT *` transfers unnecessary data.
4. Query performance decreases as the number of notifications grows.



3. Query Optimization

Instead of using

sql
SELECT *
FROM notifications
WHERE type='Placement'
ORDER BY created_at DESC;


Use

sql
SELECT id,
       title,
       message,
       priority,
       created_at
FROM notifications
WHERE type='Placement'
ORDER BY created_at DESC;


Reason is that :

1. Retrieves only required columns.
2. Reduces memory usage.
3. Faster execution.




4. Index Optimization

Create an index on the frequently searched columns.

sql
CREATE INDEX idx_notification_type_created
ON notifications(type, created_at DESC);


Benefits

1. Faster filtering.
2. Faster sorting.
3. Reduces full table scans.



5. Query to Fetch Placement Notifications from Last 7 Days

sql
SELECT id,
       title,
       message,
       priority,
       created_at
FROM notifications
WHERE type='Placement'
AND created_at >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY created_at DESC;


This query returns only Placement notifications created within the last seven days.



6. Additional Optimization Techniques

1. Use Pagination

sql
LIMIT 10 OFFSET 0;


Instead of loading all notifications at once.



2. Cache Frequently Accessed Data

Store frequently accessed notifications in Redis to reduce database queries.


3. Archive Old Notifications

Move old notifications to archive tables to keep the main table smaller.



4. Use Read Replicas

Use separate read replicas to handle notification fetching while the primary database handles inserts and updates.


7. Advantages

1. Faster SQL execution.
2. Reduced database load.
3. Improved response time.
4. Better scalability.
5. Efficient handling of large datasets.
6. Reduced memory usage.
7. Better user experience.


 Stage 4 - Performance Optimization

Objective:

To improve the performance of the notification system when the number of users and notifications increases.



Problem Statement

Currently, every time a user opens a page, the application fetches notifications directly from the database.

If thousands of users use the application at the same time, the database receives many requests, making the application slower.


1. Use Pagination

Instead of loading all notifications, load only a few at a time.

Example

sql
SELECT *
FROM notifications
LIMIT 10 OFFSET 0;


Benefits

- Faster page loading.
- Reduces database load.
- Saves memory.


2. Create Database Indexes

Indexes help the database find data more quickly.

Example

sql
CREATE INDEX idx_user
ON user_notifications(user_id);


sql
CREATE INDEX idx_type
ON notifications(type);


Benefits

- Faster searching.
- Faster filtering.
- Better query performance.



3. Use Redis Cache

Some data like unread notification count or top notifications does not change very often.

Instead of querying the database every time, we can store this data in Redis.

Benefits

- Faster response.
- Less work for the database.
- Better performance.


4. Use WebSockets

Instead of asking the server repeatedly for new notifications, the server can send them automatically whenever a new notification is created.

Benefits

- Real-time notifications.
- No need to refresh the page.
- Better user experience.


5. Load Notifications When Needed

Instead of loading hundreds of notifications at once, load more only when the user scrolls down.

Benefits

- Faster initial loading.
- Better memory usage.
- Smooth scrolling experience.


6. Use Read Replicas

If many users are reading notifications, separate databases can be used.

- Primary Database → Stores new notifications.
- Read Replica → Sends notifications to users.

This reduces the load on the main database.

7. Archive Old Notifications

Notifications that are very old can be moved to another table.

This keeps the main notifications table smaller and improves query speed.



Advantages

- Faster application.
- Better user experience.
- Reduced database load.
- Handles more users efficiently.
- Real-time notification updates.
- Better scalability.



# Stage 4 - Performance Optimization

Objective:

To improve the performance of the notification system when the number of users and notifications increases.



Problem Statement

Currently, every time a user opens a page, the application fetches notifications directly from the database.

If thousands of users use the application at the same time, the database receives many requests, making the application slower.


1. Use Pagination

Instead of loading all notifications, load only a few at a time.

Example

sql
SELECT *
FROM notifications
LIMIT 10 OFFSET 0;


Benefits

- Faster page loading.
- Reduces database load.
- Saves memory.



2. Create Database Indexes

Indexes help the database find data more quickly.

Example

sql
CREATE INDEX idx_user
ON user_notifications(user_id);


sql
CREATE INDEX idx_type
ON notifications(type);


Benefits

- Faster searching.
- Faster filtering.
- Better query performance.



3. Use Redis Cache

Some data like unread notification count or top notifications does not change very often.

Instead of querying the database every time, we can store this data in Redis.

Benefits

- Faster response.
- Less work for the database.
- Better performance.



4. Use WebSockets

Instead of asking the server repeatedly for new notifications, the server can send them automatically whenever a new notification is created.

Benefits

- Real-time notifications.
- No need to refresh the page.
- Better user experience.


5. Load Notifications When Needed

Instead of loading hundreds of notifications at once, load more only when the user scrolls down.

Benefits

- Faster initial loading.
- Better memory usage.
- Smooth scrolling experience.



6. Use Read Replicas

If many users are reading notifications, separate databases can be used.

- Primary Database → Stores new notifications.
- Read Replica → Sends notifications to users.

This reduces the load on the main database.



7. Archive Old Notifications

Notifications that are very old can be moved to another table.

This keeps the main notifications table smaller and improves query speed.



Advantages

- Faster application.
- Better user experience.
- Reduced database load.
- Handles more users efficiently.
- Real-time notification updates.
- Better scalability.



# Stage 6 - Top 10 Priority Notifications

Objective:

To display the top 10 most important notifications efficiently without sorting all notifications every time.


Problem Statement

The notification system stores many notifications.

Showing all notifications is not useful because users mainly want to see the most important and latest ones.

So, the system should always display the Top 10 priority notifications.



Priority Order

1. Placement
2. Result
3. Event

If two notifications have the same priority, the latest notification should be displayed first.


Approach

Instead of sorting the entire notification list every time, I would maintain only the top 10 notifications.

Whenever a new notification is added,

- Compare its priority.
- If it belongs to the top 10, insert it.
- Remove the lowest priority notification if the list exceeds 10.

This avoids sorting all notifications repeatedly and improves performance.



Algorithm

1. Assign a priority value.

Placement → 3

Result → 2

Event → 1

2. Sort notifications based on:

- Higher priority first.
- Latest created notification first.

3. Return only the first 10 notifications.



Example

Notifications

Placement - Amazon
Placement - Microsoft
Result - Semester Exam
Event - Workshop
Placement - Zoho


Output


1. Amazon Placement
2. Microsoft Placement
3. Zoho Placement
4. Semester Result
5. Workshop




Data Structure

A Min Heap (Priority Queue) can be used to maintain only the top 10 notifications.

Benefits

- Faster insertion.
- Efficient retrieval.
- Better performance when the number of notifications becomes very large.



Advantages

- Displays the most important notifications first.
- Faster than sorting the complete list every time.
- Handles large datasets efficiently.
- Improves user experience.

