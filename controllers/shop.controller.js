var express = require("express");
var router = express.Router();
var Shop = require('../models/shop.model');
var User = require('../models/user.model');

module.exports.getShops = async function(req, res) {
    var shops = await Shop.find();
    res.render('shops/index', {shops: shops});
}

module.exports.registerShopPage = function(req, res) {
    res.render('shops/registerShop');
}

module.exports.registerShop = async function(req, res) {
    try {
        var { nameShop, email } = req.body;
        var user = await User.findOne({ email: email});
        var existUser = await Shop.findOne({idUser: user._id});
        
        if (!user) {
            throw new Error('Invalid email, please enter your registered email');
        } else {
            if (existUser) {
                throw new Error('Only one shop per user can be registered');
            } else {
                var newShop = new Shop({
                    shopName: nameShop,
                    idUser: user._id
                });

                await newShop.save();
                res.render('shops/registerShop', { success: 'Register shop success!' });
            }
        }
            
    } catch ({message = 'Invalid'}) {
        res.render('shops/registerShop', { message });
    }
}

