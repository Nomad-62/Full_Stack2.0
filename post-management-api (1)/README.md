# Post Management REST API

## Requirements
- JDK 17+
- Maven
- Postman

## Run
Open a terminal in this folder and run:

mvn spring-boot:run

If Maven is not installed, open the project in IntelliJ/Eclipse/VS Code and run PostManagementApplication.java.

Server:
http://localhost:8080

## APIs

GET    /api/posts
GET    /api/posts/{id}
POST   /api/posts
PUT    /api/posts/{id}
DELETE /api/posts/{id}

## POST/PUT JSON

{
  "title": "My First Post",
  "content": "This is my first post content.",
  "author": "Suryansh"
}

## Expected standardized response

{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "id": 1,
    "title": "My First Post",
    "content": "This is my first post content.",
    "author": "Suryansh"
  }
}

## Validation test

Send:

{
  "title": "",
  "content": "",
  "author": ""
}

The API returns HTTP 400 with validation messages.

## H2 Console

http://localhost:8080/h2-console

JDBC URL:
jdbc:h2:mem:postdb

User:
sa

Password:
leave blank
