document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("guestForm");
  const tableBody = document.getElementById("guestTableBody");
  const emptyMessage = document.getElementById("emptyMessage");
  const guestCount = document.getElementById("guestCount");
  const toast = document.getElementById("toast");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nameInput = document.getElementById("guestName");
    const categorySelect = document.getElementById("category");

    let name = nameInput.value.trim();
    const category = categorySelect.value;
    const onlyLetters = /^[A-Za-z\s]+$/;

    if (!onlyLetters.test(name)) {
      alert("Please enter letters only. No numbers or symbols.");
      return;
    }

    name = name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    if (emptyMessage) {
      emptyMessage.remove();
    }

    const row = document.createElement("tr");
    const dateTime = new Date().toLocaleString();

    row.innerHTML = `
      <td></td>
      <td>${name}</td>
      <td>${category}</td>
      <td>${dateTime}</td>
      <td>
        <select>
          <option value="Yes">✅ Yes</option>
          <option value="No">❌ No</option>
        </select>
      </td>
      <td><button onclick="editRow(this)">✏️ Edit</button></td>
      <td><button onclick="deleteRow(this)">🗑️ Delete</button></td>
    `;

    tableBody.appendChild(row);
    updateGuestNumbers();
    form.reset();
    showToast(`Guest '${name}' added!`);
  });

  function deleteRow(button) {
    const row = button.parentElement.parentElement;
    row.remove();
    updateGuestNumbers();

    if (tableBody.rows.length === 0) {
      const msgRow = document.createElement("tr");
      msgRow.id = "emptyMessage";
      msgRow.innerHTML = `<td colspan="7" style="text-align:center;">No guests added yet 😢</td>`;
      tableBody.appendChild(msgRow);
    }
  }

  window.deleteRow = deleteRow;

  function editRow(button) {
    const row = button.parentElement.parentElement;
    const nameCell = row.children[1];
    const categoryCell = row.children[2];

    let newName = prompt("Edit guest name:", nameCell.textContent);
    if (newName && /^[A-Za-z\s]+$/.test(newName.trim())) {
      newName = newName
        .trim()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
      nameCell.textContent = newName;
    }

    const newCategory = prompt(
      "Edit category (Family, Friends, Colleagues):",
      categoryCell.textContent
    );
    if (newCategory) {
      categoryCell.textContent = newCategory.trim();
    }
  }

  window.editRow = editRow;

  function updateGuestNumbers() {
    const rows = tableBody.querySelectorAll("tr");
    let count = 0;
    rows.forEach((row) => {
      const numberCell = row.children[0];
      if (numberCell && row.id !== "emptyMessage") {
        numberCell.textContent = ++count;
      }
    });
    guestCount.textContent = `Total Guests: ${count}`;
  }

  function showToast(message) {
    toast.textContent = message;
    toast.className = "show";
    setTimeout(() => {
      toast.className = toast.className.replace("show", "");
    }, 3000);
  }

  window.filterGuests = function () {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const rows = tableBody.getElementsByTagName("tr");
    let visibleCount = 0;

    Array.from(rows).forEach((row) => {
      if (row.id === "emptyMessage") return;

      const name = row.children[1].textContent.toLowerCase();
      if (name.includes(query)) {
        row.style.display = "";
        visibleCount++;
      } else {
        row.style.display = "none";
      }
    });

    guestCount.textContent = `Total Guests: ${visibleCount}`;
  };
});
