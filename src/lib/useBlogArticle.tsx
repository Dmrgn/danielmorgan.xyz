import { useEffect, useState } from "react";
import companies from "../../assets/companies.json";

export const CDN_URL = "https://blog-daniel.b-cdn.net/";

export type Article = {
    title: string,
    date: Date,
    body: string,
    image: string,
    slug: string
};

// article with no body for the manifest
export type HollowArticle = {
    title: string,
    date: Date,
    image: string,
    slug: string
};

export type BlogManifest = HollowArticle[];

let currentArticle: Article | null = null;
let manifest: BlogManifest | null = null;
let articleLoadingPromise: Promise<Article | null> | null = null;
let manifestLoadingPromise: Promise<BlogManifest | null> | null = null;

export async function useBlogArticle(): Promise<Article | null> {
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.get("blog")) {
        return null;
    }

    // use existing promise if it exists
    if (articleLoadingPromise === null) {
        articleLoadingPromise = (async () => {
            console.log( urlParams.get("blog"));
            const articleSlug = urlParams.get("blog");
            // then load the article
            if (currentArticle === null || currentArticle.slug != articleSlug) {
                try {
                    currentArticle = await (await fetch(`${CDN_URL}/${articleSlug}.json`)).json() as Article;
                } catch (e) {
                    console.log("Unable to pull article:", articleSlug, e);
                    return null;
                }
            }
            return currentArticle;
        })();
    }

    return await articleLoadingPromise;
}

export async function useBlogManifest(): Promise<BlogManifest | null> {
    // use existing promise if it exists
    if (manifestLoadingPromise === null) {
        manifestLoadingPromise = (async () => {
            // load manifest
            if (manifest === null) {
                try {
                    manifest = await (await fetch(`${CDN_URL}/manifest.json`)).json() as BlogManifest;
                } catch (e) {
                    console.log("Unable to pull manifest", e);
                    return null;
                }
            }
            return manifest;
        })();
    }

    return await manifestLoadingPromise;
}