"use client"

interface BlogErrorProps {
    error: string
}

export function BlogError({error}: BlogErrorProps) {
    return (
        <>
            <h1 className="text-3xl" style={{ fontFamily: 'Freckle Face' }}>Ooops...</h1>
            <h3>Looks like an error occured!</h3>
            <p>{error}</p>
            <a href="/blog">Return home.</a>
        </>
    )
}
