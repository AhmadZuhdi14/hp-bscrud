const API_URL = "http://localhost:9000/books";

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("bookForm")) {
        loadBooks();
        document.getElementById("bookForm").addEventListener("submit", addBook);
    }

    if (document.getElementById("bookDetail")) {
        loadBookDetail();
    }

    if (document.getElementById("editBookForm")) {
        loadEditBook();
        document.getElementById("editBookForm").addEventListener("submit", updateBook);
    }
});

// **1. Load Daftar Buku**
async function loadBooks() {
    const response = await fetch(API_URL);
    const data = await response.json();
    const bookList = document.getElementById("bookList");
    bookList.innerHTML = "";

    data.data.books.forEach((book) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${book.id}</td>
            <td>${book.name}</td>
            <td>${book.publisher}</td>
            <td class="action-btn">
                <button class="view" onclick="goToDetail('${book.id}')">Lihat</button>
                <button class="edit" onclick="goToEdit('${book.id}')">Edit</button>
                <button class="delete" onclick="deleteBook('${book.id}')">Hapus</button>
            </td>
        `;
        bookList.appendChild(tr);
    });
}

// **2. Tambah Buku**
function getFormData() {
    return {
        name: document.getElementById("name").value,
        year: parseInt(document.getElementById("year").value),
        author: document.getElementById("author").value,
        publisher: document.getElementById("publisher").value,
        summary: document.getElementById("summary").value,
        pageCount: parseInt(document.getElementById("pageCount").value),
        readPage: parseInt(document.getElementById("readPage").value),
        reading: document.getElementById("reading").checked
    };
}

async function addBook(e) {
    e.preventDefault();
    const book = getFormData();

    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
    });

    if (response.ok) {
        document.getElementById("bookForm").reset();
        loadBooks();
    }
}

// **3. Hapus Buku**
async function deleteBook(id) {
    if (!confirm("Yakin ingin menghapus buku ini?")) return;

    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    if (response.ok) {
        loadBooks();
    }
}

// **4. Pindah ke Halaman Detail**
function goToDetail(id) {
    window.location.href = `detail.html?id=${id}`;  
}

// **5. Tampilkan Detail Buku**
async function loadBookDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const response = await fetch(`${API_URL}/${id}`);
    const data = await response.json();
    const book = data.data.book;

    const bookDetail = document.getElementById("bookDetail");
    bookDetail.innerHTML = `
        <tr><td>ID Buku</td><td>${book.id}</td></tr>
        <tr><td>Nama Buku</td><td>${book.name}</td></tr>
        <tr><td>Tahun Terbit</td><td>${book.year}</td></tr>
        <tr><td>Penerbit</td><td>${book.publisher}</td></tr>
        <tr><td>Ringkasan</td><td>${book.summary}</td></tr>
        <tr><td>Total Halaman</td><td>${book.pageCount}</td></tr>
        <tr><td>Halaman Dibaca</td><td>${book.readPage}</td></tr>
        <tr><td>Selesai Dibaca</td><td>${book.finished ? "Ya" : "Tidak"}</td></tr>
        <tr><td>Masih Dibaca</td><td>${book.reading ? "Ya" : "Tidak"}</td></tr>
        <tr><td>Tahun Input</td><td>${book.insertedAt}</td></tr>
        <tr><td>Tahun Ubah</td><td>${book.updatedAt}</td></tr>
    `;
}

// **6. Muat Data ke Form**
function goToEdit(id) {
    window.location.href = `edit.html?id=${id}`;
}

// **7. Muat Data ke Form Edit**
async function loadEditBook() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const response = await fetch(`${API_URL}/${id}`);
    const data = await response.json();
    const book = data.data.book;

    document.getElementById("bookId").value = book.id;
    document.getElementById("editName").value = book.name;
    document.getElementById("editYear").value = book.year;
    document.getElementById("editAuthor").value = book.author;
    document.getElementById("editPublisher").value = book.publisher;
    document.getElementById("editSummary").value = book.summary;
    document.getElementById("editPageCount").value = book.pageCount;
    document.getElementById("editReadPage").value = book.readPage;
    document.getElementById("editReading").checked = book.reading;
}

// **8. Simpan Perubahan Buku**
async function updateBook(e) {
    e.preventDefault();
    const id = document.getElementById("bookId").value;
    const updatedBook = {
        name: document.getElementById("editName").value,
        year: parseInt(document.getElementById("editYear").value),
        author: document.getElementById("editAuthor").value,
        publisher: document.getElementById("editPublisher").value,
        summary: document.getElementById("editSummary").value,
        pageCount: parseInt(document.getElementById("editPageCount").value),
        readPage: parseInt(document.getElementById("editReadPage").value),
        reading: document.getElementById("editReading").checked,
    };

    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBook),
    });

    if (response.ok) {
        alert("Buku berhasil diperbarui!");
        window.location.href = "index.html";
    }
}

// karena eslint menganggapnya tidak digunakan
window.goToDetail = goToDetail;
window.goToEdit = goToEdit;
window.deleteBook = deleteBook;