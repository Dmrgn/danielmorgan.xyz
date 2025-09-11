import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { motion } from "motion/react"

export default function AIHeader() {
    const [requestValue, setReqestValue] = useState("");

    useEffect(()=>{
        console.log(requestValue);
    }, [requestValue])

    return <>
        <h1 className="w-full">AI Header</h1>
        <p>I'll use this component somewhere on my portfolio.</p>
        <p>The cool part is that it doesn't use large language models!</p>
        <div className="flex gap-2">
            <Input onInput={(e)=>{setReqestValue(e.currentTarget.value)}} placeholder="Ask me a question about my portfolio..." />
            { requestValue.length > 3 &&
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} >
                    <Button>
                        <Send />
                    </Button>
                 </motion.div>
            }
        </div>
    </>
}