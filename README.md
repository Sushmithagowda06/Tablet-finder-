# Smart Pharmacy Box Locator

A web-based medicine inventory and box-location locator for **Mahalakshmi Medicals and Surgicals**.

## Features

- Search medicines by brand name
- Search by composition / salt
- Display box location
- Manual medicine entry
- Duplicate medicine detection
- Box-location validation (`A1`, `B12`, etc.)
- Excel inventory import
- Flexible Excel column recognition
- Turso / LibSQL database
- Local Express development server
- Vercel-compatible API routes
- Optional Gemini AI composition lookup

## Project Structure

```text
Tablet-finder-
├── api/
│   ├── medicines.js
│   └── upload.js
├── index.html
├── script.js
├── package.json
├── package-lock.json
├── server.js
├── medicines.db
├── .env
└── .gitignore
```

## Technologies

- HTML5
- JavaScript
- Tailwind CSS
- Node.js
- Express.js
- Turso / LibSQL
- Multer
- SheetJS (`xlsx`)
- Gemini API (optional)

## Database

Production data is stored in Turso.

```sql
CREATE TABLE IF NOT EXISTS medicines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand_name TEXT NOT NULL UNIQUE,
    composition TEXT,
    box_location TEXT NOT NULL
);
```

## Environment Variables

For local development, create `.env`:

```env
TURSO_DATABASE_URL=libsql://your-database-url.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token
```

Never commit `.env` or expose the Turso authentication token.

For Vercel, add these variables under:

**Vercel → Project → Settings → Environment Variables**

## Installation

```bash
git clone <repository-url>
cd Tablet-finder-
npm install
```

## Local Development

Start the local server:

```bash
node server.js
```

Open:

```text
http://localhost:3000
```

Local API routes:

```text
GET  /medicines
POST /medicines
POST /medicines/upload
```

## Vercel API

Vercel uses:

```text
GET  /api/medicines
POST /api/medicines
POST /api/upload
```

The frontend automatically selects the local or Vercel API endpoints.

## Excel Import

The importer supports common medicine, composition, and location column names.

Examples:

```text
brand_name
brand
medicine_name
medicine
tablet_name
tablet
composition
salt
active_ingredient
box_location
box
rack
location
location_code
shelf
bin
```

The importer reports:

- Added records
- Duplicate records
- Skipped incomplete rows

## Box Location Validation

Valid examples:

```text
A1
B12
C5
D100
```

Invalid examples:

```text
12A
ABC
A-
1A
```

## API Examples

### Get medicines

```http
GET /api/medicines
```

### Add medicine

```http
POST /api/medicines
Content-Type: application/json
```

Example body:

```json
{
  "brand_name": "Dolo 650",
  "composition": "Paracetamol 650mg",
  "box_location": "A1"
}
```

### Upload Excel

```http
POST /api/upload
Content-Type: multipart/form-data
```

The uploaded file field is:

```text
file
```

## Duplicate Handling

Medicine brand names are checked case-insensitively.

For example:

```text
Dolo 650
dolo 650
DOLO 650
```

are treated as the same medicine.

## Security

Recommended `.gitignore` entries:

```gitignore
.env
.env.*
!.env.example
node_modules/
medicines.db
```

Never commit database credentials or API tokens.

If Gemini is used in production, its API key should be stored server-side rather than exposed in frontend JavaScript.

## Deployment

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add `TURSO_DATABASE_URL`.
4. Add `TURSO_AUTH_TOKEN`.
5. Deploy.
6. Test medicine search, manual entry, and Excel upload.

`server.js` is retained for local development. The `api/` directory contains the Vercel serverless API functions.

## Maintainer

Smart Pharmacy Box Locator project for Mahalakshmi Medicals and Surgicals.
