const production = process.env.NODE_ENV === 'production';

module.exports = {
    PUBLIC_PATH: production ? "https://raw.githubusercontent.com/heartworm/echo720/master/dist/" : "http://localhost:8080/dist/",
    RANDOM_VERSION: Date.now().toString(),
    CONNECT_DOMAIN: production ? "raw.githubusercontent.com" : "localhost",
    MAIN_SCRIPT: "main.js",
    MAIN_STYLES: "main.css"
};