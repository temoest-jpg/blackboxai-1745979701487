const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Paths to JSON data files
const carsFilePath = path.join(__dirname, 'data', 'cars.json');
const salesFilePath = path.join(__dirname, 'data', 'sales.json');

// Helper function to read JSON data
function readData(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

// Helper function to write JSON data
function writeData(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Get all cars
app.get('/api/cars', (req, res) => {
  const cars = readData(carsFilePath);
  res.json(cars);
});

// Add a new car
app.post('/api/cars', (req, res) => {
  const cars = readData(carsFilePath);
  const newCar = { id: Date.now(), ...req.body };
  cars.push(newCar);
  writeData(carsFilePath, cars);
  res.status(201).json(newCar);
});

// Update a car
app.put('/api/cars/:id', (req, res) => {
  const cars = readData(carsFilePath);
  const carId = parseInt(req.params.id);
  const index = cars.findIndex(car => car.id === carId);
  if (index === -1) {
    return res.status(404).json({ error: 'Car not found' });
  }
  cars[index] = { id: carId, ...req.body };
  writeData(carsFilePath, cars);
  res.json(cars[index]);
});

// Delete a car
app.delete('/api/cars/:id', (req, res) => {
  let cars = readData(carsFilePath);
  const carId = parseInt(req.params.id);
  const initialLength = cars.length;
  cars = cars.filter(car => car.id !== carId);
  if (cars.length === initialLength) {
    return res.status(404).json({ error: 'Car not found' });
  }
  writeData(carsFilePath, cars);
  res.status(204).send();
});

// Get all sales
app.get('/api/sales', (req, res) => {
  const sales = readData(salesFilePath);
  res.json(sales);
});

// Add a new sale
app.post('/api/sales', (req, res) => {
  const sales = readData(salesFilePath);
  const newSale = { id: Date.now(), ...req.body };
  sales.push(newSale);
  writeData(salesFilePath, sales);
  res.status(201).json(newSale);
});

// Serve frontend files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
