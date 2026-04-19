const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

function parseCSVLine(line) {
  let fields = [];
  let currentField = '';
  let inQuotes = false;
  
  for(let i=0; i < line.length; i++){
    let char = line[i];
    if(char === '"' && line[i+1] === '"' && inQuotes) {
      currentField += '"';
      i++; 
    } else if(char === '"') {
      inQuotes = !inQuotes;
    } else if(char === ',' && !inQuotes) {
      fields.push(currentField);
      currentField = '';
    } else {
      currentField += char;
    }
  }
  fields.push(currentField);
  return fields;
}

async function seed() {
  console.log('🌱 Starting database seeding...');
  
  const csvPath = path.join(__dirname, '../books_dataset.csv');
  let booksToInsert = [];

  if (fs.existsSync(csvPath)) {
    console.log('Reading from books_dataset.csv...');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = fileContent.split(/\r?\n/);
    const rows = lines.slice(1, 400); 

    for (const line of rows) {
      if (!line.trim()) continue;
      const fields = parseCSVLine(line);
      if(fields.length < 30) continue;

      let title = fields[29] || 'Unknown Title';
      if (!title || title === '0') continue;
      if (title.length > 200) title = title.substring(0, 197) + '...';
      
      const author = fields[4] || 'Unknown Author';
      const priceStr = fields[13] || '14.99';
      let price = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
      if (isNaN(price)) price = 14.99;

      let image = fields[15] || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f';
      
      booksToInsert.push({
        title,
        author,
        description: fields[9] && fields[9].length > 10 ? fields[9].substring(0, 800) : 'A compelling read from our collection.',
        price,
        originalPrice: price + 5,
        category: 'Literature & Fiction',
        rating: (fields[23] || "4.5").substring(0, 3),
        stock: Math.floor(Math.random() * 50) + 10,
        image
      });
    }
  } else {
    console.log('⚠️ books_dataset.csv not found. Using high-quality fallback data...');
    booksToInsert = [
      {
        title: "The Midnight Library",
        author: "Matt Haig",
        description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
        price: 18.99,
        originalPrice: 24.99,
        category: "Contemporary Fiction",
        rating: "4.8",
        stock: 25,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800"
      },
      {
        title: "Atomic Habits",
        author: "James Clear",
        description: "No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies.",
        price: 21.50,
        originalPrice: 27.00,
        category: "Self-Help",
        rating: "4.9",
        stock: 50,
        image: "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=800"
      },
      {
        title: "Project Hail Mary",
        author: "Andy Weir",
        description: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish. Except that right now, he doesn’t know that.",
        price: 22.99,
        originalPrice: 29.99,
        category: "Sci-Fi",
        rating: "4.9",
        stock: 15,
        image: "https://images.unsplash.com/photo-1532012197367-9b2db03a5bb0?auto=format&fit=crop&q=80&w=800"
      },
      {
        title: "The Alchemist",
        author: "Paulo Coelho",
        description: "Combining magic, mysticism, wisdom and wonder into an inspiring tale of self-discovery, The Alchemist has become a modern classic, selling millions of copies around the world.",
        price: 14.99,
        originalPrice: 19.99,
        category: "Philosophy",
        rating: "4.7",
        stock: 40,
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800"
      }
    ];
  }

  console.log('Clearing old entries...');
  await prisma.book.deleteMany();
  
  console.log(`Inserting ${booksToInsert.length} books...`);
  for (const book of booksToInsert) {
    try {
      await prisma.book.create({ data: book });
    } catch (err) {
      // Skip errors
    }
  }
  
  console.log('🎉 Seeding completed successfully!');
}

seed().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
