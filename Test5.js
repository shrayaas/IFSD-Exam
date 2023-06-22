const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3001; // Change the port number if needed

// Connect to MongoDB
mongoose.connect('mongodb://localhost/shopping_complex', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Shop and ShoppingComplex schemas and models
const ShopSchema = new mongoose.Schema({
  name: String,
  rent: Number,
});

const Shop = mongoose.model('Shop', ShopSchema);

const ShoppingComplexSchema = new mongoose.Schema({
  shops: [ShopSchema],
});

const ShoppingComplex = mongoose.model('ShoppingComplex', ShoppingComplexSchema);

// Set up API routes for CRUD operations
app.use(express.json());

app.get('/shoppingComplex', async (req, res) => {
  try {
    const shoppingComplex = await ShoppingComplex.findOne();
    res.json(shoppingComplex);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve shopping complex' });
  }
});

app.post('/shop', async (req, res) => {
  try {
    const shop = new Shop(req.body);
    const shoppingComplex = await ShoppingComplex.findOne();
    shoppingComplex.shops.push(shop);
    await shoppingComplex.save();
    res.json(shop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create shop' });
  }
});

app.put('/shop/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedShop = req.body;
    await ShoppingComplex.findOneAndUpdate(
      { 'shops._id': id },
      { $set: { 'shops.$': updatedShop } }
    );
    res.json(updatedShop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update shop' });
  }
});

app.delete('/shop/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await ShoppingComplex.findOneAndUpdate(
      {},
      { $pull: { shops: { _id: id } } }
    );
    res.json({ message: 'Shop deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete shop' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
