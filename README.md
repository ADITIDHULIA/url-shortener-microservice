# URL Shortener Monolith

A backend URL shortener built using Node.js, Express, MongoDB, Redis and NGINX.

The application provides URL shortening, URL redirection and analytics such as click count and last access time. Redis is used for caching and NGINX is used as an API Gateway and load balancer.

---

## Features

- Create short URLs
- Generate unique Base62 short codes
- Store URL information in MongoDB
- Redirect users using the short code
- Redis cache using the Cache-Aside pattern
- Track URL click count
- Track last accessed time
- Analytics API
- NGINX API Gateway
- Horizontal scaling using multiple Node.js instances
- Dockerized Redis and NGINX

---

## Technology Stack

- Node.js
- Express.js
- MongoDB
- Redis
- NGINX
- Docker
- JavaScript
- REST API

---

## Architecture

```text
                         CLIENT
                            |
                            v
                    +---------------+
                    | NGINX :8080   |
                    | API GATEWAY   |
                    +---------------+
                            |
             +--------------+--------------+
             |              |              |
             v              v              v
      +-------------+ +-------------+ +-------------+
      | URL Service | |  Redirect   | |  Analytics  |
      |             | |   Service   | |   Service   |
      +-------------+ +-------------+ +-------------+
             |              |              |
             +--------------+--------------+
                            |
                   +--------+--------+
                   |                 |
                   v                 v
             +-----------+     +-----------+
             | MongoDB   |     |   Redis   |
             | Database  |     |   Cache   |
             +-----------+     +-----------+

             Project Structure
url-shortner-mono/
│
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── redis.js
│   │
│   ├── controllers/
│   │   └── url.controller.js
│   │
│   ├── models/
│   │   └── url.model.js
│   │
│   ├── repositories/
│   │   └── url.repository.js
│   │
│   ├── routes/
│   │   └── url.routes.js
│   │
│   ├── services/
│   │   ├── url.service.js
│   │   ├── redirect.service.js
│   │   └── analytics.service.js
│   │
│   └── utils/
│       └── base62.js
│
├── server.js
├── nginx.conf
├── package.json
├── package-lock.json
└── README.md

Database
MongoDB stores the URL information.
Each URL contains:
- Original URL
- Short code
- Creation time
- Click count
- Last accessed time
Example:
{
    "shortCode": "6",
    "originalUrl": "https://www.youtube.com",
    "clickCount": 1,
    "createdAt": "2026-10-07T06:17:18.130Z",
    "lastAccessedAt": "2026-10-07T06:18:03.401Z"
}

Redis Cache
Redis is used to cache the original URL corresponding to a short code.
The application follows the Cache-Aside pattern:
Request
   |
   v
Check Redis
   |
   +---- Cache Hit ----> Return URL
   |
   +---- Cache Miss
             |
             v
        Check MongoDB
             |
             v
        Store in Redis
             |
             v
        Return URL

Redis is running inside a Docker container.
Docker
Redis container:
docker start urlshortener-redis

Check running containers:
docker ps

The Redis container exposes:
localhost:6379

NGINX is also running inside Docker.
Start NGINX:
docker start urlshortener-nginx

NGINX exposes:
localhost:8080

NGINX and Load Balancing
NGINX acts as the API Gateway and forwards requests to multiple Node.js instances.
Current backend instances:
8181
8182
8183
8184
8185

The configured upstream is:
upstream url_shortner {
    server host.docker.internal:8181;
    server host.docker.internal:8182;
    server host.docker.internal:8183;
    server host.docker.internal:8184;
    server host.docker.internal:8185;
}

The client communicates with:
http://localhost:8080

instead of directly accessing the backend instances.
Running the Application
1. Install dependencies
npm install

2. Start Redis
docker start urlshortener-redis

3. Start Node.js instances
Run the following in separate terminals:
set PORT=8181 && node server.js

set PORT=8182 && node server.js

set PORT=8183 && node server.js

4. Start NGINX
docker start urlshortener-nginx

The application is now available through:
http://localhost:8080

API Endpoints
1. Create Short URL
Request
POST /api/url/shorten

Example
curl -X POST http://localhost:8080/api/url/shorten ^
-H "Content-Type: application/json" ^
-d "{\"originalUrl\":\"https://www.youtube.com\"}"

Response
{
    "shortuRL": "http://localhost:8080/api/url/6"
}

2. Redirect URL
Request
GET /api/url/:code

Example:
curl -i http://localhost:8080/api/url/6

The server returns:
HTTP/1.1 302 Found
Location: https://www.youtube.com

The user is redirected to the original URL.
3. Analytics
Request
GET /api/url/analytics/:code

Example:
curl http://localhost:8080/api/url/analytics/6

Response
{
    "shortCode": "6",
    "originalUrl": "https://www.youtube.com",
    "clickCount": 1,
    "createdAt": "2026-10-07T06:17:18.130Z",
    "lastAccessedAt": "2026-10-07T06:18:03.401Z"
}

Analytics Tracking
Every successful redirect:
1. Finds the original URL.
2. Increments clickCount.
3. Updates lastAccessedAt.
4. Returns the original URL.
5. Uses Redis caching for repeated requests.
Microservices Structure
The application separates its business logic into service modules:
URL Service
Responsible for:
- Creating URLs
- Generating short codes
- Storing URL information
Redirect Service
Responsible for:
- Receiving a short code
- Finding the original URL
- Redirecting the client
Analytics Service
Responsible for:
- Retrieving URL analytics
- Click count
- Creation time
- Last accessed time
API Gateway
NGINX acts as the API Gateway and provides a single entry point:
Client
  |
  v
NGINX :8080
  |
  v
Backend Services

Testing
Create URL
curl -X POST http://localhost:8080/api/url/shorten ^
-H "Content-Type: application/json" ^
-d "{\"originalUrl\":\"https://www.google.com\"}"

Redirect
curl -i http://localhost:8080/api/url/4

Analytics
curl http://localhost:8080/api/url/analytics/4

Complete Request Flow
Client
   |
   | HTTP Request
   v
NGINX :8080
   |
   v
Node.js Backend
   |
   +----------------------+
   |                      |
   v                      v
Redis Cache            MongoDB
   |                      |
   +----------+-----------+
              |
              v
        URL Response

Conclusion
This project demonstrates a scalable URL shortening backend using Node.js and Express. MongoDB provides persistent storage, Redis improves lookup performance through caching, and NGINX provides a single API Gateway with support for multiple backend instances. The application also provides URL analytics including click count and last access time.

### What you do now

Open:

```text
C:\Users\hp\url-shortner-mono\README.md