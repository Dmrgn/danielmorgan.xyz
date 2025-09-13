import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react"
import { PhysicsItem, PhysicsWorld } from "../PhysicsWorld";
import PhysicsText from "../PhysicsText";

enum ButtonState {
    init,
    lame1,
    lame2,
    storm
};

export default function Content() {
    const [currentState, setCurrentState] = useState<ButtonState>(ButtonState.init);
    const [lameButtonText, setLameButtonText] = useState("That's lame...");
    const [coolButtonText, setCoolButtonText] = useState("That's pretty cool!");
    const [helpText, setHelpText] = useState("");

    function onCoolButton() {
        if (currentState === ButtonState.lame2) {
            setHelpText("too late...");
            return;
        }
        setCurrentState(ButtonState.init);
        setHelpText("Thanks!");
    }

    function onLameButton() {
        switch (currentState) {
            case ButtonState.init:
                setCurrentState(ButtonState.lame1);
                break;
            case ButtonState.lame1:
                setCurrentState(ButtonState.lame2);
                break;
            case ButtonState.lame2:
                // pray to whatever god may still accept you
                setCurrentState(ButtonState.storm);
                break;
        }
    }

    useEffect(() => {
        switch (currentState) {
            case ButtonState.init:
                setLameButtonText("That's lame...");
                setCoolButtonText("That's pretty cool!");
                break;
            case ButtonState.lame1:
                setLameButtonText("Yep, very lame.");
                setCoolButtonText("That's pretty cool!");
                setHelpText("Are you sure?");
                break;
            case ButtonState.lame2:
                setLameButtonText("Mega lame.");
                setCoolButtonText("Just kidding! It's cool!");
                setHelpText("Are you really sure?");
                break;
        }
    }, [currentState])

    const blocks: any[] = [
        { type: 'h1', text: "Hi, I'm Daniel Morgan", className: "w-full max-w-[65ch]" },
        { type: 'p', text: "I’ve been coding since age 9 - now I’m building startups that win grants, incubator spots, and pitch competitions.", className: "max-w-[65ch]" },
        { type: 'row', items: [
            { type: 'img', el: <img className="w-8 mt-0 mb-0" src="https://thundr.ca/thundr.png" alt="thundr logo" /> },
            { type: 'h3', text: "What is thundr.ca?", className: "mt-0 mb-0" },
        ] },
        { type: 'p', text: "thundr is a software as a service (Saas) company which extensively automates the creation, maintenance and sale of websites for small construction and home service businesses.", className: "max-w-[65ch]" },
        { type: 'p', text: "I solo developed thundr from scratch over the course of a year, iterating over 3 major prototypes and over 250 websites built.", className: "max-w-[65ch]" },
        { type: 'p', text: "thundr's stack includes Nuxt, Vue, Typescript, Tailwind, payment integration (Stripe), emailing (NodeMailer), DNS & proxy (Traefik), web scraping (Puppeteer), Amazon S3, machine learning (Tensorflow), and Prisma + CockroachDB.", className: "max-w-[65ch]" },
        { type: 'p', text: "Sites made with thundr have amassed thousands of visitors per month.", className: "max-w-[65ch]" },
        { type: 'p', text: "I recently raised funding with support from a multi-billion dollar venture capitalist firm to bring thundr to 10,000 small businesses across Canada. ", className: "max-w-[65ch]" },
    ];

    return <>
        {currentState === ButtonState.storm && <>
            <PhysicsWorld className="h-[84vh] w-screen max-w-[85vw]" gravity={0.8} restitution={0.35}>
                {blocks.map((b, idx) => {
                    if (b.type === 'row') {
                        return b.items.map((it: any, j: number) => {
                            if (it.type === 'img') {
                                return (
                                    <PhysicsItem key={`r-${idx}-${j}`} options={{ density: 0.0004, restitution: 0.6 }} initial={{ x: 0, y: idx * 75 }}>
                                        {it.el}
                                    </PhysicsItem>
                                );
                            }
                            return (
                                <PhysicsText key={`r-${idx}-${j}`} text={it.text} className={it.className} itemOptions={{ density: 0.0004, restitution: 0.6 }} initial={{ x: j * 24, y: idx * 75 }} keyPrefix={`b${idx}-${j}`} />
                            );
                        });
                    }
                    if (b.type === 'img') {
                        return (
                            <PhysicsItem key={idx} options={{ density: 0.0004, restitution: 0.6 }} initial={{ x: 0, y: idx * 75 }}>
                                {b.el}
                            </PhysicsItem>
                        );
                    }
                    return (
                        <PhysicsText key={idx} text={b.text} className={b.className} itemOptions={{ density: 0.0004, restitution: 0.6 }} initial={{ x: 0, y: idx * 75 }} keyPrefix={`b${idx}`} />
                    );
                })}
            </PhysicsWorld>
        </>
        }

        {
            currentState !== ButtonState.storm && <>
                {blocks.map((b, idx) => {
                    if (b.type === 'h1') return <h1 key={idx} className={b.className}>{b.text}</h1>;
                    if (b.type === 'p') return <p key={idx} className={b.className}>{b.text}</p>;
                    if (b.type === 'row') return (
                        <div key={idx} className="flex gap-4 pt-4">
                            {b.items.map((it: any, j: number) => {
                                if (it.type === 'img') return <span key={`it-${idx}-${j}`}>{it.el}</span>;
                                if (it.type === 'h3') return <h3 key={`it-${idx}-${j}`} className={it.className}>{it.text}</h3>;
                                return null;
                            })}
                        </div>
                    );
                    return null;
                })}
            </>
        }
        <div className="md:flex gap-4 items-center">
            <div className="flex gap-4 items-center">
                <Button onClick={onCoolButton} className="cursor-pointer"><ThumbsUp></ThumbsUp> {coolButtonText}</Button>
                <Button onClick={onLameButton} className="cursor-pointer"><ThumbsDown></ThumbsDown> {lameButtonText}</Button>
            </div>
            <AnimatePresence mode="wait">
                <motion.span
                    key={helpText}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="mt-4 md:mt-0">
                        {helpText}
                    </div>
                </motion.span>
            </AnimatePresence>
        </div>
    </>
}
