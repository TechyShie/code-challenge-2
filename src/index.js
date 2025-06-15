//EventListener waits for entire html to load b4 running any javascript.
document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id),
    form = $("guestForm"),
    tbody = $("guestTableBody"),
    toast = $("toast"),
    countDisplay = $("guestCount");

  const formatName = (name) =>//Capitalizes the first letter of each name keyed in.
    name
      .trim()
      .split(" ")
      .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

  const updateCount = () => {//
    const rows = [...tbody.querySelectorAll("tr")].filter((r) => r.id !== "emptyMessage");

    rows.forEach((r, i) => (r.children[0].textContent = i + 1));//Updates the row number for each guest on the table.
    countDisplay.textContent = `Total Guests: ${rows.length}`;//Updates the total guests counter.
    if (rows.length === 0 && !$("emptyMessage")) {//Shows the no guests message if there are no guests on the list. 
      const msg = document.createElement("tr");
      msg.id = "emptyMessage";
      msg.innerHTML = `<td colspan="7" style="text-align:center;">No guests added yet 😢</td>`;
      tbody.appendChild(msg);
    }
  };

  const showToast = (msg) => {//Displays a message pop up when guest is successfully added to list.
    toast.textContent = msg;
    toast.className = "show";
    setTimeout(() => (toast.className = ""), 3000);
  };

  window.editRow = (btn) => {//THis function finds the row and is responsible for extracting the Name and category cells.
    const row = btn.closest("tr"),
      nameCell = row.children[1],
      catCell = row.children[2];

    let newName = prompt("Edit guest name:", nameCell.textContent);
    if (newName && /^[A-Za-z\s]+$/.test(newName)) nameCell.textContent = formatName(newName);
    let newCat = prompt("Edit category (Family, Friends, Colleagues):", catCell.textContent);
    if (newCat) catCell.textContent = newCat.trim();
  };

  window.deleteRow = (btn) => {//Deletes row from the table.
    btn.closest("tr").remove();
    updateCount();
  };

  window.filterGuests = () => {//Uses loop to filter through guests names and find the desired one.
    const q = $("searchInput").value.toLowerCase();
    const rows = tbody.querySelectorAll("tr");
    let visible = 0;
    rows.forEach((row) => {
      if (row.id === "emptyMessage") return;
      const match = row.children[1].textContent.toLowerCase().includes(q);
      row.style.display = match ? "" : "none";
      if (match) visible++;
    });
    countDisplay.textContent = `Total Guests: ${visible}`;
  };

  form.addEventListener("submit", (e) => {//Prevents page from refreshing each time the form is submitted.
    e.preventDefault();
    const nameVal = $("guestName").value.trim(),
      category = $("category").value;
    if (!/^[A-Za-z\s]+$/.test(nameVal)) return alert("Letters only please.");

    const name = formatName(nameVal),//FOrmart name and creates new table row then removes empty message if present.
      row = document.createElement("tr");
    $("emptyMessage")?.remove();
    row.innerHTML = `
      <td></td><td>${name}</td><td>${category}</td><td>${new Date().toLocaleString()}</td>
      <td><select><option>✅ Yes</option><option>❌ No</option></select></td>
      <td><button onclick="editRow(this)">✏️ Edit</button></td>
      <td><button onclick="deleteRow(this)">🗑️ Delete</button></td>`;
    tbody.appendChild(row);

    updateCount();//This function updates count number, shows the pop up meassage, and clears the form.
    showToast(`Guest '${name}' added!`);
    form.reset();
  });
});
