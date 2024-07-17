const app = require("./src/app");

const PORT = 3055;

const server = app.listen(PORT, () => {
    console.log(`WSV eCommerce with ${PORT}`);
});

// process.env('SIGINT', () => {
//     server.close(() => console.log(`Exit Server`));
//     // notify.send('ping...')
// });