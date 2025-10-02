const { MongoClient } = require('mongodb');

class BookstoreManager {
    constructor() {
        this.uri = 'mongodb://localhost:27017';
        this.dbName = 'bookstore';
        this.client = null;
        this.database = null;
        this.books = null;
    }

    /**
     * Task 1: Database Connection
     * Connect to MongoDB and initialize collections
     */
    async connect() {
        try {
            this.client = new MongoClient(this.uri);
            await this.client.connect();
            this.database = this.client.db(this.dbName);
            this.books = this.database.collection('books');
            console.log('Connected to MongoDB successfully');
            
            // List all databases (bonus)
            const adminDb = this.database.admin();
            const dbList = await adminDb.listDatabases();
            console.log('Available databases:', dbList.databases.map(db => db.name));
            
            return true;
        } catch (error) {
            console.error('Connection failed:', error);
            return false;
        }
    }

    async disconnect() {
        if (this.client) {
            await this.client.close();
            console.log('Disconnected from MongoDB');
        }
    }

    /**
     * Task 2: Basic CRUD Operations
     */

    // Create - Insert a new book
    async insertBook(bookData) {
        try {
            const result = await this.books.insertOne(bookData);
            console.log(`Book inserted with ID: ${result.insertedId}`);
            return result;
        } catch (error) {
            console.error('Error inserting book:', error);
            throw error;
        }
    }

    // Read - Find books by various criteria
    async findAllBooks() {
        try {
            return await this.books.find({}).toArray();
        } catch (error) {
            console.error('Error finding books:', error);
            throw error;
        }
    }

    async findBooksByAuthor(author) {
        try {
            return await this.books.find({ author: author }).toArray();
        } catch (error) {
            console.error('Error finding books by author:', error);
            throw error;
        }
    }

    async findBooksByGenre(genre) {
        try {
            return await this.books.find({ genre: genre }).toArray();
        } catch (error) {
            console.error('Error finding books by genre:', error);
            throw error;
        }
    }

    // Update - Update book information
    async updateBookPrice(title, newPrice) {
        try {
            const result = await this.books.updateOne(
                { title: title },
                { $set: { price: newPrice } }
            );
            console.log(`Modified ${result.modifiedCount} book(s)`);
            return result;
        } catch (error) {
            console.error('Error updating book:', error);
            throw error;
        }
    }

    async addBookReview(title, review) {
        try {
            const result = await this.books.updateOne(
                { title: title },
                { $push: { reviews: review } }
            );
            console.log(`Added review to ${result.modifiedCount} book(s)`);
            return result;
        } catch (error) {
            console.error('Error adding review:', error);
            throw error;
        }
    }

    // Delete - Remove books
    async deleteBook(title) {
        try {
            const result = await this.books.deleteOne({ title: title });
            console.log(`Deleted ${result.deletedCount} book(s)`);
            return result;
        } catch (error) {
            console.error('Error deleting book:', error);
            throw error;
        }
    }

    /**
     * Task 3: Advanced Queries
     */

    // Comparison operators
    async findBooksPublishedAfter(year) {
        try {
            return await this.books.find({
                published_year: { $gt: year }
            }).toArray();
        } catch (error) {
            console.error('Error finding books:', error);
            throw error;
        }
    }

    async findBooksByPriceRange(minPrice, maxPrice) {
        try {
            return await this.books.find({
                price: { $gte: minPrice, $lte: maxPrice }
            }).toArray();
        } catch (error) {
            console.error('Error finding books by price range:', error);
            throw error;
        }
    }

    // Logical operators
    async findClassicFantasyBooks() {
        try {
            return await this.books.find({
                $and: [
                    { genre: 'Classic' },
                    { genre: 'Fantasy' }
                ]
            }).toArray();
        } catch (error) {
            console.error('Error finding classic fantasy books:', error);
            throw error;
        }
    }

    async findBooksByRatingOrPages(rating, pages) {
        try {
            return await this.books.find({
                $or: [
                    { rating: { $gte: rating } },
                    { pages: { $lte: pages } }
                ]
            }).toArray();
        } catch (error) {
            console.error('Error finding books:', error);
            throw error;
        }
    }

    // Array operators
    async findBooksWithMultipleGenres(genreCount) {
        try {
            return await this.books.find({
                $expr: { $gte: [{ $size: '$genre' }, genreCount] }
            }).toArray();
        } catch (error) {
            console.error('Error finding books with multiple genres:', error);
            throw error;
        }
    }

    async findBooksByTag(tag) {
        try {
            return await this.books.find({
                tags: tag
            }).toArray();
        } catch (error) {
            console.error('Error finding books by tag:', error);
            throw error;
        }
    }

    // Regular expressions
    async findBooksByTitlePattern(pattern) {
        try {
            return await this.books.find({
                title: { $regex: pattern, $options: 'i' }
            }).toArray();
        } catch (error) {
            console.error('Error finding books by title pattern:', error);
            throw error;
        }
    }

    /**
     * Task 4: Aggregation Pipeline
     */

    // Group and count books by genre
    async getBooksCountByGenre() {
        try {
            return await this.books.aggregate([
                { $unwind: '$genre' },
                {
                    $group: {
                        _id: '$genre',
                        count: { $sum: 1 },
                        averageRating: { $avg: '$rating' }
                    }
                },
                { $sort: { count: -1 } }
            ]).toArray();
        } catch (error) {
            console.error('Error in aggregation:', error);
            throw error;
        }
    }

    // Calculate average ratings and other statistics
    async getBookStatistics() {
        try {
            return await this.books.aggregate([
                {
                    $group: {
                        _id: null,
                        totalBooks: { $sum: 1 },
                        averageRating: { $avg: '$rating' },
                        averagePrice: { $avg: '$price' },
                        averagePages: { $avg: '$pages' },
                        maxPrice: { $max: '$price' },
                        minPrice: { $min: '$price' }
                    }
                }
            ]).toArray();
        } catch (error) {
            console.error('Error in aggregation:', error);
            throw error;
        }
    }

    // Find most popular authors
    async getPopularAuthors(limit = 5) {
        try {
            return await this.books.aggregate([
                {
                    $group: {
                        _id: '$author',
                        bookCount: { $sum: 1 },
                        averageRating: { $avg: '$rating' },
                        totalReviews: { $sum: { $size: '$reviews' } }
                    }
                },
                { $sort: { averageRating: -1, bookCount: -1 } },
                { $limit: limit }
            ]).toArray();
        } catch (error) {
            console.error('Error in aggregation:', error);
            throw error;
        }
    }

    // Find books with high ratings and in stock
    async getTopRatedInStockBooks(limit = 5) {
        try {
            return await this.books.aggregate([
                { $match: { in_stock: true, rating: { $gte: 4.5 } } },
                { $sort: { rating: -1 } },
                { $limit: limit },
                {
                    $project: {
                        title: 1,
                        author: 1,
                        rating: 1,
                        price: 1,
                        genre: 1
                    }
                }
            ]).toArray();
        } catch (error) {
            console.error('Error in aggregation:', error);
            throw error;
        }
    }

    /**
     * Task 5: Indexing
     */

    async createIndexes() {
        try {
            // Create compound index for common queries
            await this.books.createIndex({ author: 1, published_year: -1 });
            
            // Create text index for search
            await this.books.createIndex({ title: 'text', tags: 'text' });
            
            // Create index for price range queries
            await this.books.createIndex({ price: 1 });
            
            // Create index for rating queries
            await this.books.createIndex({ rating: -1 });
            
            console.log('All indexes created successfully');
        } catch (error) {
            console.error('Error creating indexes:', error);
            throw error;
        }
    }

    async explainQuery() {
        try {
            const explanation = await this.books.find(
                { rating: { $gte: 4.5 }, in_stock: true }
            ).explain();
            
            console.log('Query explanation:', explanation.queryPlanner.winningPlan);
            return explanation;
        } catch (error) {
            console.error('Error explaining query:', error);
            throw error;
        }
    }
}

// Demo function to run all tasks
async function demonstrateSolutions() {
    const manager = new BookstoreManager();
    
    try {
        // Task 1: Connection
        await manager.connect();
        
        // Task 2: CRUD Operations
        console.log('\n=== TASK 2: CRUD Operations ===');
        
        // Insert a new book
        const newBook = {
            title: "The Alchemist",
            author: "Paulo Coelho",
            genre: ["Fiction", "Adventure", "Fantasy"],
            published_year: 1988,
            publisher: "HarperCollins",
            pages: 208,
            price: 13.99,
            rating: 4.7,
            reviews: [
                { user: "reader18", comment: "Inspiring journey", rating: 5 }
            ],
            in_stock: true,
            tags: ["quest", "personal legend", "spiritual"]
        };
        await manager.insertBook(newBook);
        
        // Find books by author
        const tolkiensBooks = await manager.findBooksByAuthor("J.R.R. Tolkien");
        console.log(`Found ${tolkiensBooks.length} books by J.R.R. Tolkien`);
        
        // Update book price
        await manager.updateBookPrice("The Great Gatsby", 13.50);
        
        // Add review
        await manager.addBookReview("1984", {
            user: "new_reader",
            comment: "Still relevant today",
            rating: 5
        });
        
        // Task 3: Advanced Queries
        console.log('\n=== TASK 3: Advanced Queries ===');
        
        const recentBooks = await manager.findBooksPublishedAfter(1950);
        console.log(`Found ${recentBooks.length} books published after 1950`);
        
        const affordableBooks = await manager.findBooksByPriceRange(10, 15);
        console.log(`Found ${affordableBooks.length} books between $10 and $15`);
        
        const patternBooks = await manager.findBooksByTitlePattern("the");
        console.log(`Found ${patternBooks.length} books with "the" in title`);
        
        // Task 4: Aggregation Pipeline
        console.log('\n=== TASK 4: Aggregation Pipeline ===');
        
        const genreStats = await manager.getBooksCountByGenre();
        console.log('Books by genre:', genreStats);
        
        const overallStats = await manager.getBookStatistics();
        console.log('Overall statistics:', overallStats[0]);
        
        const popularAuthors = await manager.getPopularAuthors(3);
        console.log('Popular authors:', popularAuthors);
        
        // Task 5: Indexing
        console.log('\n=== TASK 5: Indexing ===');
        await manager.createIndexes();
        await manager.explainQuery();
        
    } catch (error) {
        console.error('Demo failed:', error);
    } finally {
        await manager.disconnect();
    }
}

// Run the demonstration if this file is executed directly
if (require.main === module) {
    demonstrateSolutions();
}

module.exports = BookstoreManager;