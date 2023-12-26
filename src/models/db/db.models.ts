export type BlogDbType = {
    name: string,
    description: string,
    websiteUrl: string
}

export type PostDbType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}