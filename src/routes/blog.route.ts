import {Router} from "express";
import {BlogsRepository} from "../repositories/blog.repository";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {
    HTTP_RESPONSE_CODES,
    ParamType,
    RequestType,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    ResponseType
} from "../models/common";
import {OutputBlogType} from "../models/blog/output/blog.output.models";
import {blogValidation} from "../validators/blog.validator";
import {CreateBlogModel} from "../models/blog/input/create.blog.input.models";
import {UpdateBlogModel} from "../models/blog/input/update.blog.input.models";
import {BlogCreateType} from "../models/db/db.models";
import {ObjectId} from "mongodb";

export const blogRoute = Router({})

blogRoute.get('/', async (req: RequestType, res: ResponseType<OutputBlogType[]>) => {
    const bloggers = await BlogsRepository.getAllBlogs()

    res.status(HTTP_RESPONSE_CODES.SUCCESS).send(bloggers)
})

blogRoute.get('/:id', async (req: RequestWithParams<ParamType>, res: ResponseType<OutputBlogType>) => {
    const id = req.params.id

    if (!ObjectId.isValid(id)){
        res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND)
        return
    }

    const blog = await BlogsRepository.getBlogById(id)

    if (!blog) {
        res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND)
        return
    }

    res.status(HTTP_RESPONSE_CODES.SUCCESS).send(blog)
})

blogRoute.post('/', authMiddleware, blogValidation(), async (req: RequestWithBody<CreateBlogModel>, res: ResponseType<OutputBlogType>) => {
    const {name, description, websiteUrl} = req.body

    const newBlog: BlogCreateType = {
        name,
        description,
        websiteUrl,
        isMembership: false,
        createdAt: new Date().toISOString()
    }

    const createdBlogId = await BlogsRepository.createBlog(newBlog)

    if (!createdBlogId) {
        res.sendStatus(HTTP_RESPONSE_CODES.BAD_REQUEST)
        return
    }

    const blog = await BlogsRepository.getBlogById(createdBlogId)

    if (!blog) {
        res.sendStatus(HTTP_RESPONSE_CODES.BAD_REQUEST)
        return
    }

    res.status(HTTP_RESPONSE_CODES.CREATED).send(blog)
})

blogRoute.put('/:id', authMiddleware, blogValidation(), async (req: RequestWithParamsAndBody<ParamType, UpdateBlogModel>, res: ResponseType<void>) => {
    const id = req.params.id

    if (!ObjectId.isValid(id)){
        res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND)
        return
    }

    const {name, description, websiteUrl} = req.body

    const blog = await BlogsRepository.getBlogById(id)

    if (!blog) {
        res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND)
        return
    }

    const isBlogUpdated = await BlogsRepository.updateBlog(id, { name, description, websiteUrl})

    if (!isBlogUpdated) {
        res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND)
        return
    }

    res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT)
})

blogRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<ParamType>, res: ResponseType<void>) => {
    const id = req.params.id

    if (!ObjectId.isValid(id)){
        res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND)
        return
    }

    const blog = await BlogsRepository.getBlogById(id)

    if (!blog) {
        res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND)
        return;
    }

    await BlogsRepository.deleteBlogById(id)

    res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT)
})