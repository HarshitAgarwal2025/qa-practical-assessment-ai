const { readFileSync } = require("fs");
const path = require("path");
const toolshopLoginData = require("../testdata/toolshopLoginData.json");
const toolshopCartData = require("../testdata/toolshopCartData.json");
const toolshopInvoiceData = require("../testdata/toolshopInvoiceData.json");

const testdataDir = path.join(__dirname, "../testdata");

const readTestDataJson = (fileName) =>
    JSON.parse(readFileSync(path.join(testdataDir, fileName), "utf-8"));

const toolshopApiPage = {};

toolshopApiPage.loginHeader = {
    accept: "application/json",
    "Content-Type": "application/json",
};

toolshopApiPage.loginEndpoint = "users/login";

toolshopApiPage.loginBody = {
    email: toolshopLoginData.validUser.email,
    password: toolshopLoginData.validUser.password,
};

toolshopApiPage.getAuthHeader = () => {
    const accessToken = readTestDataJson("toolshopAccessToken.json");

    return {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken.access_token,
    };
};

toolshopApiPage.productsEndpoint =
    "products?q=" + encodeURIComponent(toolshopCartData.searchKeyword);

toolshopApiPage.createCartEndpoint = "carts";
toolshopApiPage.createCartBody = {
    lat: 52.0907,
    lng: 5.1214,
};

toolshopApiPage.getCartEndpoint = (cartId) => `carts/${cartId}`;
toolshopApiPage.addCartItemEndpoint = (cartId) => `carts/${cartId}`;

toolshopApiPage.addCartItemBody = {
    product_id: "",
    quantity: toolshopCartData.quantity,
};

toolshopApiPage.expectedAddToCartResult = "item added or updated";

toolshopApiPage.usersMeEndpoint = "users/me";
toolshopApiPage.createInvoiceEndpoint = "invoices";
toolshopApiPage.getInvoiceEndpoint = (invoiceId) => `invoices/${invoiceId}`;
toolshopApiPage.invoiceNumberPrefix = toolshopInvoiceData.invoiceNumberPrefix;

toolshopApiPage.mapProfileAddressToInvoiceBilling = (address = {}) => {
    const billing = {
        billing_street: address.street,
        billing_city: address.city,
        billing_country: address.country,
    };

    if (address.state) {
        billing.billing_state = address.state;
    }

    if (address.postal_code) {
        billing.billing_postal_code = address.postal_code;
    }

    return billing;
};

toolshopApiPage.getInvoiceBody = (userAddress = null) => {
    const toolshopCart = readTestDataJson("toolshopCart.json");

    return {
        cart_id: toolshopCart.id,
        payment_method: toolshopInvoiceData.paymentMethod,
        payment_details: toolshopInvoiceData.paymentDetails,
        ...toolshopApiPage.mapProfileAddressToInvoiceBilling(userAddress),
    };
};

module.exports = toolshopApiPage;
