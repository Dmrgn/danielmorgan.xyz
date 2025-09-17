"use client"

import rehypePrism from 'rehype-prism-plus';
import { useRef, useState } from "react"
import { X, Play, Save, Settings, File, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SidebarTrigger } from "./ui/sidebar"
import type { Tab } from "./CodeEditorPage"
import { default as TextAreaHighlighted } from '@uiw/react-textarea-code-editor';
import { useScriptedWindow } from '../lib/useScriptedWindow';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface CodeEditorProps {
    tabs: Tab[]
    activeTab?: string
    onTabChange: (tabId: string) => void
    onTabClose: (tabId: string) => void
    onContentChange: (tabId: string, content: string) => void
}

const getLanguageFromPath = (path: string): string => {
    const ext = path.split(".").pop()?.toLowerCase()
    switch (ext) {
        case "js":
        case "jsx":
            return "javascript"
        case "ts":
        case "tsx":
            return "typescript"
        case "css":
            return "css"
        case "html":
            return "html"
        case "json":
            return "json"
        case "md":
            return "markdown"
        default:
            return "text"
    }
}

export function CodeEditor({ tabs, activeTab, onTabChange, onTabClose, onContentChange }: CodeEditorProps) {
    const [content, setContent] = useState<Record<string, string>>({});
    const [isScriptedWindowOpen, setIsScriptedWindowOpen] = useState<boolean>(false);

    const scriptedWindow = useRef(null);
    const currentTab = tabs.find((tab) => tab.id === activeTab);
    let scriptedWindowCleanup = useRef(() => { });

    const startScriptedWindow = () => {
        setIsScriptedWindowOpen(true);
        scriptedWindowCleanup.current = useScriptedWindow(scriptedWindow, currentTab.content as string);
    }
    const onCloseScriptedWindow = () => {
        scriptedWindowCleanup.current();
        setIsScriptedWindowOpen(false);
    }

    const handleContentChange = (value: string) => {
        if (currentTab) {
            setContent((prev) => ({ ...prev, [currentTab.id]: value }));
            onContentChange(currentTab.id, value);
        }
    }

    return (
        <div className="flex flex-col h-full w-full overflow-clip">
            {/* Scripted Window */}
            <div className='absolute z-[100] pt-8 bg-white rounded-t-[var(--radius)] rounded-b-[var(--radius)] overflow-clip shadow-md' style={{ cursor: "grab", top: "0px", left: "0px" }} ref={scriptedWindow}></div>

            {/* Tab Bar */}
            <div className="flex items-center bg-secondary-foreground border-border">
                <div className="flex items-center overflow-x-auto">
                    <SidebarTrigger className="mx-1" />
                    {tabs.map((tab) => (
                        <div
                            key={tab.id}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 text-sm border-screenr border-border cursor-pointer group min-w-0 rounded-t-md",
                                activeTab === tab.id
                                    ? "bg-background text-foreground"
                                    : "bg-card/50 text-card-foreground hover:bg-background/50",
                            )}
                            onClick={() => onTabChange(tab.id)}
                        >
                            <span className="truncate max-w-32">{tab.name}</span>
                            {tab.isDirty && <div className="w-2 h-2 bg-primary rounded-full" />}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-4 h-4 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onTabClose(tab.id)
                                }}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-2 ml-auto px-2">
                    {currentTab && typeof currentTab.content === "string" &&
                        (
                            isScriptedWindowOpen ?
                                <Button variant="ghost" size="sm" onClick={onCloseScriptedWindow}>
                                    <Pause className="w-4 h-4" />
                                </Button>
                                : <Button variant="ghost" size="sm" onClick={startScriptedWindow}>
                                    <Play className="w-4 h-4" />
                                </Button>

                        )
                    }
                    <Tooltip>
                        <TooltipTrigger>
                            <Button disabled variant="ghost" size="sm">
                                <Save className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className='mr-2'>
                            Saving is disabled in this repository.
                        </TooltipContent>
                    </Tooltip>
                    <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 relative w-full">
                {currentTab ? (
                    <div className="h-full w-full">
                        {typeof currentTab.content === 'string' ?
                            <div className='max-h-[92vh] overflow-y-auto'>
                                <TextAreaHighlighted
                                    value={content[currentTab.id] || currentTab.content}
                                    onChange={(e) => handleContentChange(e.target.value)}
                                    placeholder="Start typing..."
                                    padding={15}
                                    language='ts'
                                    rehypePlugins={[
                                        [rehypePrism, { showLineNumbers: true }]
                                    ]}
                                    style={{
                                        backgroundColor: "#00000000",
                                        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                                        fontWeight: 'bolder',
                                        fontSize: '14px'
                                    }}
                                    spellCheck={false}
                                />
                            </div>
                            : <div className='overflow-y-auto max-h-[92vh] w-full'>
                                <div className='p-8 prose prose-invert w-full'>
                                    {currentTab.content}
                                </div>
                            </div>
                        }
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-foreground bg-background">
                        <div className="text-center">
                            <File className="w-12 h-12 mx-auto mb-4 text-white" />
                            <p className="text-lg font-medium text-foreground">No file selected</p>
                            <p className="text-sm text-white">Select a file from the explorer to start editing</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-between px-4 py-1 bg-card border-t border-border text-xs text-card-foreground">
                <div className="flex items-center gap-4">
                    {currentTab && (
                        <>
                            <span>{getLanguageFromPath(currentTab.path)}</span>
                            <span>UTF-8</span>
                            <span>LF</span>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <span>Ln 1, Col 1</span>
                    <span>Spaces: 2</span>
                </div>
            </div>
        </div>
    )
}
