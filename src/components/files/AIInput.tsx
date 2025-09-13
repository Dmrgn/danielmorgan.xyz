import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { motion } from "motion/react"

export default function AIInput() {
    const [requestValue, setReqestValue] = useState("");

    function mailToMe() {
        const a = document.createElement("a");
        a.href = `mailto:me@danielmorgan.xyz?subject=About%20danielmorgan.xyz&body=${encodeURIComponent(requestValue)}`;
        a.target = "_blank";
        a.click();
    }

    return <>
        <h1 className="w-full">AI Header</h1>
        <p>I'll use this component somewhere on my portfolio.</p>
        <p>The cool part is that it doesn't use large language models! It might take a few hours to respond though...</p>
        <div className="flex gap-2">
            <Input onInput={(e) => { setReqestValue(e.currentTarget.value) }} placeholder="Ask a question about my portfolio..." />
            {requestValue.length > 3 &&
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} >
                    <Button onClick={mailToMe}>
                        <Send />
                    </Button>
                </motion.div>
            }
        </div>
    </>
}