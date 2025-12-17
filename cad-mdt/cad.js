document.getElementById("officer").innerText =
  localStorage.getItem("officer");

function openSection(section) {
  const content = document.getElementById("content");
  if (section === "bolos") {
    content.innerHTML = `
      <h2>BOLOs</h2>
      <input id="boloText" placeholder="Suspect / Vehicle">
      <button onclick="addBolo()">Add</button>
      <ul id="boloList"></ul>`;
    loadBolos();
  }
}

function addBolo() {
  let bolos = JSON.parse(localStorage.getItem("bolos")) || [];
  bolos.push(document.getElementById("boloText").value);
  localStorage.setItem("bolos", JSON.stringify(bolos));
  loadBolos();
}

function loadBolos() {
  let bolos = JSON.parse(localStorage.getItem("bolos")) || [];
  document.getElementById("boloList").innerHTML =
    bolos.map(b => `<li>${b}</li>`).join("");
}
