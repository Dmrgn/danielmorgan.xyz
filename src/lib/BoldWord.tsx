// returns the input text but with 'word' surrounded by <strong>
export function BoldWord({ text, word }: {text: string, word: string}) {
    return <>
        {
            text.split(word).map((x, i) => {
                return <>{i > 0 && <strong>{word}</strong>} {x}</>
            })
        }
    </>
};