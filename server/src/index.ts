import koa from 'koa';

const app = new koa();

app.use((ctx) => {
  ctx.response.body = "ok"
});

app.listen(8080);