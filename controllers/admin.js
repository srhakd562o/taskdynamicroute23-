const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    // Get product details from request body
    const { title, imageUrl, price, description } = req.body;
    // Create a new Product instance
    const product = new Product(null, title, imageUrl, description, price);
    // Save the product
    product.save();
    // Redirect to the products page
    res.redirect('/admin/products');
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit === 'true';
    const productId = req.params.productId;

    if (!editMode) {
        return res.redirect('/');
    }

    Product.findById(productId, product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    });
};

exports.postEditProduct = (req, res, next) => {
    const { productId, title, imageUrl, price, description } = req.body;
    const updatedProduct = new Product(productId, title, imageUrl, description, price);
    updatedProduct.save();
    res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.deleteById(productId, err => {
        if (err) {
            console.error('Error deleting product:', err);
            return res.redirect('/admin/products');
        }
        console.log('Product deleted successfully!');
        res.redirect('/admin/products');
    });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    });
};
