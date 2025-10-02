
const { MongoClient } = require('mongodb');

async function insertSampleData() {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const database = client.db('bookstore');
        const books = database.collection('books');

        // Drop existing collection to start fresh
        await books.drop().catch(() => console.log('Collection did not exist, creating new...'));

        // Sample book data
        const bookData = [
            {
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                genre: ["Fiction", "Classic"],
                published_year: 1925,
                publisher: "Scribner",
                pages: 218,
                price: 12.99,
                rating: 4.5,
                reviews: [
                    { user: "reader1", comment: "Timeless classic", rating: 5 },
                    { user: "reader2", comment: "Beautiful prose", rating: 4 }
                ],
                in_stock: true,
                tags: ["american", "jazz age", "tragedy"]
            },
            {
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                genre: ["Fiction", "Classic", "Coming-of-age"],
                published_year: 1960,
                publisher: "J.B. Lippincott & Co.",
                pages: 281,
                price: 14.99,
                rating: 4.8,
                reviews: [
                    { user: "reader3", comment: "Powerful story", rating: 5 },
                    { user: "reader4", comment: "Important social commentary", rating: 5 }
                ],
                in_stock: true,
                tags: ["southern", "racial injustice", "lawyer"]
            },
            {
                title: "1984",
                author: "George Orwell",
                genre: ["Fiction", "Dystopian", "Science Fiction"],
                published_year: 1949,
                publisher: "Secker & Warburg",
                pages: 328,
                price: 11.99,
                rating: 4.7,
                reviews: [
                    { user: "reader5", comment: "Chillingly accurate", rating: 5 },
                    { user: "reader6", comment: "Must-read", rating: 4 }
                ],
                in_stock: false,
                tags: ["dystopia", "surveillance", "political"]
            },
            {
                title: "Pride and Prejudice",
                author: "Jane Austen",
                genre: ["Fiction", "Romance", "Classic"],
                published_year: 1813,
                publisher: "T. Egerton",
                pages: 432,
                price: 9.99,
                rating: 4.6,
                reviews: [
                    { user: "reader7", comment: "Witty and charming", rating: 5 }
                ],
                in_stock: true,
                tags: ["british", "romance", "regency"]
            },
            {
                title: "The Hobbit",
                author: "J.R.R. Tolkien",
                genre: ["Fantasy", "Adventure"],
                published_year: 1937,
                publisher: "George Allen & Unwin",
                pages: 310,
                price: 15.99,
                rating: 4.9,
                reviews: [
                    { user: "reader8", comment: "Fantasy masterpiece", rating: 5 },
                    { user: "reader9", comment: "Great adventure", rating: 5 }
                ],
                in_stock: true,
                tags: ["middle-earth", "dragons", "quest"]
            },
            {
                title: "Harry Potter and the Philosopher's Stone",
                author: "J.K. Rowling",
                genre: ["Fantasy", "Young Adult"],
                published_year: 1997,
                publisher: "Bloomsbury",
                pages: 223,
                price: 18.99,
                rating: 4.9,
                reviews: [
                    { user: "reader10", comment: "Magical journey", rating: 5 },
                    { user: "reader11", comment: "Started it all", rating: 5 }
                ],
                in_stock: true,
                tags: ["wizard", "magic", "school"]
            },
            {
                title: "The Catcher in the Rye",
                author: "J.D. Salinger",
                genre: ["Fiction", "Coming-of-age"],
                published_year: 1951,
                publisher: "Little, Brown and Company",
                pages: 234,
                price: 10.99,
                rating: 4.2,
                reviews: [
                    { user: "reader12", comment: "Relatable protagonist", rating: 4 },
                    { user: "reader13", comment: "Overrated", rating: 3 }
                ],
                in_stock: false,
                tags: ["teenage", "rebellion", "new york"]
            },
            {
                title: "Brave New World",
                author: "Aldous Huxley",
                genre: ["Fiction", "Dystopian", "Science Fiction"],
                published_year: 1932,
                publisher: "Chatto & Windus",
                pages: 311,
                price: 13.99,
                rating: 4.4,
                reviews: [
                    { user: "reader14", comment: "Thought-provoking", rating: 5 }
                ],
                in_stock: true,
                tags: ["utopia", "technology", "society"]
            },
            {
                title: "The Lord of the Rings",
                author: "J.R.R. Tolkien",
                genre: ["Fantasy", "Adventure"],
                published_year: 1954,
                publisher: "George Allen & Unwin",
                pages: 1178,
                price: 29.99,
                rating: 4.95,
                reviews: [
                    { user: "reader15", comment: "Epic fantasy", rating: 5 },
                    { user: "reader16", comment: "The best", rating: 5 }
                ],
                in_stock: true,
                tags: ["middle-earth", "ring", "epic"]
            },
            {
                title: "Moby Dick",
                author: "Herman Melville",
                genre: ["Fiction", "Adventure", "Classic"],
                published_year: 1851,
                publisher: "Richard Bentley",
                pages: 635,
                price: 16.99,
                rating: 4.1,
                reviews: [
                    { user: "reader17", comment: "Long but rewarding", rating: 4 }
                ],
                in_stock: true,
                tags: ["whaling", "revenge", "sea"]
            }
        ];

        const result = await books.insertMany(bookData);
        console.log(`${result.insertedCount} books inserted successfully`);

        // Create indexes
        await books.createIndex({ title: 1 });
        await books.createIndex({ author: 1 });
        await books.createIndex({ genre: 1 });
        await books.createIndex({ published_year: -1 });
        
        console.log('Indexes created successfully');

    } catch (error) {
        console.error('Error inserting data:', error);
    } finally {
        await client.close();
    }
}

insertSampleData();