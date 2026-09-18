const dns = require('dns');
if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (e) {}
}

const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');

let app;

async function getApp() {
  if (app) return app;

  app = await NestFactory.create(AppModule, { logger: false });
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.setGlobalPrefix('api');
  await app.init();
  return app;
}

module.exports = async (req, res) => {
  try {
    const nestApp = await getApp();

    // In Vercel, if internal rewrite changed req.url to /api/index, restore original path
    if (req.headers['x-matched-path'] && req.headers['x-matched-path'].startsWith('/api')) {
      req.url = req.headers['x-matched-path'];
    } else if (req.headers['x-forwarded-uri'] && req.headers['x-forwarded-uri'].startsWith('/api')) {
      req.url = req.headers['x-forwarded-uri'];
    }

    const instance = nestApp.getHttpAdapter().getInstance();
    instance(req, res);
  } catch (err) {
    console.error('[Compass API Serverless Error]:', err);
    res.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
      error: err.message,
    });
  }
};
