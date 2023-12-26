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
import {PostCreateType, PostUpdateType} from "../models/db/db.models";
import {ObjectId} from "mongodb";

export const postRoute = Router({})

postRoute.get('/', async (req: RequestType, res: ResponseType<OutputPostModel[]>) => {
    const posts = await PostsRepository.getAllPosts()

    res.send(posts)
})

postRoute.get('/:id', async (req: RequestWithParams<ParamType>, res: ResponseType<OutputPostModel>) => {
    const id = req.params.id

    if (!ObjectId.isValid(id)){
        res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND)
        return
    }

    const foundedPost = await PostsRepository.getPostById(id)

    if (!foundedPost) {
        res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND)
        return
    }

    res.send(foundedPost)
})

postRoute.post('/', authMiddleware, postValidation(), async (req: RequestWithBody<CreatePostModel>, res: ResponseType<OutputPostModel>) => {
    const {title, shortDescription, content, blogId} = req.body

    const blog = await BlogsRepository.getBlogById(blogId)

    const newPost: PostCreateType = {
        title,
        shortDescription,
        content,
        blogId,
        blogName: blog!.name,
        createdAt: new Date().toISOString()
    }

    const createdPostId = await PostsRepository.createPost(newPost)

    if (!createdPostId){
        res.sendStatus(HTTP_RESPONSE_CODES.BAD_REQUEST)
        return
    }

    const post = await PostsRepository.getPostById(createdPostId)

    if (!post){
        res.sendStatus(HTTP_RESPONSE_CODES.BAD_REQUEST)
        return
    }

    res.status(HTTP_RESPONSE_CODES.CREATED).send(post)
})

postRoute.put('/:id', authMiddleware, postValidation(), async (req: RequestWithParamsAndBody<ParamType, UpdatePostModel>, res: ResponseType<void>) => {
    const id = req.params.id

    if (!ObjectId.isValid(id)){
        res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND)
        return
    }

    const {title, shortDescription, content , blogId} = req.body

    const post = await PostsRepository.getPostById(id)
    const blog = await BlogsRepository.getBlogById(blogId)

    if (!post) {
        res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND)
        return;
    }

    const updatedPost: PostUpdateType = {
        title, shortDescription, content, blogId, blogName: blog!.name
    }

    const isUpdatePost = await PostsRepository.updatePost(id,  updatedPost)

    if (!isUpdatePost) {
        res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND)
        return
    }

    res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT)
})

postRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<ParamType>, res: ResponseType<void>) => {
    const id = req.params.id

    if (!ObjectId.isValid(id)){
        res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND)
        return
    }

    const post = await PostsRepository.getPostById(id)

    if (!post) {
        res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND)
        return;
    }

    await PostsRepository.deletePostById(id)

    res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT)
})