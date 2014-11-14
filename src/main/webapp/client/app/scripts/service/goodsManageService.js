'use strict';
angular.module('letusgoApp').service('GoodService', function (localStorageService, $http) {

    this.item = function (category, name, price, unit) {

        return {
            Id: null,
            name: name,
            price: price,
            unit: unit,
            category: category
        };
    };

    this.hasExistItem = function (goods, itemName) {

        var exist = _.findIndex(goods, {name: itemName});
        return exist;

    };

    this.saveItem = function (itemCategory, itemName, itemPrice, itemUnit) {

        var newItem = this.item(itemCategory, itemName, JSON.parse(itemPrice).toFixed(2), itemUnit);
        $http.post('/api/goods/', {'item': newItem});
    };
    this.modifyCategoryNum = function (num, itemCategory) {

        $http.get('/api/categories').success(function(categories){
            var index = _.findIndex(categories, {name: itemCategory});
            categories[index].num = JSON.parse(categories[index].num) + num;
            $http.put('/api/categories/' + categories[index].ID, {'category': categories[index]}).success(function(){});
        });
    };

    this.succeedSave = function(name, itemName, itemPrice, itemUnit){
        this.saveItem(name, itemName, itemPrice, itemUnit);
        this.modifyCategoryNum(1, name);
    };

    this.saveNewGood = function (itemCategory, itemName, itemPrice, itemUnit, callback) {

        var currentThis = this;
        $http.get('/api/goods').success(function(goods){
            var hasExistItem =  currentThis.hasExistItem(goods, itemName);
            var itemDetailSuccess = itemCategory && itemName && itemPrice && itemUnit;

            if (!itemDetailSuccess) {
                callback([true, false]);
                return false;
            }

            if (hasExistItem !== -1) {
                callback([false, true]);
                return false;
            } else {
                currentThis.succeedSave(itemCategory.name, itemName, itemPrice, itemUnit);
                callback([false, false]);
                return true;
            }
        });
    };

    this.getAllCategories = function (callback) {

        $http.get('/api/categories').success(function(categories){
            var allCategories = [];
            _.forEach(categories, function (num) {
                allCategories.push({name: num.name});
            });
            callback(allCategories);
        });
    };

    this.updateItem = function (updateObject) {
        $http.put('/api/goods/' + updateObject.Id, {'item': updateObject});
    };

    this.deleteButton = function (item) {
        $http.delete('/api/goods/' + item.Id);
        this.modifyCategoryNum(-1, item.category);
    };

});
