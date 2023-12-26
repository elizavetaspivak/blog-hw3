import {blogsCollections} from "../db/db";
import {ObjectId} from "mongodb";
import {CreateBlogModel} from "../models/blog/input/create.blog.input.models";
import {UpdateBlogModel} from "../models/blog/input/update.blog.input.models";

export class BlogsRepository {
    static async getAllBlogs() {
        const blogs = await blogsCollections
            .find()
            .toArray();

        return blogs.map((b: any) => ({
            id: b._id,
            name: b.name,
            description: b.description,
            websiteUrl: b.websiteUrl,
            createdAt: b.createdAt,
            isMembership: b.isMembership
        }))

    }

    static async getBlogById(id: string) {
        const blog = await blogsCollections.findOne({_id: new ObjectId(id)});

        return blog
    }

    static async createBlog(createdData: CreateBlogModel) {
        const res = await blogsCollections.insertOne(createdData)

        return res.insertedId
    }

    static async updateBlog(updatedData: UpdateBlogModel) {
        const res = await blogsCollections.updateOne({_id: new ObjectId(updatedData.id)}, {
                $set: {
                    "name": updatedData.name,
                    "description": updatedData.description,
                    "websiteUrl": updatedData.websiteUrl
                }
            }, {upsert: true}
        )

        return !!res.matchedCount;
    }

    static async deleteBlogById(id: string) {
        const res = await blogsCollections.deleteOne({_id: new ObjectId(id)})

        return !!res.deletedCount
    }
}