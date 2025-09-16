let mode = "idle";
let stateCount = 0;
let freeIds = [];
let instance;
let transitionFrom = null;
let transitions = [];

window.onload = function () {
    instance = jsPlumb.getInstance({
        Connector: ["Bezier", { curviness: 50 }],
        Anchors: ["Continuous", "Continuous"],
        Endpoint: "Dot",
        EndpointStyle: { radius: 4 },
        PaintStyle: { stroke: "#000", strokeWidth: 2 },
        Overlays: [["Arrow", { width: 12, length: 12, location: 1 }]]
    });

    const canvas = document.getElementById("canvas");

    canvas.addEventListener("click", (e) => {
        if (mode === "addState") {
            addState(e.offsetX, e.offsetY);
        }
    });
};

function setMode(newMode) {
    mode = newMode;
    document.getElementById("status").textContent = "Modo: " + mode;
    if (mode !== "addTransition" && transitionFrom) {
        resetNode(transitionFrom);
        transitionFrom = null;
    }
}

function addState(x, y) {
    const id = getNextId();
    const div = createNodeDiv(id, x, y);
    document.getElementById("canvas").appendChild(div);
    makeNodeInteractive(div);
}

function getNextId() {
    if (freeIds.length > 0) return "q" + freeIds.shift();
    return "q" + stateCount++;
}

function createNodeDiv(id, x, y) {
    const div = document.createElement("div");
    div.className = "state";
    div.id = id;
    div.style.left = (x - 30) + "px";
    div.style.top = (y - 30) + "px";
    div.innerText = id;
    return div;
}

function makeNodeInteractive(div) {
    instance.draggable(div);

    instance.makeSource(div, {
        filter: ".state",
        anchor: "Continuous",
        connectorStyle: { stroke: "#000", strokeWidth: 2 },
        maxConnections: -1
    });
    instance.makeTarget(div, {
        dropOptions: { hoverClass: "hover"},
        anchor: "Continuous"
    });

    div.addEventListener("click", (e) => {
        e.stopPropagation();
        if (mode === "addTransition") handleTransitionClick(div);
        else if (mode === "removeState") removeState(div);
    });
}

function removeState(div) {
    if (!div) return;

    if (transitionFrom === div) transitionFrom = null; 
    
    releaseId(div);

    transitions = transitions.filter(t => {
        if (t.sourceId === div.id || t.targetId === div.id) {
            instance.deleteConnection(t.connection);
            return false;
        }
        return true;
    });

    instance.remove(div, { drop : true });
}

function releaseId(div) {
    freeIds.push(parseInt(div.id.slice(1)));
    freeIds.sort((a, b) => a - b);
}

function handleTransitionClick(div) {
    if (!transitionFrom) {
        transitionFrom = div;
        highlightNode(div);
        return;
    }
    
    const symbol = prompt("Digite o símbolo da transição:");
    if (!symbol) {
        resetNode(transitionFrom);
        transitionFrom = null;
        return;
    }

    let existing = transitions.find(
        t => t.sourceId === transitionFrom.id && t.targetId === div.id
    );
    
    if (transitionFrom.id === div.id) {
            let existing = transitions.find(t => t.sourceId === div.id && t.targetId === div.id);
            if (existing) {
                existing.symbols.push(symbol);
                existing.connection.getOverlay("label").setLabel(existing.symbols.join("\n"));
            } else {
                const connection = instance.connect({
                    source: div,
                    target: div,
                    anchors: ["TopCenter", "TopCenter"],
                    connector: ["Bezier", { curviness: 100}],
                    overlays: [
                        ["Arrow", { width: 12, length: 12, location: 1}],
                        ["Label", { label: symbol, location: 0.5, cssClass: "transition-label" }]
                    ]
                });
        
                transitions.push({
                    sourceId: transitionFrom.id,
                    targetId: div.id,
                    symbol: [symbol],
                    connection: connection
                });
            }
        } else {
            const connection = instance.connect({
                source: transitionFrom,
                target: div,
                anchors: ["Continuous", "Continuous"],
                connector: ["Bezier", { curviness: 50}],
                overlays: [
                    ["Arrow", { width: 12, length: 12, location: 1}],
                    ["Label", { label: symbol, id:"label", location: 0.5, cssClass: "transition-label" }]
                ]
            });
            transitions.push({ 
                sourceId: transitionFrom.id,
                targetId: div.id,
                symbol: [symbol],
                connection });
        }

        resetNode(transitionFrom);
        transitionFrom = null;
    }
}

function highlightNode(div) {
    div.style.border = "2px dashed red";
}

function resetNode(div) {
    div.style.border = "2px solid black";
}

function clearAll() {
    transitionFrom = null;
    stateCount = 0;
    freeIds = [];

    instance.deleteEveryConnection();
    const nodes = document.querySelectorAll(".state");
    nodes.forEach(node => instance.remove(node, { drop : true }));

    document.getElementById("canvas").innerHTML = "";

    setMode("idle");
}