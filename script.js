let tasks = [
  { id: 1, title: 'Belajar HTML/CSS', status: 'belum' },
  { id: 2, title: 'Kerjakan tugas UX', status: 'belum' },
];

let editingId = null;

const namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];

const tampilkanTanggal = () => {
  const now = new Date();
  document.getElementById('hari').textContent = namaHari[now.getDay()];
  document.getElementById('tanggal').textContent = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const showList = () => {
  const list = document.getElementById('daftar-tugas');
  list.innerHTML = '';

  tasks.forEach((task) => {
    const li = document.createElement('li');

    if (editingId === task.id) {
      li.innerHTML = `
        <input type="text" id="edit-input-${task.id}" class="edit-input"
               value="${task.title}"
               onkeydown="handleEditKey(event, ${task.id})">
      `;
    } else {
      li.innerHTML = `
        <input type="checkbox" class="planner-checkbox"
            ${task.status === 'selesai' ? 'checked' : ''}
            onchange="toggleStatus(${task.id})">
        <span class="task-title ${task.status === 'selesai' ? 'done' : ''}">
          ${task.title}
        </span>
        <div class="task-actions">
          <button onclick="editTask(${task.id})">Edit</button>
          <button onclick="deleteTask(${task.id})">Hapus</button>
        </div>
      `;
    }

    list.appendChild(li);
  });

  if (editingId !== null) {
    const editInput = document.getElementById(`edit-input-${editingId}`);
    if (editInput) {
      editInput.focus();
      editInput.setSelectionRange(editInput.value.length, editInput.value.length);
    }
  }
};

const toggleStatus = (id) => {
  const task = tasks.find((t) => t.id === id);
  task.status = task.status === 'selesai' ? 'belum' : 'selesai';
  save();
  showList();
};

const deleteTask = (id) => {
  tasks = tasks.filter((t) => t.id !== id);
  save();
  showList();
};

const editTask = (id) => {
  editingId = id;
  showList();
};

const cancelEdit = () => {
  editingId = null;
  showList();
};

const saveEdit = (id) => {
  const input = document.getElementById(`edit-input-${id}`);
  const newTitle = input.value.trim();
  if (newTitle === '') return;

  const task = tasks.find((t) => t.id === id);
  task.title = newTitle;

  editingId = null;
  save();
  showList();
};

const handleEditKey = (event, id) => {
  if (event.key === 'Enter') {
    saveEdit(id);
  } else if (event.key === 'Escape') {
    cancelEdit();
  }
};

const save = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('catatan', document.getElementById('catatan').value);
};

const load = () => {
  const data = localStorage.getItem('tasks');
  if (data) tasks = JSON.parse(data);

  const catatan = localStorage.getItem('catatan');
  if (catatan) document.getElementById('catatan').value = catatan;
};

document.getElementById('form-tambah').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('input-tugas');
  const title = input.value.trim();
  if (title === '') return;

  const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
  tasks.push({ id: newId, title: title, status: 'belum' });

  input.value = '';
  save();
  showList();
});

document.getElementById('catatan').addEventListener('input', save);

tampilkanTanggal();
load();
showList();
