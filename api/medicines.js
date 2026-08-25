const { createClient } = require('@libsql/client');

const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
});

async function initDatabase() {
    await db.execute(`
        CREATE TABLE IF NOT EXISTS medicines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            brand_name TEXT NOT NULL UNIQUE,
            composition TEXT,
            box_location TEXT NOT NULL
        )
    `);
}

module.exports = async (req, res) => {
    try {
        await initDatabase();

        // GET ALL MEDICINES
        if (req.method === 'GET') {
            const result = await db.execute(`
                SELECT *
                FROM medicines
                ORDER BY brand_name ASC
            `);

            return res.status(200).json(result.rows);
        }

        // ADD MEDICINE
        if (req.method === 'POST') {
            const {
                brand_name,
                composition,
                box_location
            } = req.body;

            if (!brand_name || !box_location) {
                return res.status(400).json({
                    message: 'Brand name and box location are required'
                });
            }

            const existing = await db.execute({
                sql: `
                    SELECT id
                    FROM medicines
                    WHERE LOWER(TRIM(brand_name))
                    = LOWER(TRIM(?))
                `,
                args: [brand_name]
            });

            if (existing.rows.length > 0) {
                return res.status(409).json({
                    message: 'Medicine already exists'
                });
            }

            const result = await db.execute({
                sql: `
                    INSERT INTO medicines
                    (brand_name, composition, box_location)
                    VALUES (?, ?, ?)
                `,
                args: [
                    brand_name.trim(),
                    composition ? composition.trim() : '',
                    box_location.trim().toUpperCase()
                ]
            });

            return res.status(200).json({
                id: Number(result.lastInsertRowid),
                message: 'Medicine added successfully'
            });
        }

        return res.status(405).json({
            message: 'Method not allowed'
        });

    } catch (error) {
        console.error('Turso database error:', error);

        return res.status(500).json({
            message: 'Database error',
            error: error.message
        });
    }
};