const readline = require('readline');

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
  static main() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const shoppingComplex = new ShoppingComplex();

    rl.question('Enter the number of shops in the complex: ', (numShops) => {
      const num = parseInt(numShops);
      if (isNaN(num) || num <= 0) {
        console.log('Invalid number of shops. Program exiting.');
        rl.close();
        return;
      }

      let shopCount = 0;

      const inputShopDetails = () => {
        rl.question(`Enter the name of Shop ${shopCount + 1}: `, (shopName) => {
          rl.question(`Enter the rent of Shop ${shopCount + 1}: `, (shopRent) => {
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

              const totalRent = shoppingComplex.calculateTotalRent();
              console.log(`The total rent of all shops in the shopping complex is: ${totalRent}`);
            }
          });
        });
      };

      inputShopDetails();
    });
  }
}

Main.main(); // Calling the main function
