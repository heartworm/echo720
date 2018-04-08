const production = process.env.NODE_ENV === 'production';

module.exports = {
    PUBLIC_PATH: production ? "https://github.com/heartworm/echo720/raw/master/dist/" : "http://localhost:8080/dist/",
    RANDOM_VERSION: Date.now().toString(),
    CONNECT_DOMAIN: production ? "github.com" : "localhost",
    MAIN_SCRIPT: "main.js",
    MAIN_STYLES: "main.css"
};