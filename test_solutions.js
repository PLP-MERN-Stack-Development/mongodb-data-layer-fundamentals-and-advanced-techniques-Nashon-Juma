const BookstoreManager = require('./solution');

async function runTests() {
    const manager = new BookstoreManager();
    let passedTests = 0;
    let totalTests = 0;

    function test(name, testFunction) {
        totalTests++;
        try {
            testFunction();
            console.log(`✓ PASS: ${name}`);
            passedTests++;
        } catch (error) {
            console.log(`✗ FAIL: ${name}`);
            console.log(`  Error: ${error.message}`);
        }
    }

    console.log('Starting MongoDB Fundamentals Tests...\n');

    try {
        // Test 1: Connection
        await manager.connect();
        test('Database connection', () => {
            if (!manager.client) throw new Error('Client not connected');
            if (!manager.database) throw new Error('Database not initialized');
        });

        // Test 2: CRUD Operations
        console.log('\n--- Testing CRUD Operations ---');
        
        // Test Insert
        const testBook = {
            title: "Test Book",
            author: "Test Author",
            genre: ["Test", "Fiction"],
            published_year: 2023,
            publisher: "Test Publisher",
            pages: 100,
            price: 9.99,
            rating: 4.0,
            reviews: [],
            in_stock: true,
            tags: ["test"]
        };
        
        const insertResult = await manager.insertBook(testBook);
        test('Insert book', () => {
            if (!insertResult.insertedId) throw new Error('Book not inserted');
        });

        // Test Find
        const foundBooks = await manager.findAllBooks();
        test('Find all books', () => {
            if (foundBooks.length === 0) throw new Error('No books found');
        });

        const authorBooks = await manager.findBooksByAuthor("Test Author");
        test('Find books by author', () => {
            if (authorBooks.length === 0) throw new Error('No books found by author');
        });

        // Test Update
        await manager.updateBookPrice("Test Book", 12.99);
        const updatedBooks = await manager.findBooksByAuthor("Test Author");
        test('Update book price', () => {
            if (updatedBooks[0].price !== 12.99) throw new Error('Price not updated');
        });

        // Test Delete
        await manager.deleteBook("Test Book");
        const remainingBooks = await manager.findBooksByAuthor("Test Author");
        test('Delete book', () => {
            if (remainingBooks.length > 0) throw new Error('Book not deleted');
        });

        // Test 3: Advanced Queries
        console.log('\n--- Testing Advanced Queries ---');
        
        const priceRangeBooks = await manager.findBooksByPriceRange(10, 20);
        test('Price range query', () => {
            if (!Array.isArray(priceRangeBooks)) throw new Error('Invalid result type');
        });

        const genreBooks = await manager.findBooksByGenre("Fantasy");
        test('Genre query', () => {
            if (genreBooks.length === 0) throw new Error('No fantasy books found');
        });

        const patternBooks = await manager.findBooksByTitlePattern("Harry");
        test('Title pattern query', () => {
            if (patternBooks.length === 0) throw new Error('No books matching pattern');
        });

        // Test 4: Aggregation Pipeline
        console.log('\n--- Testing Aggregation Pipeline ---');
        
        const genreStats = await manager.getBooksCountByGenre();
        test('Genre aggregation', () => {
            if (!Array.isArray(genreStats)) throw new Error('Invalid result type');
            if (genreStats.length === 0) throw new Error('No genre statistics');
        });

        const bookStats = await manager.getBookStatistics();
        test('Book statistics aggregation', () => {
            if (!bookStats[0]) throw new Error('No statistics returned');
            if (typeof bookStats[0].totalBooks !== 'number') throw new Error('Invalid total books count');
        });

        const popularAuthors = await manager.getPopularAuthors(3);
        test('Popular authors aggregation', () => {
            if (popularAuthors.length === 0) throw new Error('No authors returned');
            if (popularAuthors.length > 3) throw new Error('Limit not working');
        });

        // Test 5: Indexing
        console.log('\n--- Testing Indexing ---');
        
        await manager.createIndexes();
        const explanation = await manager.explainQuery();
        test('Query explanation', () => {
            if (!explanation.queryPlanner) throw new Error('No query plan returned');
        });

    } catch (error) {
        console.error('Test suite failed:', error);
    } finally {
        await manager.disconnect();
        
        console.log('\n=== TEST RESULTS ===');
        console.log(`Passed: ${passedTests}/${totalTests}`);
        console.log(`Score: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
        
        if (passedTests === totalTests) {
            console.log('🎉 All tests passed! Well done!');
        } else {
            console.log('❌ Some tests failed. Please review and try again.');
        }
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests();
}

module.exports = runTests;