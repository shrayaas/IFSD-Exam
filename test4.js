<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shopping Complex</title>
  <script src="https://unpkg.com/react/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/babel-standalone/babel.min.js" crossorigin></script>
</head>

<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState } = React;

    // Shop Component
    const Shop = ({ shop }) => {
      return (
        <div>
          <h3>{shop.name}</h3>
          <p>Rent: {shop.rent}</p>
        </div>
      );
    };

    // ShoppingComplex Component
    const ShoppingComplex = () => {
      const [numShops, setNumShops] = useState(0);
      const [shops, setShops] = useState([]);
      const [currentShopName, setCurrentShopName] = useState('');
      const [currentShopRent, setCurrentShopRent] = useState(0);

      const handleNumShopsChange = (event) => {
        const num = parseInt(event.target.value);
        setNumShops(num);
      };

      const handleShopNameChange = (event) => {
        setCurrentShopName(event.target.value);
      };

      const handleShopRentChange = (event) => {
        const rent = parseFloat(event.target.value);
        setCurrentShopRent(rent);
      };

      const handleAddShop = () => {
        if (currentShopName.trim() === '' || isNaN(currentShopRent) || currentShopRent <= 0) {
          return;
        }

        const shop = new Shop(currentShopName, currentShopRent);
        setShops([...shops, shop]);

        setCurrentShopName('');
        setCurrentShopRent(0);
      };

      const handleDeleteShop = (index) => {
        const updatedShops = [...shops];
        updatedShops.splice(index, 1);
        setShops(updatedShops);
      };

      const calculateTotalRent = () => {
        let totalRent = 0;
        for (const shop of shops) {
          totalRent += shop.rent;
        }
        return totalRent;
      };

      return (
        <div>
          <h2>Shopping Complex</h2>
          <label htmlFor="numShops">Number of Shops:</label>
          <input
            type="number"
            id="numShops"
            value={numShops}
            onChange={handleNumShopsChange}
          />

          {Array.from({ length: numShops }).map((_, index) => (
            <div key={index}>
              <h3>Shop {index + 1}</h3>
              <label htmlFor={`shopName${index}`}>Shop Name:</label>
              <input
                type="text"
                id={`shopName${index}`}
                value={currentShopName}
                onChange={handleShopNameChange}
              />

              <label htmlFor={`shopRent${index}`}>Shop Rent:</label>
              <input
                type="number"
                id={`shopRent${index}`}
                value={currentShopRent}
                onChange={handleShopRentChange}
              />

              <button onClick={handleAddShop}>Add Shop</button>
            </div>
          ))}

          <h3>All Shops:</h3>
          {shops.map((shop, index) => (
            <div key={index}>
              <Shop shop={shop} />
              <button onClick={() => handleDeleteShop(index)}>Delete Shop</button>
            </div>
          ))}

          <h3>Total Rent:</h3>
          <p>{calculateTotalRent()}</p>
        </div>
      );
    };

    ReactDOM.render(<ShoppingComplex />, document.getElementById('root'));
  </script>
</body>

</html>
