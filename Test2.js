const readline = require('readline');
const { MongoClient } = require('mongodb');

class Shop {
  constructor(name, rent) {
    this.name = name;
    this.rent = rent;
  }
}

class ShoppingComplex {
  constructor() {
    this.shops = [];
  }

  addShop(shop) {
    this.shops.push(shop);
  }

  calculateTotalRent() {
    let totalRent = 0;
    for (const shop of this.shops) {
      totalRent += shop.rent;
    }
    return totalRent;
  }
}

class Main {
  static async main() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const shoppingComplex = new ShoppingComplex();

    rl.question('Enter the number of shops in the complex: ', async (numShops) => {
      const num = parseInt(numShops);
      if (isNaN(num) || num <= 0) {
        console.log('Invalid number of shops. Program exiting.');
        rl.close();
        return;
      }

      let shopCount = 0;

      const inputShopDetails = () => {
        rl.question(`Enter the name of Shop ${shopCount + 1}: `, async (shopName) => {
          rl.question(`Enter the rent of Shop ${shopCount + 1}: `, async (shopRent) => {
            const rent = parseFloat(shopRent);
            if (isNaN(rent) || rent < 0) {
              console.log('Invalid rent. Please enter a valid positive number.');
              inputShopDetails();
              return;
            }

            const shop = new Shop(shopName, rent);
            shoppingComplex.addShop(shop);

            shopCount++;

            if (shopCount < num) {
              inputShopDetails();
            } else {
              rl.close();

              try {
                const client = await MongoClient.connect('mongodb+srv://shrayaas:shrayaas@cluster0.hqhk5j5.mongodb.net/');
                const db = client.db('shopping_complex');
                const collection = db.collection('shops');

                // Clear existing data in the collection
                await collection.deleteMany({});

                // Insert shop data
                await collection.insertMany(shoppingComplex.shops);

                const totalRent = shoppingComplex.calculateTotalRent();
                console.log(`The total rent of all shops in the shopping complex is: ${totalRent}`);

                client.close();
              } catch (error) {
                console.error('Error:', error);
              }
            }
          });
        });
      };

      inputShopDetails();
    });
  }
}

Main.main(); // Calling the main function
