import {postsCollections} from "../db/db";
import {ObjectId} from "mongodb";
import {CreatePostModel} from "../models/post/input/create.post.input.models";
import {UpdatePostModel} from "../models/post/input/update.post.input.models";

export class PostsRepository {
    static async getAllPosts() {

        const posts = await postsCollections
            .find({})
            .toArray();

        return posts.map((p: any) => ({
            id: p._id,
            title: p.title,
            shortDescription: p.shortDescription,
            content: p.content,
            blogName: p.blogName,
            createdAt: p.createdAt,
            blogId: p.blogId,
        }))
    }

    static async getPostById(id: string) {
        const post = await postsCollections.findOne({_id: new ObjectId(id)});

        if (!post) {
            return null
        }

        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogName: post.blogName,
            createdAt: post.createdAt,
            blogId: post.blogId,
        }
    }

    static async createPost(postData: CreatePostModel) {
        const res = await postsCollections.insertOne(postData)

        return res.insertedId
    }

    static async updatePost(postData: UpdatePostModel) {
        const res = await postsCollections.updateOne({_id: new ObjectId(postData.id)}, {
                $set: {
                    title: postData.title,
                    shortDescription: postData.shortDescription,
                    content: postData.content,
                    blogId: postData.blogId
                }
            }, {upsert: true}
        )

        return !!res.matchedCount;
    }

    static async deletePostById(id: string) {
        const res = await postsCollections.deleteOne({_id: new ObjectId(id)})

        return !!res.deletedCount
    }
}