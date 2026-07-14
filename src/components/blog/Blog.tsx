"use client"

import { useBlogArticle, useBlogManifest, type Article, type BlogManifest } from "@/lib/useBlogArticle"
import { useEffect, useState } from "react";
import { BlogError } from "./BlogError";
import { ArticleContent } from "./ArticleContent";
import ParticleContainer from "../ParticleContainer";

interface BlogProps {}

export function Blog({}: BlogProps) {
    // find which page we are on
    const [article, setArticle] = useState<Article|null>(null);
    const [manifest, setManifest] = useState<BlogManifest|null>(null);
    const [error, setError] = useState<string|null>(null);

    useEffect(()=> {
        (async ()=>{
            const articleResult = await useBlogArticle();
            const manifestResult = await useBlogManifest();
            const urlParams = new URLSearchParams(window.location.search);
            if (articleResult === null && urlParams.get("blog") !== "") {
                setError("I can't find that article.");
            }
            if (manifestResult === null) {
                setError("Looks like the blog is temporarily down :/");
                return;
            }
            setArticle(articleResult);
            setManifest(manifestResult);
        })();
    })

    return (
        <>
            <ParticleContainer />
            { error ? <BlogError error={error} /> 
                : (article ? <ArticleContent /> 
                : <div>
                    
                </div>)
            }
        </>
    )
}
