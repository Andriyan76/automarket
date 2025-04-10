document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('addCarForm');
  const carList = document.getElementById('carList');
  const search = document.getElementById('search');
  const brandFilter = document.getElementById('brandFilter');
  const maxPrice = document.getElementById('maxPrice');
  const minYear = document.getElementById('minYear');
  const formTitle = document.getElementById('formTitle');

  const API = '/api/cars';
  let cars = [];
  let editId = null;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newCar = {
      brand: document.getElementById('brand').value,
      model: document.getElementById('model').value,
      year: Number(document.getElementById('year').value),
      price: Number(document.getElementById('price').value),
      image: document.getElementById('image').value
    };

    try {
      if (editId) {
        await fetch(`${API}/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCar)
        });
        editId = null;
        formTitle.textContent = 'Додати автомобіль';
      } else {
        await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCar)
        });
      }

      form.reset();
      loadCars();
    } catch (err) {
      alert('Помилка при збереженні авто');
      console.error(err);
    }
  });

  [search, brandFilter, maxPrice, minYear].forEach(el =>
    el.addEventListener('input', renderCars)
  );
  brandFilter.addEventListener('change', renderCars);

  async function loadCars() {
    try {
      const res = await fetch(API);
      cars = await res.json();
      renderCars();
    } catch (err) {
      carList.innerHTML = '<p>Помилка при завантаженні авто</p>';
      console.error(err);
    }
  }

  function renderCars() {
    const keyword = search.value.toLowerCase();
    const brand = brandFilter.value;
    const max = maxPrice.value;
    const min = minYear.value;

    carList.innerHTML = '';

    cars
      .filter(car =>
        (car.brand.toLowerCase().includes(keyword) || car.model.toLowerCase().includes(keyword)) &&
        (!brand || car.brand === brand) &&
        (!max || car.price <= Number(max)) &&
        (!min || car.year >= Number(min))
      )
      .forEach(car => {
        const div = document.createElement('div');
        div.className = 'car-card';
        div.innerHTML = `
          <img src="${car.image}" alt="${car.brand} ${car.model}" />
          <h3>${car.brand} ${car.model}</h3>
          <p>Рік: ${car.year}</p>
          <p>Ціна: $${car.price}</p>
          <div class="button-group">
            <button class="edit-btn" data-id="${car._id}">✏️ Редагувати</button>
            <button class="delete-btn" data-id="${car._id}">🗑️ Видалити</button>
          </div>
        `;
        carList.appendChild(div);
      });

    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.dataset.id;
        const car = cars.find(c => c._id === id);
        document.getElementById('brand').value = car.brand;
        document.getElementById('model').value = car.model;
        document.getElementById('year').value = car.year;
        document.getElementById('price').value = car.price;
        document.getElementById('image').value = car.image;
        editId = id;
        formTitle.textContent = 'Редагувати авто';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', async () => {
        const id = button.dataset.id;
        if (confirm('Видалити це авто?')) {
          await fetch(`${API}/${id}`, { method: 'DELETE' });
          loadCars();
        }
      });
    });
  }

  loadCars();
});



