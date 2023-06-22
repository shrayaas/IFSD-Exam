const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb+srv://shrayaas:shrayaas@cluster0.hqhk5j5.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

const shopSchema = new mongoose.Schema({
  name: String,
  rent: Number,
});

const Shop = mongoose.model('Shop', shopSchema);

const app = express();
app.use(bodyParser.json());

app.post('/shops', (req, res) => {
  const { name, rent } = req.body;
  const shop = new Shop({ name, rent });

  shop.save()
    .then((savedShop) => {
      res.json(savedShop);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Failed to create shop' });
    });
});

app.get('/shops', (req, res) => {
  Shop.find()
    .then((shops) => {
      res.json(shops);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve shops' });
    });
});

app.delete('/shops/:id', (req, res) => {
  const { id } = req.params;
  Shop.findByIdAndRemove(id)
    .then((deletedShop) => {
      if (!deletedShop) {
        return res.status(404).json({ error: 'Shop not found' });
      }
      res.json(deletedShop);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete shop' });
    });
});

app.put('/shops/:id', (req, res) => {
  const { id } = req.params;
  const { name, rent } = req.body;

  Shop.findByIdAndUpdate(id, { name, rent }, { new: true })
    .then((updatedShop) => {
      if (!updatedShop) {
        return res.status(404).json({ error: 'Shop not found' });
      }
      res.json(updatedShop);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Failed to update shop' });
    });
});

app.get('/shops/total-rent', (req, res) => {
  Shop.aggregate([{ $group: { _id: null, totalRent: { $sum: '$rent' } } }])
    .then((result) => {
      const totalRent = result[0].totalRent;
      res.json({ totalRent });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Failed to calculate total rent' });
    });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
