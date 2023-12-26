import {Router} from "express";
import {PostsRepository} from "../repositories/post.repository";
import {
    HTTP_RESPONSE_CODES,
    ParamType,
    RequestType,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    ResponseType
} from "../models/common";
import {OutputPostModel} from "../models/post/output/post.output.models";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {BlogsRepository} from "../repositories/blog.repository";
import {postValidation} from "../validators/post.validator";
import {UpdatePostModel} from "../models/post/input/update.post.input.models";
import {CreatePostModel} from "../models/post/input/create.post.input.models";

export const postRoute = Router({})

postRoute.get('/', async (req: RequestType, res: ResponseType<OutputPostModel[]>) => {
    const posts = await PostsRepository.getAllPosts()

    res.send(posts)
})

postRoute.get('/:id', async (req: RequestWithParams<ParamType>, res: ResponseType<OutputPostModel>) => {
    const id = req.params.id

    const foundedPost = await PostsRepository.getPostById(id)

    if (!foundedPost) {
        res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND)
        return
    }

    res.send(foundedPost)
})

postRoute.post('/', authMiddleware, postValidation(), async (req: RequestWithBody<CreatePostModel>, res: ResponseType<OutputPostModel>) => {
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const blogId = req.body.blogId

    const blog = await BlogsRepository.getBlogById(blogId)

    const newPost: OutputPostModel = {
        id: new Date().toISOString(),
        title,
        shortDescription,
        content,
        blogId,
        blogName: blog!.name
    }

    const createdPost = await PostsRepository.createPost(newPost)

    res.status(HTTP_RESPONSE_CODES.CREATED).send(createdPost)
})

postRoute.put('/:id', authMiddleware, postValidation(), async (req: RequestWithParamsAndBody<ParamType, UpdatePostModel>, res: ResponseType<void>) => {
    const id = req.params.id

    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const blogId = req.body.blogId

    const post = await PostsRepository.getPostById(id)
    const blog = await BlogsRepository.getBlogById(blogId)

    if (!post) {
        res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND)
        return;
    }

    const updatedPost: OutputPostModel = {
        id, title, shortDescription, content, blogId, blogName: blog!.name
    }

    const isUpdatePost = await PostsRepository.updatePost(updatedPost)

    if (!isUpdatePost) {
        res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND)
        return
    }

    res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT)
})

postRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<ParamType>, res: ResponseType<void>) => {
    const id = req.params.id

    const post = await PostsRepository.getPostById(id)

    if (!post) {
        res.sendStatus(404)
        return;
    }

    await PostsRepository.deletePostById(id)

    res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT)
})