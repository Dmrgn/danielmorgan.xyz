"use client"

import { useBlogArticle, useBlogManifest, type Article, type BlogManifest } from "@/lib/useBlogArticle";
import { useEffect, useState } from "react";
import Markdown from 'react-markdown'
import meUrl from "../../../assets/me.png";

interface ArticleProps {}

export function ArticleContent({}: ArticleProps) {
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
        <main className="absolute inset-x-0 top-0 min-h-[90vh] flex justify-center px-4 mt-6 sm:mt-16">
            <article className="prose bg-white min-w-0 max-w-3xl w-full rounded-md p-6 sm:p-10 md:p-16 mb-16 [overflow-wrap:anywhere] prose-pre:max-w-full prose-pre:overflow-x-auto">
                <h1 className="mb-0">{article?.title}</h1>
                <div className="flex">
                    <img className="w-12 h-12 object-contain" src={meUrl} alt="A headshot of Daniel Morgan" />
                    <div className="flex flex-col justify-center ml-2">
                        <p className="mb-0">Daniel Morgan</p>
                        <p className="mt-0">{new Date(article?.date as Date).toLocaleDateString()}</p>
                    </div>
                </div>
                <img className="mt-0 mb-0 rounded-md" src={article?.image} alt={article?.title} />
                <hr />
                <Markdown>{article?.body}</Markdown>
            </article>
        </main>
    )
}
