import { MoveRight, Send } from "lucide-react";
import { Input } from "../ui/input";
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export default function SecretData() {

    const [requestValue, setRequestValue] = useState("");
    const [wasPasswordCorrect, setWasPasswordCorrect] = useState(false);
    const [helpText, setHelpText] = useState("");
    const [isEasyOptionShown, setIsEasyOptionShown] = useState(true);
    const [isSecretShown, setIsSecretShown] = useState(false);

    useEffect(()=>{
        localStorage.setItem("password", "this is a test");
    }, [])

    function testPassword() {
        const milled = requestValue.split("").sort();
        const weight = requestValue.split("");
        const millItem = milled.reduceRight((acc, x, i) => {
            return [...acc, x, weight[i]]
        }, []).join("|").split("a").join("qua").split("t").join("tsts");
        if (millItem === "tsts|tsts|tsts|s|tsts|e|s|tsts|s| |s|qua|i| |i|s|h|i|e| |qua|s| |i| |h| |tsts") {
            setWasPasswordCorrect(true);
            setRequestValue("");
        }
    }

    function noPassword() {
        if (wasPasswordCorrect) {
            setIsSecretShown(true)
            return;
        }
        setIsEasyOptionShown(false);
        setTimeout(()=>{
            setHelpText("It was worth trying, but that would be too easy!");
        }, 200)
        setTimeout(()=>{
            setHelpText("");
        }, 5000)
        setTimeout(()=>{
            setIsEasyOptionShown(true);
        }, 5500)
    }

    return <>
        <p>This file is password protected.</p>
        <div className="flex gap-2">
            <Input onInput={(e) => { setRequestValue(e.currentTarget.value) }} placeholder="Password..." />
            {requestValue.length > 3 &&
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} >
                    <Button onClick={testPassword}>
                        <Send />
                    </Button>
                </motion.div>
            }
        </div>
        { isEasyOptionShown && !isSecretShown &&
            <div className="flex items-center">
                <p className="mr-2">Or click here to access without a password:</p>
                <p className="cursor-pointer underline" onClick={noPassword}>View Contents</p>
            </div>
        }
        <AnimatePresence mode="wait">
            <motion.span
                key={helpText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
            >
                <p>
                    {helpText}
                </p>
            </motion.span>
        </AnimatePresence>
        {wasPasswordCorrect && !isSecretShown &&
            <>
                <h2>File Contents:</h2>
                <p>This file is empty. ¯\_(ツ)_/¯</p>
                <p>No need to keep looking! Nothing to see here!</p>
            </>
        }
        { isSecretShown &&
            <>
                <h2>File Contents:</h2>
                <p className="break-words">VGhhdCB3YXMgYSBsb3Qgb2Ygd29yayB0byBmaW5kIHRoaXMhIEhvcGVmdWxseSB5b3Ugd2VyZW4ndCBwcm9jcmFzdGluYXRpbmcgc29tZXRoaW5nIG1vcmUgaW1wb3J0YW50LiBJJ20gc2FkIHRvIHNheSBJJ3ZlIHdhc3RlZCB5b3VyIHRpbWUsIGFuZCBJIGRvbid0IGhhdmUgYW55IHNlY3JldHMgdG8gcHV0IGhlcmUhIElmIHlvdSBmb3VuZCB0aGlzLCBtZXNzYWdlIG1lIGFuZCB0ZWxsIG1lIGhvdyB5b3UgZGlkIGl0IC8gaG93IGxvbmcgaXQgdG9vayB5b3UhIA==</p>
            </>
        }
    </>
}
