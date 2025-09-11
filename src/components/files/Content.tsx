import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react"
import StormOverlay from "../StormOverlay";
import { PhysicsItem, PhysicsWorld } from "../PhysicsWorld";

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

    const chips = Array.from({ length: 12 }, (_, i) => i);

    return <>
        {currentState === ButtonState.storm && <>
            <StormOverlay
                isOpen
                durationMs={5_000}       // default is 30s
                fadeOutAtEnd
                overlayOpacity={0.9}
                onFinished={() => {
                    setTimeout(() => {
                        setCurrentState(ButtonState.init);
                        setHelpText("");
                    }, 2000)
                }}
            />
            <PhysicsWorld className="h-[80vh] min-w-[700px]" gravity={1.2} restitution={0.35}>
                {/* Try heavier/lighter shapes */}
                <PhysicsItem options={{ density: 0.004, restitution: 0.6 }} initial={{ x: 0, y: 0 }}>
                    <h1 className="w-full max-w-[65ch]">Hi, I'm Daniel Morgan</h1>
                </PhysicsItem>
                <PhysicsItem options={{ density: 0.004, restitution: 0.6 }} initial={{ x: 0, y: 75 }}>
                    <p className="max-w-[65ch]">I'm not a student, I'm a professional software developer that takes courses (and happens to have a 3.8/4.0 GPA).</p>
                </PhysicsItem>
                <PhysicsItem options={{ density: 0.004, restitution: 0.6 }} initial={{ x: 0, y: 150 }}>
                    <img className="w-8 mt-0 mb-0 max-w-[65ch]" src="https://thundr.ca/thundr.png" alt="thundr logo" />
                </PhysicsItem>
                <PhysicsItem options={{ density: 0.004, restitution: 0.6 }} initial={{ x: 50, y: 150 }}>
                    <h3 className="mt-0 mb-0 max-w-[65ch]">What is thundr.ca?</h3>
                </PhysicsItem>
                <PhysicsItem options={{ density: 0.004, restitution: 0.6 }} initial={{ x: 0, y: 200 }}>
                    <p className="max-w-[65ch]">thundr is a software as a service (Saas) company which extensively automates the creation, maintenance and sale of websites for small construction and home service businesses.</p>
                </PhysicsItem>
                <PhysicsItem options={{ density: 0.004, restitution: 0.6 }} initial={{ x: 0, y: 350 }}>
                    <p className="max-w-[65ch]">I solo developed thundr from scratch over the course of a year, iterating over 3 major prototypes and over 250 websites built.</p>
                </PhysicsItem>
                <PhysicsItem options={{ density: 0.004, restitution: 0.6 }} initial={{ x: 0, y: 450 }}>
                    <p className="max-w-[65ch]">thundr's stack includes Nuxt, Vue, Typescript, Tailwind, payment integration (Stripe), emailing (NodeMailer), DNS & proxy (Traefik), web scraping (Puppeteer), Amazon S3, machine learning (Tensorflow), and Prisma + CockroachDB.</p>
                </PhysicsItem>
                <PhysicsItem options={{ density: 0.004, restitution: 0.6 }} initial={{ x: 0, y: 550 }}>
                    <p className="max-w-[65ch]">Sites made with thundr have amassed thousands of visitors per month.</p>
                </PhysicsItem>
                <PhysicsItem options={{ density: 0.004, restitution: 0.6 }} initial={{ x: 0, y: 650 }}>
                    <p className="max-w-[65ch]">I recently raised funding with support from a multi-billion dollar venture capitalist firm to bring thundr to 10,000 small businesses across Canada. </p>
                </PhysicsItem>
            </PhysicsWorld>
        </>
        }

        {
            currentState !== ButtonState.storm && <>
                <h1 className="w-full">Hi, I'm Daniel Morgan</h1>
                <p>I'm not a student, I'm a professional software developer that takes courses (and happens to have a 3.8/4.0 GPA).</p>
                <div className="flex gap-4 pt-4">
                    <img className="w-8 mt-0 mb-0" src="https://thundr.ca/thundr.png" alt="thundr logo" />
                    <h3 className="mt-0 mb-0">What is thundr.ca?</h3>
                </div>
                <p>thundr is a software as a service (Saas) company which extensively automates the creation, maintenance and sale of websites for small construction and home service businesses.</p>
                <p>I solo developed thundr from scratch over the course of a year, iterating over 3 major prototypes and over 250 websites built.</p>
                <p>thundr's stack includes Nuxt, Vue, Typescript, Tailwind, payment integration (Stripe), emailing (NodeMailer), DNS & proxy (Traefik), web scraping (Puppeteer), Amazon S3, machine learning (Tensorflow), and Prisma + CockroachDB.</p>
                <p>Sites made with thundr have amassed thousands of visitors per month.</p>
                <p>I recently raised funding with support from a multi-billion dollar venture capitalist firm to bring thundr to 10,000 small businesses across Canada. </p>
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