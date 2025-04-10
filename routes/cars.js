const Car = require('../models/Car');
const express = require('express');
const router = express.Router();

// Додати авто
router.post('/', async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).send(car);
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: 'Не вдалося додати авто', error: err });
  }
});

// Отримати всі авто
router.get('/', async (req, res) => {
  try {
    const { brand, model, search } = req.query;
    let filter = {};

    if (brand) filter.brand = brand;
    if (model) filter.model = model;
    if (search) {
      filter.$or = [
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
      ];
    }

    const cars = await Car.find(filter);
    res.json(cars);
  } catch (err) {
    res.status(500).send({ message: 'Помилка при отриманні авто', error: err });
  }
});

module.exports = router;

// Редагування авто
router.put('/:id', async (req, res) => {
    try {
      const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedCar);
    } catch (err) {
      res.status(400).json({ message: 'Помилка при редагуванні авто' });
    }
  });
  
  // Видалення авто
  router.delete('/:id', async (req, res) => {
    try {
      await Car.findByIdAndDelete(req.params.id);
      res.json({ message: 'Авто видалено' });
    } catch (err) {
      res.status(400).json({ message: 'Помилка при видаленні авто' });
    }
  });
  