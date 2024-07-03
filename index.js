// require your server and launch it
const server = require("./api/server.js");

const port = 5000;

server.listen(port, function() {
    console.log(`*** Server listening on: http://localhost:${port} ***`);
});