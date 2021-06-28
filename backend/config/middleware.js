module.exports = {
  load: {
    before: ["responseTime", "logger", "cors", "responses"],
    order: [],
    after: ["parser", "router"],
  },
  settings: {
    cors: {
      enabled: true,
      origin: [
        "http://localhost:8080",
        "http://localhost:8081",
        "https://tpc.hypatiamat.com",
      ],
      credentials: true,
      maxAge: 31536000,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
      headers: [
        "Accept",
        "Authorization",
        "Cache-Control",
        "Content-Type",
        "DNT",
        "If-Modified-Since",
        "Keep-Alive",
        "Origin",
        "User-Agent",
        "X-Requested-With",
        "Content-Length",
      ],
    },
  },
};
