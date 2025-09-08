import { motion, type AnimationDefinition } from "motion/react"
import { useIsMobile } from "../lib/useIsMobile";

// This is a nice utility to make elements appear/disappear as they scroll in/out of view.

type ScrollWrapperProps = {
    className?: string;
    children: React.ReactNode;
    side?: "left" | "right";
    onAnimationEnd?: (definition: AnimationDefinition) => void;
};

export function ScrollWrapper({className, children, side, onAnimationEnd} : ScrollWrapperProps) {

    const isMobile = useIsMobile();

    return (
        <motion.div onAnimationComplete={onAnimationEnd ?? (()=>{})} initial={{ translateX: side === "right" ? 100 : -100, opacity: 0 }} whileInView={{ translateX: 0, opacity: 1 }} viewport={isMobile ? {} : { margin: "-10% 0px -10% 0px", amount: 0.5 }} className={className}>
            {children}
        </motion.div>
    )
}

export default ScrollWrapper;
