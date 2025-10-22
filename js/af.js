// af.js
jsPlumb.ready(function () {
  const instance = jsPlumb.getInstance({
    Connector: ["Bezier", { curviness: 50 }],
    PaintStyle: { stroke: "#3498db", strokeWidth: 3 },
    Endpoint: ["Dot", { radius: 5 }],
    EndpointStyle: { fill: "#3498db" },
    Anchors: ["Continuous", "Continuous"],
    Container: "canvas",
  });

  const canvas = document.getElementById("canvas");
  let stateCounter = 0;
  let selectedElement = null;
  let addingTransition = false;

  // ---- Create a new state ----
  function addState(x = 100, y = 100) {
    stateCounter++;
    const state = document.createElement("div");
    state.classList.add("state");
    state.id = "state" + stateCounter;
    state.innerText = "q" + stateCounter;
    state.style.position = "absolute";
    state.style.left = x + "px";
    state.style.top = y + "px";

    canvas.appendChild(state);

    // Make draggable
    instance.draggable(state);

    // Allow connections
    instance.makeSource(state, {
      filter: ".state",
      anchor: "Continuous",
      connectorStyle: { stroke: "#2c3e50", strokeWidth: 2 },
      maxConnections: -1,
    });

    instance.makeTarget(state, {
      dropOptions: { hoverClass: "dragHover" },
      anchor: "Continuous",
      allowLoopback: true,
    });

    // Click logic
    state.addEventListener("click", () => {
      if (addingTransition) {
        if (!selectedElement) {
          selectedElement = state;
          state.style.background = "#e74c3c"; // highlight start
        } else {
          // connect selected → current
          instance.connect({
            source: selectedElement,
            target: state,
            overlays: [
              [
                "Label",
                {
                  label: prompt("Transition symbol:", "a") || "",
                  id: "label",
                  cssClass: "transition-label",
                  location: 0.5
                },
              ],
            ],
          });
          selectedElement.style.background = "#3498db";
          selectedElement = null;
          addingTransition = false;
        }
      } else {
        // Select for removal
        if (selectedElement) selectedElement.style.background = "#3498db";
        selectedElement = state;
        state.style.background = "#2ecc71"; // highlight selection
      }
    });

    return state;
  }

  // ---- Button handlers ----
  document.getElementById("addStateBtn").addEventListener("click", () => {
    addState(150 + stateCounter * 70, 150);
  });

  document.getElementById("addTransitionBtn").addEventListener("click", () => {
    addingTransition = true;
    if (selectedElement) {
      selectedElement.style.background = "#3498db";
      selectedElement = null;
    }
  });

  document.getElementById("removeBtn").addEventListener("click", () => {
    if (selectedElement) {
      instance.remove(selectedElement);
      selectedElement = null;
    }
  });

  // ---- Initial state ----
  addState(150, 150);
});
