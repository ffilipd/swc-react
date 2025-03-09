const { initializeDB, resetDB } = require('./initializer');
Promise.all([resetDB(), initializeDB()]).then(() => {
    console.log('Database initialized and reset');
});
