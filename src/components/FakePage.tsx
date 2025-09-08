import "../index.css";
import meUrl from "../../assets/me.png";
import '@fontsource/freckle-face';
import { BookOpenCheck, BookOpenText, Building2, CircleQuestionMark, CircleUserRound, Cloud, CloudAlert, Code, Database, Zap } from "lucide-react";

import ParticleContainer from "./ParticleContainer";
import ScrollWrapper from "./ScrollWrapper";
import { ErrorCard } from "./ErrorCard";
import { LanguageChart } from "./LanguageChart";

import { motion } from "motion/react"
import { useRef, useState } from "react";

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
type CrashData = typeof crashMessages[number];

export function FakePage() {

    const [crashData, setCrashData] = useState<CrashData>(null);
    const hasCrashed = useRef<boolean>(false);

    function fakeCrashPage() {
        if (hasCrashed.current) return;
        hasCrashed.current = true;
        setCrashData(crashMessages[Math.floor(Math.random() * crashMessages.length)]);
    }

    return (
        <div className="w-[99vw] flex flex-col items-center overflow-x-hidden px-8">

            {
                crashData &&
                <div className="fixed top-0 left-0 w-screen h-screen overflow-clip bg-black/50 backdrop-blur-sm z-100 flex items-center justify-center">
                    <ErrorCard
                        title={crashData.title}
                        message={crashData.message}
                        details={crashData.details}
                        onContinue={()=>console.log("here")}
                        variant="error"
                    />
                </div>
            }

            <ParticleContainer></ParticleContainer>
            <div className="w-full h-[95vh] flex items-center justify-center overflow-hidden">
                <div className="container w-full h-1/2">
                    <div className="h-4/5 w-full"></div>
                    <ScrollWrapper className="w-full h-1/5  bg-[var(--chart-2)] rounded-[var(--radius)] shadow-xl relative">
                        <div className="absolute md:bottom-20 bottom-5 flex w-full mx-8">
                            <div className="absolute bottom-15 md:bottom-0 right-0 mr-16">
                                <div className="w-full h-8 bg-radial from-primary to-transparent rounded-full shadow-2xl absolute -bottom-4 z-0"></div>
                                <img className="relative w-[400px] z-10" src={meUrl} />
                            </div>
                            <div className="flex flex-col text-5xl md:text-7xl text-white text-shadow-white absolute left-0 bottom-0 z-20 mr-16 mb-4 font-bold tracking-widest" style={{ fontFamily: 'Freckle Face' }}>
                                <motion.div initial={{ translateY: 200, opacity: 0 }} animate={{ translateY: 0, opacity: 1, transition: { delay: 0.5 } }} >Hi, I'm</motion.div>
                                <motion.div initial={{ translateY: 200, opacity: 0 }} animate={{ translateY: 0, opacity: 1, transition: { delay: 0.55 } }} className="text-7xl md:text-9xl">Daniel</motion.div>
                                <motion.div initial={{ translateY: 200, opacity: 0 }} animate={{ translateY: 0, opacity: 1, transition: { delay: 0.6 } }} className="text-7xl md:text-9xl">Morgan.</motion.div>
                                <motion.div initial={{ translateY: 200, opacity: 0 }} animate={{ translateY: 0, opacity: 1, transition: { delay: 0.65 } }} className="w-full h-8 bg-radial from-primary to-transparent rounded-full shadow-2xl absolute -bottom-4 -z-10"></motion.div>
                            </div>
                        </div>
                        <div className="w-full h-7/8 bg-[var(--chart-1)] rounded-[var(--radius)]">
                            <div className="w-full h-7/8 bg-muted rounded-[var(--radius)]">
                            </div>
                        </div>
                    </ScrollWrapper>
                </div>
            </div>

            <div className="w-full container flex flex-col items-center">
                <ScrollWrapper>
                    <h2 className="mb-8 text-5xl text-white text-shadow-2xl" style={{ fontFamily: 'Freckle Face' }}>Who is Daniel?</h2>
                </ScrollWrapper>
                <div className="grid md:grid-cols-2 gap-8 font-bold">
                    {AboutItem(
                        "Software Engineering Specialist Student @ University of Toronto",
                        <BookOpenText className="w-8 h-8 mr-4" />,
                        "left",
                        "#ebcc34",
                        [
                            { icon: <Code className="w-5 h-5 mr-3" />, text: "Software Design" },
                            { icon: <BookOpenCheck className="w-5 h-5 mr-3" />, text: "3.8/4.0 GPA" }
                        ]
                    )}
                    {AboutItem(
                        "Startup Founder @ thundr.ca",
                        <Zap className="w-8 h-8 mr-4" />,
                        "right",
                        "#881fde",
                        [
                            { icon: <CircleUserRound className="w-5 h-5 mr-3" />, text: "Revenue Generating" },
                            { icon: <Building2 className="w-5 h-5 mr-3" />, text: "Venture Capitalist Backed" },
                        ]
                    )}
                </div>
            </div>

            <div className="w-full container flex flex-col items-center mt-[25vh]">
                <ScrollWrapper>
                    <h2 className="mb-8 text-5xl text-white text-shadow-2xl" style={{ fontFamily: 'Freckle Face' }}>What Does Daniel do?</h2>
                </ScrollWrapper>
                <div className="grid md:grid-cols-2 gap-8 font-bold w-full">
                    <ScrollWrapper onAnimationEnd={fakeCrashPage} className="w-full h-full">
                        <LanguageChart />
                    </ScrollWrapper>
                    <div>
                        {AboutItem(
                            "Why are you still here?",
                            <CircleQuestionMark className="w-8 h-8 mr-4" />,
                            "right",
                            "#881fde",
                            [
                                { icon: <></>, text: "This page is meant to crash once you reach this part. You should have been taken to a fake code editor to inspect the error after the crash, which is really just a creative way for me to grab your attention and show off my projects." },
                            ]
                        )}
                    </div>
                </div>
            </div>

            <div className="h-[200vh]">

            </div>
        </div>
    )

    function AboutItem(
        text: string,
        icon: React.ReactNode,
        side: "left" | "right",
        bgColor?: string,
        subItems: { icon: React.ReactNode; text: string; bg?: string }[] = []
    ) {
        return <ScrollWrapper side={side}>
            <motion.div whileHover={{ scale: 1.07 }} className="w-full h-full rounded-[var(--radius)]" style={{ backgroundColor: bgColor || "var(--chart-1)" }}>
                <div className="w-full h-7/8 bg-muted rounded-[var(--radius)] text-white pb-8 pt-7 px-6">
                    <motion.div initial={{ translateY: 200, opacity: 0 }} animate={{ translateY: 0, opacity: 1, transition: { delay: 0.5 } }} className="flex items-center">
                        {icon}
                        <p>
                            {text}
                        </p>
                    </motion.div>

                    {subItems.length > 0 && (
                        <div className={"mt-4 grid grid-cols-1 gap-3 " + (subItems.length > 1 ? "md:grid-cols-2" : "")}>
                            {subItems.map((si, idx) => (
                                <div key={idx} className="flex items-center p-3 rounded-md text-sm text-white" style={{ backgroundColor: si.bg || "rgba(255,255,255,0.05)" }}>
                                    {si.icon}
                                    <span>{si.text}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </ScrollWrapper>;
    }
}

export default FakePage;
