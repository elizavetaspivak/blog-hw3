import {Router} from "express";
import {BlogsRepository} from "../repositories/blog.repository";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {
    HTTP_RESPONSE_CODES, ParamType,
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

export const blogRoute = Router({})

blogRoute.get('/', async (req: RequestType, res: ResponseType<OutputBlogType[]>) => {
    const bloggers = await BlogsRepository.getAllBlogs()

    res.status(HTTP_RESPONSE_CODES.SUCCESS).send(bloggers)
})

blogRoute.get('/:id', async (req: RequestWithParams<ParamType>, res: ResponseType<OutputBlogType>) => {
    const id = req.params.id

    const blog = await BlogsRepository.getBlogById(id)

    if (!blog) {
        res.sendStatus(404)
        return
    }

    res.status(HTTP_RESPONSE_CODES.SUCCESS).send(blog)
})

blogRoute.post('/', authMiddleware, blogValidation(), async (req: RequestWithBody<CreateBlogModel>, res: ResponseType<OutputBlogType>) => {
    const name = req.body.name
    const description = req.body.description
    const websiteUrl = req.body.websiteUrl

    const newBlog: OutputBlogType = {
        id: new Date().toISOString(),
        name,
        description,
        websiteUrl
    }

    const createdBlog = await BlogsRepository.createBlog(newBlog)

    res.status(HTTP_RESPONSE_CODES.CREATED).send(createdBlog)
})

blogRoute.put('/:id', authMiddleware, blogValidation(), async (req: RequestWithParamsAndBody<ParamType, UpdateBlogModel>, res: ResponseType<void>) => {
    const id = req.params.id

    const name = req.body.name
    const description = req.body.description
    const websiteUrl = req.body.websiteUrl

    const blog = BlogsRepository.getBlogById(id)

    if (!blog) {
        res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND)
        return;
    }

    const isBlogUpdated = await BlogsRepository.updateBlog({id, name, description, websiteUrl})

    if (!isBlogUpdated) {
        res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND)
        return
    }

    res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT)
})

blogRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<ParamType>, res: ResponseType<void>) => {
    const id = req.params.id

    const blog = await BlogsRepository.getBlogById(id)

    if (!blog) {
        res.sendStatus(404)
        return;
    }

    BlogsRepository.deleteBlogById(id)

    res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT)
})