import Router from 'koa-router'
import {UserModel} from "../models"
import {isSuperAdmin, isAdmin, isAppUser} from "../utils"
import AppError from '../AppError'
import {ROLE_SUPER_ADMIN} from "../serverconstants"
import {ACCESS_DENIED, HTTP_FORBIDDEN} from "../errorcodes"

const userRouter = new Router({
    prefix: "/users"
})


userRouter.get('/', async ctx => {
    // admin would see all users that have role other than super admin
    if (isAdmin(ctx)) {
        return await UserModel.find({"roles.name": {$ne: ROLE_SUPER_ADMIN}}, {password: 0}).exec()
    } else if (isSuperAdmin(ctx)) {
        return await UserModel.find({}, {password: 0})
    } else {
        throw new AppError("Access Denied", ACCESS_DENIED, HTTP_FORBIDDEN)
    }
})

userRouter.post('/', async ctx => {
    if (isSuperAdmin(ctx) || isAdmin(ctx)) {
        return await UserModel.saveUser(ctx.request.body)
    } else {
        throw new AppError("Access Denied", ACCESS_DENIED, HTTP_FORBIDDEN)
    }

})

userRouter.put('/', async ctx => {
    if (isSuperAdmin(ctx) || isAdmin(ctx)) {
        return await UserModel.editUser(ctx.request.body)
    } else if (isAppUser(ctx)) {
        // App user would only be able to edit its own information check to see if edit user matches logged in user
        let userInput = ctx.request.body
        if (userInput._id == ctx.state.user._id) {
            return await UserModel.editUser(userInput)
        } else {
            throw new AppError("Access Denied", ACCESS_DENIED, HTTP_FORBIDDEN)
        }

    } else {
        throw new AppError("Access Denied", ACCESS_DENIED, HTTP_FORBIDDEN)
    }
})

userRouter.del('/:id', async (ctx, next) => {
    if (isSuperAdmin(ctx) || isAdmin(ctx)) {
        return await UserModel.deleteUser(ctx.params.id)
    } else {
        throw new AppError("Access Denied", ACCESS_DENIED, HTTP_FORBIDDEN)
    }
})

export default userRouter