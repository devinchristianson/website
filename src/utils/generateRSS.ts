import { existsSync, writeFileSync } from "fs";
import { Feed } from "feed"
import { fetchPosts } from "./posts";
import { SITE } from "~/config.mjs";
export async function generateRSS() {
  // only generate if this got called during the build process, when dist would already exist
  if (import.meta.env.PROD && existsSync('dist/') ) {
    const feed = new Feed({
        title: "Devin Christianson's blog",
        description: "This is my tech blog feed feed! Follow for random linux, cybersecurity, and programming shenanigans",
        id: SITE.origin,
        link: SITE.origin,
        language: "en",
        favicon: `${SITE.origin}/favicon.ico`,
        copyright: "All rights reserved 2023, Devin Christianson",
        updated: new Date(), // assumes it's being rebuilt because of updates
        generator: "awesome", // optional, default = 'Feed for Node.js'
        feedLinks: {
          json: `${SITE.origin}/json`,
          atom: `${SITE.origin}/atom`
        },
        author: {
          name: "Devin Christianson",
          email: "devin.a.christianson@gmail.com",
          link: SITE.origin
        }
      });
    const posts = await fetchPosts()
    posts.forEach((p)=>{
        feed.addItem({
            title: p.title,
            id: `${SITE.origin}/blog/${p.slug}`,
            link: `${SITE.origin}/blog/${p.slug}`,
            description: p.excerpt,
            content: p.content,
            author: [
              {
                name: "Devin Christianson",
                email: "devin.a.christianson@gmail.com",
                link: SITE.origin
              }
            ],
            contributor: [],
            date: p.updateDate ?? new Date(),
            image: p.image
        });
    })
    writeFileSync('dist/feed', feed.rss2())
    writeFileSync('dist/json', feed.json1())
    writeFileSync('dist/atom', feed.atom1())
  }
}