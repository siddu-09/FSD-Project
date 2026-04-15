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
  console.log('Seeding Database from books_dataset.csv...');
  console.log('Clearing old entries...');
  await prisma.book.deleteMany(); // Clear existing books
  
  const csvPath = path.join(__dirname, '../books_dataset.csv');
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = fileContent.split(/\r?\n/);
  
  // Skip header, grab a solid chunk of books (first 100 to keep it concise but rich)
  const rows = lines.slice(1, 400); 
  let count = 0;

  console.log(`Parsing and inserting up to ${rows.length} rows...`);

  for (const line of rows) {
    if (!line.trim()) continue;
    const fields = parseCSVLine(line);
    
    // Safety check - if row didn't parse into enough columns, skip to avoid weird data
    if(fields.length < 30) continue;

    let title = fields[29] || 'Unknown Title';
    if (!title || title === '0') continue; // Reject corrupted titles
    if (title.length > 200) title = title.substring(0, 197) + '...';
    
    const author = fields[4] || 'Unknown Author';
    const priceStr = fields[13] || '14.99';
    let price = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
    if (isNaN(price)) price = 14.99;

    let image = fields[15] || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400&h=600';
    if(image.length > 300) image = image.substring(0, 200);

    const description = fields[9] && fields[9].length > 10 ? fields[9].substring(0, 800) : 'No description available for this book.';
    
    let ratingStr = fields[23] || "4.5 out of 5";
    const rating = ratingStr.substring(0, 3);
    
    try {
      await prisma.book.create({
        data: {
          title: title,
          author: author,
          description: description,
          price: price,
          originalPrice: price + (Math.random() * 5),
          category: 'Literature & Fiction',
          rating: rating,
          stock: Math.floor(Math.random() * 50) + 10,
          image: image
        }
      });
      count++;
    } catch(err) {
      // Intentionally ignoring duplicate or corrupted Prisma records during seeding
    }
  }
  
  console.log(`🎉 Seeding completed! Successfully inserted ${count} rich books from the dataset.`);
}

seed().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
