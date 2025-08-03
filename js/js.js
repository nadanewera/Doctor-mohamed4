const apiKey = "688fbe0d34a1869ccb290ae7";
let prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];

const form = document.getElementById('prescription-form');
const prescriptionsList = document.getElementById('prescriptions-list');
const loader = document.getElementById('load');

loader.style.display = 'none';

renderPrescriptions();

form.addEventListener('submit', function(event) {
    event.preventDefault();

    showLoader();

    const isEdit = form.getAttribute('data-edit-id');
    const prescription = {
        id: isEdit ? parseInt(isEdit) : Date.now(),
        apiKey: apiKey,
        name: document.getElementById('name').value,
        count: document.getElementById('count').value,
        age: document.getElementById('age').value,
        feed: document.getElementById('feed').value,
        diagnosis: document.getElementById('diagnosis').value,
        weight: document.getElementById('weight').value,
        date: document.getElementById('date').value,
        notes: document.getElementById('notes').value
    };

    if (isEdit) {
        const index = prescriptions.findIndex(p => p.id === parseInt(isEdit));
        prescriptions[index] = prescription;
        form.removeAttribute('data-edit-id');
    } else {
        prescriptions.push(prescription);
    }

    saveToLocalStorage();
    form.reset();
    renderPrescriptions();
});

function renderPrescriptions() {
    showLoader();

    setTimeout(() => {
        prescriptionsList.innerHTML = '';

        if (prescriptions.length === 0) {
            prescriptionsList.innerHTML = '<p class="text-center text-muted">لا توجد روشتات.</p>';
        } else {
            prescriptions.forEach(p => {
                const card = document.createElement('div');
                card.className = 'card mb-3 p-3 prescription-card';
                card.innerHTML = `
                    <h4 class="text-center text-danger mb-3">روشتة علاج</h4>
                    <table class="table table-bordered">
                        <tbody>
                            <tr><th>الاسم</th><td>${p.name}</td></tr>
                            <tr><th>العدد</th><td>${p.count}</td></tr>
                            <tr><th>العمر</th><td>${p.age}</td></tr>
                            <tr><th>العلف</th><td>${p.feed}</td></tr>
                            <tr><th>التشخيص</th><td>${p.diagnosis}</td></tr>
                            <tr><th>الوزن</th><td>${p.weight}</td></tr>
                            <tr><th>التاريخ</th><td>${p.date}</td></tr>
                            <tr><th>ملاحظات</th><td>${p.notes || '-'}</td></tr>
                        </tbody>
                    </table>
                    <div class="d-flex justify-content-between mt-3">
                        <div>
                            <i class="fa-solid fa-pen-to-square text-primary mx-2" style="cursor:pointer;" onclick="editPrescription(${p.id})"></i>
                            <i class="fa-solid fa-trash text-danger mx-2" style="cursor:pointer;" onclick="deletePrescription(${p.id})"></i>
                        </div>
                        <a href="https://wa.me/?text=${encodeURIComponent(formatPrescriptionText(p))}" target="_blank" class="btn btn-success">
                            <i class="fa-brands fa-whatsapp"></i> مشاركة
                        </a>
                    </div>
                `;
                prescriptionsList.appendChild(card);
            });
        }

        hideLoader();
    }, 500);
}

function formatPrescriptionText(p) {
    return `
روشتة علاج
--------------
الاسم: ${p.name}
العدد: ${p.count}
العمر: ${p.age}
العلف: ${p.feed}
التشخيص: ${p.diagnosis}
الوزن: ${p.weight}
التاريخ: ${p.date}
ملاحظات: ${p.notes || '-'}
    `;
}

function editPrescription(id) {
    const prescription = prescriptions.find(p => p.id === id);
    if (prescription) {
        document.getElementById('name').value = prescription.name;
        document.getElementById('count').value = prescription.count;
        document.getElementById('age').value = prescription.age;
        document.getElementById('feed').value = prescription.feed;
        document.getElementById('diagnosis').value = prescription.diagnosis;
        document.getElementById('weight').value = prescription.weight;
        document.getElementById('date').value = prescription.date;
        document.getElementById('notes').value = prescription.notes || '';
        form.setAttribute('data-edit-id', id);
    }
}

function deletePrescription(id) {
    showLoader();
    setTimeout(() => {
        prescriptions = prescriptions.filter(p => p.id !== id);
        saveToLocalStorage();
        renderPrescriptions();
    }, 300);
}

function saveToLocalStorage() {
    localStorage.setItem('prescriptions', JSON.stringify(prescriptions));
}

function showLoader() {
    loader.style.display = 'block';
    prescriptionsList.style.display = 'none';
}

function hideLoader() {
    loader.style.display = 'none';
    prescriptionsList.style.display = 'block';
}
