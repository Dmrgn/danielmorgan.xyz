"use client"

import { useState } from "react"
import { FileTree } from "./FileTree"
import { CodeEditor } from "./CodeEditor"
import { LoadingCard } from "./LoadingCard"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarProvider } from "./ui/sidebar"
import { Github, Linkedin, Mail, User } from "lucide-react"
import ReadMe from "./files/Readme"
import Projects from "./files/Projects"
import { fileContents, files } from "./files/manifest"

export interface Tab {
    id: string
    name: string
    path: string
    content: React.ReactNode
    language: string
    isDirty: boolean
}

export default function CodeEditorPage() {
    const [tabs, setTabs] = useState<Tab[]>([{
        id: `tab-${Date.now()}`,
        name: "README.md",
        path: "README.md",
        content: fileContents["README.md"],
        language: "md",
        isDirty: false,
    }])
    const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id)
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const handleFileSelect = (path: string) => {
        // Check if tab already exists
        const existingTab = tabs.find((tab) => tab.path === path)
        if (existingTab) {
            setActiveTab(existingTab.id)
            return
        }

        // Create new tab
        const fileName = path.split("/").pop() || path
        const content: React.ReactNode = fileContents[path] || <p>// Content for ${fileName}</p>
        const newTab: Tab = {
            id: `tab-${Date.now()}`,
            name: fileName,
            path,
            content,
            language: path.split(".").pop() || "text",
            isDirty: false,
        }

        setTabs((prev) => [...prev, newTab])
        setActiveTab(newTab.id)
    }

    const handleTabClose = (tabId: string) => {
        setTabs((prev) => {
            const newTabs = prev.filter((tab) => tab.id !== tabId)
            if (activeTab === tabId && newTabs.length > 0) {
                setActiveTab(newTabs[newTabs.length - 1].id)
            } else if (newTabs.length === 0) {
                setActiveTab(undefined)
            }
            return newTabs
        })
    }

    const handleContentChange = (tabId: string, content: string) => {
        setTabs((prev) =>
            prev.map((tab) => (tab.id === tabId ? { ...tab, content, isDirty: content !== fileContents[tab.path] } : tab)),
        )
    }

    function onLoadingFinished() {
        setIsLoading(false);
    }

    return (
        <div className="h-screen w-screen bg-background">
            {isLoading && (
                <div className="fixed top-0 left-0 w-screen h-screen overflow-clip bg-black/50 backdrop-blur-sm z-100 flex items-center justify-center">
                    <LoadingCard onFinished={onLoadingFinished} />
                </div>
            )}
            <div>
                <SidebarProvider>
                    <Sidebar variant="floating">
                        <SidebarContent>
                            <FileTree
                                files={files}
                                onFileSelect={handleFileSelect}
                                selectedFile={tabs.find((tab) => tab.id === activeTab)?.path}
                            />
                        </SidebarContent>
                        <SidebarFooter>
                            <a href="mailto:me@danielmorgan.xyz" target="_blank" className="flex mx-2 mt-2 cursor-pointer hover:underline">
                                <Mail className="mr-2" />
                                me@danielmorgan.xyz
                            </a>
                            <a href="https://linkedin.danielmorgan.xyz" target="_blank" className="flex mx-2 mt-2 cursor-pointer hover:underline">
                                <Linkedin className="mr-2" />
                                Daniel Morgan
                            </a>
                            <a href="https://github.com/dmrgn" target="_blank" className="flex m-2 cursor-pointer hover:underline">
                                <Github className="mr-2" />
                                dmrgn/portfolio
                            </a>
                        </SidebarFooter>
                    </Sidebar>
                    <div className="w-full">
                        <CodeEditor
                            tabs={tabs}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                            onTabClose={handleTabClose}
                            onContentChange={handleContentChange}
                        />
                    </div>
                </SidebarProvider>
            </div>
        </div>
    )
}