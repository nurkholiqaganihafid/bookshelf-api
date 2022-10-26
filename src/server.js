const Hapi = require('@hapi/hapi');

const init = async () => {
  const server = Hapi.server({
    port: 5_000,
    host: 'localhost',
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
