import React from "react";
import { PhysicsItem } from "./PhysicsWorld";

type PhysicsTextProps = {
    text: string;
    className?: string;
    /**
     * Per-item physics options (density, restitution, etc.)
     * Any fields accepted by PhysicsItem.options are fine here.
     */
    itemOptions?: any;
    /**
     * initial base position for the block. Each word will get a small x-offset
     * so words don't spawn exactly on top of each other.
     */
    initial?: { x?: number; y?: number; angle?: number };
    /**
     * An optional key prefix to ensure stable keys when same text is reused.
     */
    keyPrefix?: string;
};

/**
 * PhysicsText
 *
 * Splits `text` into words and renders each word inside its own <PhysicsItem>.
 * Spaces between words are preserved by appending a space to each word except
 * the last. Each word spawns with a small incremental x offset so they don't
 * completely overlap.
 *
 * This component is intentionally simple and focused on the "storm"/physics use-case.
 */
export default function PhysicsText({
    text,
    className,
    itemOptions,
    initial,
    keyPrefix,
}: PhysicsTextProps) {
    const words = text.match(/\S+/g) || [];

    return (
        <>
            {words.map((w, i) => {
                // preserve whitespace between words
                const wordWithSpace = i < words.length - 1 ? w + " " : w;

                // spread words horizontally a bit to avoid stack overlap
                const xOffset = (initial?.x ?? 0) + i * 12;
                const yBase = initial?.y ?? 0;

                return (
                    <PhysicsItem
                        key={`${keyPrefix ?? text}-${i}`}
                        options={itemOptions}
                        initial={{ x: xOffset, y: yBase, angle: initial?.angle }}
                        className="inline-block"
                    >
                        <span className={className} style={{ whiteSpace: "pre" }}>
                            {wordWithSpace}
                        </span>
                    </PhysicsItem>
                );
            })}
        </>
    );
}
