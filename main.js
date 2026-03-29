// RUN AFTER PAGE LOAD
document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // FORM (SAVE CONTACT)
    // =========================
    let form = document.getElementById("contactForm");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            let name = document.getElementById("name").value.trim();
            let email = document.getElementById("email").value.trim();
            let phone = document.getElementById("phone").value.trim();
            let department = document.getElementById("department").value.trim();
            let position = document.getElementById("position").value.trim();

            //  VALIDATION
            if (!name || !email || !phone || !department || !position) {
                alert("Please fill all fields!");
                return;
            }

            let contact = { name, email, phone, department, position };

            let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
            contacts.push(contact);

            localStorage.setItem("contacts", JSON.stringify(contacts));

            alert("Contact saved successfully!");
            form.reset();
        });
    }

    // =========================
    // VIEW CONTACTS PAGE
    // =========================
    if (document.getElementById("tableBody") && !document.getElementById("totalContacts")) {
        loadContacts();
    }

    // =========================
    // DASHBOARD PAGE
    // =========================
    if (document.getElementById("totalContacts")) {
        loadDashboard();
    }
});


// =========================
// LOAD CONTACTS (TABLE PAGE)
// =========================
function loadContacts() {
    let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    let table = document.getElementById("tableBody");

    if (!table) return;

    //  EMPTY STATE
    if (contacts.length === 0) {
        table.innerHTML = "<tr><td colspan='5'>No contacts found</td></tr>";
        return;
    }

    // BETTER RENDERING
    let rows = "";

    contacts.forEach((contact, index) => {
        rows += `
            <tr>
                <td>${contact.name}</td>
                <td>${contact.email}</td>
                <td>${contact.phone}</td>
                <td>${contact.department}</td>
                <td>
                    <button onclick="viewDetails(${index})">Details</button>
                    <button onclick="editContact(${index})">Edit</button>
                    <button onclick="deleteContact(${index})">Delete</button>
                </td>
            </tr>
        `;
    });

    table.innerHTML = rows;
}


// =========================
// DASHBOARD FUNCTION
// =========================
function loadDashboard() {
    let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

    // TOTAL CONTACTS
    let total = document.getElementById("totalContacts");
    if (total) {
        total.textContent = contacts.length;
    }

    // UNIQUE DEPARTMENTS
    let departments = new Set(contacts.map(c => c.department));
    let deptCount = document.getElementById("totalDepartments");
    if (deptCount) {
        deptCount.textContent = departments.size;
    }

    // RECENT CONTACTS TABLE
    let table = document.getElementById("tableBody");

    if (table) {
        if (contacts.length === 0) {
            table.innerHTML = "<tr><td colspan='4'>No recent contacts</td></tr>";
            return;
        }

        let rows = "";

        contacts.slice(-5).reverse().forEach(contact => {
            rows += `
                <tr>
                    <td>${contact.name}</td>
                    <td>${contact.email}</td>
                    <td>${contact.phone}</td>
                    <td>${contact.department}</td>
                </tr>
            `;
        });

        table.innerHTML = rows;
    }
}


// =========================
// VIEW DETAILS
// =========================
function viewDetails(index) {
    let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    let c = contacts[index];

    if (!c) return;

    alert(
        "Name: " + c.name +
        "\nEmail: " + c.email +
        "\nPhone: " + c.phone +
        "\nDepartment: " + c.department +
        "\nPosition: " + c.position
    );
}


// =========================
// DELETE CONTACT
// =========================
function deleteContact(index) {
    let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

    if (confirm("Are you sure you want to delete?")) {
        contacts.splice(index, 1);
        localStorage.setItem("contacts", JSON.stringify(contacts));

        loadContacts();
        loadDashboard();
    }
}


// =========================
// EDIT CONTACT (FULL EDIT)
// =========================
function editContact(index) {
    let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    let c = contacts[index];

    if (!c) return;

    let newName = prompt("Edit Name:", c.name);
    let newEmail = prompt("Edit Email:", c.email);
    let newPhone = prompt("Edit Phone:", c.phone);
    let newDept = prompt("Edit Department:", c.department);
    let newPosition = prompt("Edit Position:", c.position);

    // If user cancels any prompt → stop editing
    if (newName === null || newEmail === null || newPhone === null || newDept === null || newPosition === null) {
        return;
    }

    //  VALIDATION
    if (!newName || !newEmail || !newPhone || !newDept || !newPosition) {
        alert("All fields are required!");
        return;
    }

    contacts[index] = {
        name: newName,
        email: newEmail,
        phone: newPhone,
        department: newDept,
        position: newPosition
    };

    localStorage.setItem("contacts", JSON.stringify(contacts));

    alert("Contact updated successfully!");

    loadContacts();
    loadDashboard();
}