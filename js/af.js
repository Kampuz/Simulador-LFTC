document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvas");
    const jsPlumbInstance = jsPlumb.getInstance();
    let stateCount = 0;
    const states = {};
    let mode = "selection";
    let selectedState = null;


    document.getElementById("selectionBtn").onclick = () => { mode = "selection"; resetCursor(); };
    document.getElementById("addStateBtn").onclick = () => { mode = "addState"; resetCursor(); };
    document.getElementById("addTransitionBtn").onclick = () => { mode = "addTransition"; resetCursor(); };
    document.getElementById("removeBtn").onclick = () => { mode = "remove"; resetCursor(); };

    function resetCursor() {
        canvas.style.cursor = (mode === "addState") ? "crosshair" : "default";
    }

    jsPlumbInstance.importDefaults({
        Connector: ["Bezier", { curviness: 50}],
        Anchors: ["Continuous", "Continuous"],
        EndPoint: ["Dot", { radius: 5 }],
        PaintStyle: { stroke: "#3498db", strokeWidth: 2 },
        EndpointStyle: { fill: "#3498db" },
        HoverPaintStyle: { stroke: "#e74c3c"}
    });

    canvas.addEventListener("click", (e) => {
        if (mode !== "addState") return;
        const id = "state" + stateCount++;
        const stateEl = document.createElement("div");
        stateEl.className = "state";
        stateEl.id = id;
        stateEl.textContent = id;
        stateEl.style.top = e.offsetY - 30 + "px";
        stateEl.style.left = e.offsetX - 30 + "px";
        canvas.appendChild(stateEl);
        states[id] = { id, transitions: [] };

        jsPlumbInstance.draggable(stateEl);

        jsPlumbInstance.makeSource(stateEl, { maxConnections: -1});
        jsPlumbInstance.makeTarget(stateEl);

        stateEl.addEventListener("click", (ev) => handleStateClick(ev, stateEl));
    });

    function handleStateClick(e, stateEl) {
        e.stopPropagation();

        if (mode === "addTransition") {
            if (!selectedState) {
                selectedState = stateEl;
                stateEl.style.border = "3px solid yellow";
            } else {
                const label = prompt("Enter transition symbol:");
                if (!label) { selectedState.style.border = ""; selectedState = null; return;}
                const conn = jsPlumbInstance.connect({
                    source: selectedState.id,
                    target: stateEl.id,
                    overlays: [["label", {label, cssClass: "transition-lavel"}]]
                });
                states[selectedState.id].transitions.push({ symbol: label, target: stateEl.id});
                selectedState.style.border = "";
                selectedState = null;
            }
        } else if (mode === "remove") {
            jsPlumbInstance.select({ source: stateEl.id}).delete();
            jsPlumbInstance.select({ target: stateEl.id}).delete();

            stateEl.remove();
            delete states[stateEl.id];
        }
    }
});