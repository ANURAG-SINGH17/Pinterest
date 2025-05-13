const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT;
const app = require('./app');
const server = require('http').createServer(app);

server.listen(PORT , () => {
    console.log('server is running')
})