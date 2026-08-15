import { neon } from "@neondatabase/serverless";

export function getDb() {
  const sql = neon(process.env.DATABASE_URL!);
  return sql;
}

export async function initializeDb() {
  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      description TEXT DEFAULT '',
      category VARCHAR(100) DEFAULT 'Roman',
      year INTEGER DEFAULT 2024,
      isbn VARCHAR(50) DEFAULT '',
      available BOOLEAN DEFAULT true,
      cover VARCHAR(10) DEFAULT '📕',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Seed if empty
  const result = await sql`SELECT COUNT(*) as count FROM books`;
  if (Number(result[0].count) === 0) {
    await sql`
      INSERT INTO books (title, author, description, category, year, isbn, available, cover) VALUES
      ('Suç ve Ceza', 'Fyodor Dostoyevski', 'Raskolnikov''un işlediği cinayetin ardından yaşadığı psikolojik çöküşü anlatan klasik roman.', 'Roman', 1866, '978-975-07-0244-8', true, '📕'),
      ('Kürk Mantolu Madonna', 'Sabahattin Ali', 'Berlin''de geçen, kültürler arası bir aşk hikayesini anlatan Türk edebiyatının başyapıtı.', 'Roman', 1943, '978-975-10-0456-2', true, '📗'),
      ('Sefiller', 'Victor Hugo', 'Jean Valjean''ın hikayesi üzerinden adaleti, merhameti ve toplumsal eşitsizliği sorgulayan dev eser.', 'Roman', 1862, '978-975-07-0312-4', false, '📘'),
      ('Küçük Prens', 'Antoine de Saint-Exupéry', 'Bir çocuğun gözünden büyüklerin dünyasını sorgulayan, zamansız bir masal.', 'Çocuk', 1943, '978-975-07-0567-8', true, '📙'),
      ('1984', 'George Orwell', 'Totaliter bir rejimde bireyin özgürlük arayışını anlatan distopik roman.', 'Bilim Kurgu', 1949, '978-975-07-0890-7', true, '📕'),
      ('Şeker Portakalı', 'José Mauro de Vasconcelos', 'Küçük Zezé''nin hayal dünyası ve gerçek hayat arasındaki dokunaklı hikayesi.', 'Çocuk', 1968, '978-975-07-1234-5', true, '📗'),
      ('Tutunamayanlar', 'Oğuz Atay', 'Türk edebiyatının postmodern başyapıtı, aydın bireyin toplumla çatışması.', 'Roman', 1972, '978-975-07-2345-6', false, '📘'),
      ('Cosmos', 'Carl Sagan', 'Evrenin sırlarını herkesin anlayabileceği bir dille anlatan popüler bilim kitabı.', 'Bilim', 1980, '978-975-07-3456-7', true, '📙')
    `;
  }
}
