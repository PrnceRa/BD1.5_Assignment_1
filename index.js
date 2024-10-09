const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

let taxRate = 5;
let discountPercentage = 10;
let loyaltyRate = 2;

const memberFinalRate = (isMember, cartTotal) => isMember === 'true' ? cartTotal - cartTotal * (discountPercentage / 100) : cartTotal;

const cartTaxRate = cartTotal => cartTotal * ( taxRate / 100 );

const estimatedDeliveryTime = ( shippingMethod, distance) => shippingMethod === 'express' ? distance/100 : distance/50; 

const shippingCost = ( weight, distance ) => weight * distance * 0.1;

const loyaltyPoint = purchaseAmount => purchaseAmount * loyaltyRate;

app.get('/cart-total', (req, res) => {
  const { newItemPrice, cartTotal } = req.query;
  const cartTotalPrice = parseFloat(newItemPrice) + parseFloat(cartTotal);
  res.send(cartTotalPrice.toString());
});

app.get('/membership-discount', (req, res) => {
  const { isMember, cartTotal } = req.query;
  res.send(memberFinalRate(isMember , +cartTotal).toString());
});

app.get('/calculate-tax', (req, res) => {
  const { cartTotal } = req.query;
  res.send(cartTaxRate(+cartTotal).toString());
});

app.get('/estimate-delivery', (req, res) => {
  const { shippingMethod, distance } = req.query;
  res.send(estimatedDeliveryTime(shippingMethod, +distance).toString());
});

app.get('/shipping-cost', (req, res) => {
  const { weight, distance } = req.query;
  res.send(shippingCost(+weight, +distance).toString());
});

app.get('/loyalty-points', (req, res) => {
  const { purchaseAmount } = req.query;
  res.send(loyaltyPoint(+purchaseAmount).toString());
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
