var matrix = [];

for (let index = 0; index < 27; index++) matrix[index] = [];

function isUpperCase(char) {
    return (char.charCodeAt(0) >= 65 && char.charCodeAt(0) <= 90);
}

function getCharNumber(char) {
    return char.charCodeAt(0) - 65;
}

document.getElementById("insert-btn").addEventListener("click",() => {
    const lhs = document.getElementById("lhs").value.toUpperCase();
    let rhs = document.getElementById("rhs").value;

    if (!lhs || !isUpperCase(lhs)) return alert("Digite um não-terminal válido!");

    if (rhs === "") rhs = null;
    matrix[getCharNumber(lhs)].push(rhs);

    const tbody = document.querySelector("#rules-table tbody");
    const row = tbody.insertRow();

    row.insertCell(0).innerText = lhs;
    row.insertCell(1).innerText = "→";
    row.insertCell(2).innerText = rhs || "ε";

    const cellRemove = row.insertCell(3);
    const btnRemove = document.createElement("button");
    btnRemove.innerText = "Remover";
    btnRemove.addEventListener("click", () => {
        const rulesArray = matrix[getCharNumber(lhs)];
        const index = rulesArray.indexOf(rhs);
        if (index > -1) rulesArray.splice(index, -1);

        row.remove();
    });
    cellRemove.appendChild(btnRemove);

    document.getElementById("lhs").value = "";
    document.getElementById("rhs").value = "";
});

function matchProduction(prod, string, pos) {
    if (!prod) return pos === string.length;
    if (pos > string.length) return false;

    const first = prod[0];
    const rest = prod.slice(1);

    if (/[a-z]/.test(first)) {
        if (string[pos] === first) return matchProduction(rest, string, pos + 1);
        return false;
    }

    if (isUpperCase(first)) {
        const rules = matrix[getCharNumber(first)] || [];
        for (let r of rules) {
            if (matchProduction(r + rest, string, pos)) return true;
        }
        return false;
    }

    return false;
}

document.getElementById("validate-btn").addEventListener("click", () => {
    const word = document.getElementById("test-word").value;
    if (!word) return alert("Digite uma palavra para testar");

    const result = matchProduction("S", word, 0);
    document.getElementById("result").innerText = result ? "Palavra aceita" : "Palavra não aceita";
});