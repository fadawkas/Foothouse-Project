const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(err));

// Middleware to parse JSON
app.use(express.json());

// Inventory Schema and Model
const inventorySchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  size: { type: Number, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  warehouse: { type: String, required: true },
});

const Inventory = mongoose.model('Inventory', inventorySchema);

// Routes
app.post('/add', async (req, res) => {
  try {
    const newItem = new Inventory(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/', async (req, res) => {
  try {
    const items = await Inventory.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/:id', async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/:id', async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Item deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Start the Inventory Service
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Inventory Service running on port ${PORT}`));
