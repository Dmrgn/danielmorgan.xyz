export default function Video({ id }: { id: string }) {
    return <>
        <iframe className="max-w-[70vw] max-h-[70vh]" width="840" height="630"
            src={`https://www.youtube.com/embed/${id}`}>
        </iframe>
    </>
}