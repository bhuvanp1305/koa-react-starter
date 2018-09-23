import Koa from 'koa'
import config from 'config'
import koaStatic from 'koa-static'
import cookie from 'koa-cookie'
import bodyParser from 'koa-bodyparser'
import passport from 'koa-passport'
import koaSession from 'koa-session'
import mongoose from 'mongoose'
import {performSetup} from "./utils/setupdata";
import prompt from 'prompt-async'
import logger from './logger'

import {apiRouter} from "./routers"
import {HTTP_SERVER_ERROR} from "./errorcodes"

(async () => {
    let app = new Koa()
    app.use(cookie())
    app.use(bodyParser())
    app.use(koaStatic('public'))
    app.keys = ['A secret that no one knows']
    app.use(koaSession({}, app))
    require('./auth')
    app.use(passport.initialize())
    app.use(passport.session())

    prompt.message = ""

    mongoose.Promise = global.Promise
    try {
        await mongoose.connect(config.get('Database.url'), {
            useNewUrlParser: true
        })
        await performSetup(config.get('Setup'))
    } catch (error) {
        console.log("Error connecting to database, please check your configurations...", error)
        return;
    }


    /**
     * Below code is error handler code which would receive both errors and success response
     */

    app.use(async (ctx, next) => {
        try {
            let response = await next()
            if (response !== undefined) {
                ctx.body = {
                    success: true,
                    data: response
                }
            }

        } catch (err) {
            logger.error("Server ERROR:", {error: err})
            ctx.status = err.status || HTTP_SERVER_ERROR
            ctx.body = ctx.body = {
                success: false,
                code: err.code,
                message: err.message
            }
            ctx.app.emit('error', err, ctx);
        }
    });

    app.use(function (ctx, next) {
        ctx.flash = function (type, msg) {
            ctx.session.flash = {type: type, message: msg};
        }
        return next();
    });

// All APIs starts with /api
    app.use(apiRouter.routes())

    const port = config.get('Server.port');
    app.listen(port, () => {
        console.log('Server started on %s', port)
    });

})();
