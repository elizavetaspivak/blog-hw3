import {postsCollections} from "../db/db";
import {ObjectId} from "mongodb";
import {CreatePostModel} from "../models/post/input/create.post.input.models";
import {UpdatePostModel} from "../models/post/input/update.post.input.models";
import {OutputPostModel} from "../models/post/output/post.output.models";
import {postMapper} from "../models/post/mappers/post-mapper";
import {PostCreateType, PostUpdateType} from "../models/db/db.models";

export class PostsRepository {
    static async getAllPosts(): Promise<OutputPostModel[]> {
        const posts = await postsCollections
            .find({})
            .toArray();

        return posts.map(postMapper)
    }

    static async getPostById(id: string): Promise<OutputPostModel | null> {
        const post = await postsCollections.findOne({_id: new ObjectId(id)});

        if (!post) {
            return null
        }

        return postMapper(post)
    }

    static async createPost(postData: PostCreateType): Promise<string | null> {
        const res = await postsCollections.insertOne(postData)

        if (!res || !res.insertedId){
            return null
        }

        return res.insertedId.toString()
    }

    static async updatePost(id: string, postData: PostUpdateType): Promise<boolean> {
        const res = await postsCollections.updateOne({_id: new ObjectId(id)}, {
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

    static async deletePostById(id: string): Promise<boolean> {
        const res = await postsCollections.deleteOne({_id: new ObjectId(id)})

        return !!res.deletedCount
    }
}