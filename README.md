# 📚 Shelf Notes

A personal book-tracking web app to log what you're reading, rate books, and jot down notes — inspired by [Derek Sivers' book list](https://sive.rs/book).

> Rename the title above if you go with a different repo name (e.g. Bookish, Read Log, Marginalia).

## ✨ Features

- Add books you've read, are reading, or want to read
- Rate and review books with personal notes
- Track reading status (to-read / reading / finished)
- Clean, minimal UI for browsing your book list
- Persistent storage with PostgreSQL

## 🛠️ Tech Stack

- **Backend:** Node.js, Express
- **Templating:** EJS
- **Database:** PostgreSQL
- **HTTP Client:** Axios (for fetching book cover/data from external APIs)

## 📂 Project Structure

```
shelf-notes/
├── public/           # Static assets (CSS, images, client JS)
├── views/            # EJS templates
│   ├── partials/     # Reusable header/footer/nav
│   └── index.ejs      # Main book list view
├── db/                # Database setup and queries
│   └── schema.sql
├── routes/            # Express route handlers
├── index.js           # App entry point
├── .env.example       # Environment variable template
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL installed and running

### Installation

1. Clone the repo
   ```bash
   git clone https://github.com/<your-username>/shelf-notes.git
   cd shelf-notes
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   ```
   Then fill in your PostgreSQL credentials:
   ```
   DB_USER=your_pg_user
   DB_HOST=localhost
   DB_NAME=shelf_notes
   DB_PASSWORD=your_password
   DB_PORT=5432
   PORT=3000
   ```

4. Set up the database
   ```bash
   psql -U your_pg_user -d shelf_notes -f db/schema.sql
   ```

5. Run the app
   ```bash
   npm start
   ```
   Visit `http://localhost:3000` in your browser.

## 🗃️ Database Schema (example)

```sql
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  status VARCHAR(20) DEFAULT 'to-read',
  cover_url VARCHAR(500),
  date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📌 Roadmap

- [ ] Search/autocomplete books via external API (e.g. Open Library)
- [ ] Tagging/categorization system
- [ ] Export book list as PDF/Markdown
- [ ] User authentication for multi-user support

## 🙏 Acknowledgements

Inspired by [Derek Sivers' book notes](https://sive.rs/book) — a minimal, honest way to track what you read.

## 📄 License

MIT
