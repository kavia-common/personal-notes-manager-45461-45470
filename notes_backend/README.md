# Notes Backend (Express)

RESTful API for managing personal notes with in-memory storage and simple JSON file persistence.

- Docs: /docs (Swagger UI)
- Health: GET /

## Endpoints

- GET /notes
  - Query params: q (string), limit (int), offset (int)
  - 200 -> { status, data: Note[], pagination }

- POST /notes
  - Body: { title?: string, content?: string } (must provide at least one non-empty)
  - 201 -> { status, data: Note }
  - 400 -> validation error

- GET /notes/:id
  - 200 -> { status, data: Note }
  - 404 -> not found

- PUT /notes/:id
  - Body: { title?: string, content?: string }
  - 200 -> { status, data: Note }
  - 400 -> validation error
  - 404 -> not found

- DELETE /notes/:id
  - 204 -> No Content
  - 404 -> not found

## Note Shape

{
  id: string,
  title: string,
  content: string,
  createdAt: ISO string,
  updatedAt: ISO string
}

## Running

- Development: npm run dev
- Production: npm start

Environment:
- PORT (default 3000)
- HOST (default 0.0.0.0)

## Examples (curl)

Create:
curl -s -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"First","content":"Hello"}'

List:
curl -s http://localhost:3000/notes

Get:
curl -s http://localhost:3000/notes/{id}

Update:
curl -s -X PUT http://localhost:3000/notes/{id} \
  -H "Content-Type: application/json" \
  -d '{"content":"Updated"}'

Delete:
curl -s -X DELETE http://localhost:3000/notes/{id} -i
