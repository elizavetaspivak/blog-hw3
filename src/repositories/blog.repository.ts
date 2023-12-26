import {blogsCollections} from "../db/db";
import {ObjectId} from "mongodb";
import {CreateBlogModel} from "../models/blog/input/create.blog.input.models";
import {UpdateBlogModel} from "../models/blog/input/update.blog.input.models";
import {blogMapper} from "../models/blog/mappers/blog-mapper";
import {OutputBlogType} from "../models/blog/output/blog.output.models";
import {BlogCreateType} from "../models/db/db.models";

export class BlogsRepository {
    static async getAllBlogs(): Promise<OutputBlogType[]> {
        const blogs = await blogsCollections
            .find()
            .toArray();

        return blogs.map(blogMapper)
    }

    static async getBlogById(id: string): Promise<OutputBlogType | null> {
        const blog = await blogsCollections.findOne({_id: new ObjectId(id)});

        if (!blog){
            return  null
        }

        return blogMapper(blog)
    }

    static async createBlog(createdData: BlogCreateType): Promise<string | null> {
        const res = await blogsCollections.insertOne(createdData)

        if (!res || !res.insertedId){
            return null
        }

        return res.insertedId.toString()
    }

    static async updateBlog(id: string, updatedData: UpdateBlogModel): Promise<boolean> {
        const res = await blogsCollections.updateOne({_id: new ObjectId(id)}, {
                $set: {
                    name: updatedData.name,
                    description: updatedData.description,
                    websiteUrl: updatedData.websiteUrl
                }
            }, {upsert: true}
        )

        return !!res.matchedCount;
    }

    static async deleteBlogById(id: string): Promise<boolean> {
        const res = await blogsCollections.deleteOne({_id: new ObjectId(id)})

        return !!res.deletedCount
    }
}