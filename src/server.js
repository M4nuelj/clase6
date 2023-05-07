import express from 'express';


const express = require("express");
const productManager = require("./productManager.js");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = 3000;

app.route("/api/products")
    .get(async (req, res) => {
        const products = await productManager.getProducts();
        const limit = parseInt(req.query.limit);
        if (!limit) {
            return res.json(products)
        } else {
            if (limit > products.length) {
                return res.status(409).json({
                    error: "Es un número mayor al de los items registrados",
                });
            } else {
                return res.status(200).json(products.slice(0, limit));
            }
        }
    })
    .post(async (req, res) => {
        const productToAdd = req.body;
        const products = await productManager.addProduct(productToAdd)
        if (!products) {
            res.status(200).json({ message: "Producto añadido exitosamente" });
        } else {
            res.status(409).json({ error: products })
        }
    });

app.route("/api/products/:pid")
    .get(async (req, res) => {
        const idRequested = parseInt(req.params.pid);
        const userSearch = await productManager.getProductsById(idRequested);
        if (userSearch) {
            return res.status(200).json(userSearch);
        } else {
            return res.status(409).json({ error: userSearch });
        }
    })
    .put(async (req, res) => {
        const idProduct = parseInt(req.params.pid);
        const newProduct = req.body;
        const productModify = await productManager.updateProduct(idProduct, newProduct);
        if (!productModify) {
            res.status(200).json({ message: "Product modified successfully" })
        } else {
            res.status(409).json({ error: productModify });
        }
    })
    .delete(async (req, res) => {
        const idToDelete = parseInt(req.params.pid);
        const productEliminated = await productManager.deleteProduct(idToDelete);
        if (!productEliminated) {
            res.status(200).json({ message: "Product deleted successfully" });
        } else {
            res.status(409).json({ error: productEliminated })
        }
    });

app.listen(PORT, () => {
    console.log(`Example app listening on port http://localhost:${PORT}`)
});
