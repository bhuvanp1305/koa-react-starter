import Koa from 'koa'
import config from 'config'
import koaStatic from 'koa-static'

let app = new Koa()

const port = config.get('Server.port');

app.use((ctx) => {
        ctx.body = 'Hello World'
    }
)

app.listen(port, () => {
    console.log('Server started on %s', port)
});