// creates a canvas which is 200x200 and can be dragged around the editor window
export function useScriptedWindow(element: React.RefObject<HTMLElement>, script: string) {

    // create a child canvas inside of element
    const canvas = document.createElement("canvas");
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    element.current.addEventListener("mousedown", (e)=> {
        isDragging = true; 
        offsetX = e.clientX - element.current.getBoundingClientRect().left;
        offsetY = e.clientY - element.current.getBoundingClientRect().top;
        element.current.style.cursor = 'grabbing';
    });
    element.current.addEventListener("mouseup", (e)=> {
        isDragging = false; 
        element.current.style.cursor = 'grab';
    });
    element.current.addEventListener("mousemove", (e)=> {
        if (!isDragging) return;
        element.current.style.left = (e.clientX - offsetX) + 'px';
        element.current.style.top = (e.clientY - offsetY) + 'px';
    });

    canvas.width = 200;
    canvas.height = 200;
    canvas.className = "w-full h-full cursor-auto";
    canvas.addEventListener("mousedown", (e) => e.preventDefault())
    const ctx = canvas.getContext("2d");
    element.current.appendChild(canvas);

    // start script
    const wrappedScript = `(class Window { constructor() { ${script} } })`;
    let interval;

    function onClose() {
        clearInterval(interval);
        element.current.removeChild(canvas);
    }

    try {
        const Window = window.eval(wrappedScript);
        const scriptedWindow = new Window();
        interval = setInterval(() => {
            if (typeof scriptedWindow?.draw !== "function")
                throw new Error("No draw function was defined. E.g this.draw = (ctx) => { ... }");
            scriptedWindow.draw(ctx)
        }, 1000/30);
    } catch(e) {
        clearInterval(interval);
        console.error(e);
    }

    return onClose;
};