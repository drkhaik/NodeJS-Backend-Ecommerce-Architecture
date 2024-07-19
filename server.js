const app = require("./src/app");

const PORT = process.env.PORT || 3056;

const server = app.listen(PORT, () => {
    console.log(`WSV eCommerce with ${PORT}`);
});

// process.env('SIGINT', () => {
//     server.close(() => console.log(`Exit Server`));
//     // notify.send('ping...')
// });