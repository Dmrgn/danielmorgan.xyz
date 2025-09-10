"use client"

import rehypePrism from 'rehype-prism-plus';
import { useState } from "react"
import { X, Play, Save, Settings, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SidebarTrigger } from "./ui/sidebar"
import type { Tab } from "./CodeEditorPage"
import { default as TextAreaHighlighted } from '@uiw/react-textarea-code-editor';

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
    const [content, setContent] = useState<Record<string, string>>({})

    const currentTab = tabs.find((tab) => tab.id === activeTab)

    const handleContentChange = (value: string) => {
        if (currentTab) {
            setContent((prev) => ({ ...prev, [currentTab.id]: value }))
            onContentChange(currentTab.id, value)
        }
    }

    return (
        <div className="flex flex-col h-full w-full">
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
                <div className="flex items-center gap-1 ml-auto px-2">
                    <Button variant="ghost" size="sm">
                        <Save className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                        <Play className="w-4 h-4" />
                    </Button>
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
