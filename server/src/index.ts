import koa from 'koa';
import { setupBot } from './bot';
import { readSecrets } from './common/config';

const app = new koa();

app.use((ctx) => {
  ctx.response.body = 'ok';
});

app.listen(8080);

setupBot();
