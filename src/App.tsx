import { Card, CardContent } from "@/components/ui/card";
import "./index.css";
import FakePage from "./components/FakePage";
import { useState } from "react";
import { CodeEditor } from "./components/CodeEditor";
import CodeEditorPage from "./components/CodeEditorPage";

const crashMessages = [
    {
        title: "Dynamic Memory Allocation Failed.",
        message: "An error occured while loading a summary of Daniel's achievements.",
        details: "Crash: attempt to allocate 1 petabyte caused memory limit exception."
    },
    {
        title: "Syntax Error.",
        message: "In file /home/daniel/Desktop/Coding/portfolio:",
        details: "Unknown keyword or token 'Button*':\n// I'm going to write this part of the code in C!\n Button* button = (Button*) malloc(sizeof Button);"
    },
    {
        title: "Runtime Assertion Failed.",
        message: "Comparison failed between false expression and true.",
        details: "assert 'Daniel is bad at coding.'"
    },
    {
        title: "Uncaught Runtime Error",
        message: "The current browser does not support the Web Elevator API, as it lacks elevated privileges.",
        details: "// use the user's elevator (the stairs are broken) \n const elevator = new Elevator();"
    },
    {
        title: "Cast to Union Type Failed.",
        message: "Casting to a union type has caused the thread to strike pending demands of reduced compute time.",
        details: "const v = (IntFloatUnion) 10.2;"
    }
];
export type CrashData = typeof crashMessages[number];

export function App() {
    const [crashData, setCrashData] = useState<CrashData>(null);
    const [hasCrashed, setHasCrashed] = useState<boolean>(false);
    const [isViewingCode, setIsViewingCode] = useState<boolean>(false);

    function onFakeCrash() {
        if (hasCrashed) return;
        setHasCrashed(true);
        setCrashData(crashMessages[Math.floor(Math.random() * crashMessages.length)]);
    }

    function onViewCode() {
        setIsViewingCode(true);
    }

    return (
        <>
            {
                !isViewingCode ? <FakePage onViewCode={onViewCode} onFakeCrash={onFakeCrash} crashData={crashData} hasCrashed={hasCrashed}></FakePage>
                : <CodeEditorPage />
            }
        </>
    );
}

export default App;
