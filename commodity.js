/**
 * Created by tclxa on 16-3-9.
 */

var commodityData = [{
  name: '可口可乐',
  unit: '瓶',
  unitPrice: '3.00',
  category: '饮料',
  barCode: "XXX001"
}, {
  name: '苹果',
  unit: '斤',
  unitPrice: '5.50',
  category: '水果',
  barCode: 'XXX002'
}, {
  name: '羽毛球',
  unit: '个',
  unitPrice: '1.00',
  category: '体育用品',
  barCode: 'XXX003'
}, {
  name: '口香糖',
  unit: '盒',
  unitPrice: '10.00',
  category: '零食',
  barCode: 'XXX004'
}, {
  name: '牙刷',
  unit: '只',
  unitPrice: '10.00',
  category: '生活用品',
  barCode: 'XXX005'
}, {
  name: '牛奶',
  unit: '箱',
  unitPrice: '32.00',
  category: '饮料',
  barCode: 'XXX006'
}, {
  name: '刀具',
  unit: '只',
  unitPrice: '10.15',
  category: '生活用品',
  barCode: 'XXX007'
}];

var bill1 = ['XXX001', 'XXX002-2', 'XXX003-6'];
var bill2 = ['XXX001-3', 'XXX002-2', 'XXX003-6', 'XXX004', 'XXX005'];
var bill3 = ['XXX007-3', 'XXX001-2', 'XXX006-2', 'XXX002', 'XXX004', 'XXX003-3'];
var bill4 = ['XXX006', 'XXX004-2', 'XXX001-6', 'XXX005-2'];
var bills = [bill1, bill2, bill3, bill4];

var CommodityDB = {
  _db: null,
  _dbName: 'commoditydb',
  _dbStore: 'commodity',
  _dbVersion: '7',

  //Create indexDB
  _openDB: function openDB() {
    var indexedDB = window.indexedDB || window.webkitIndexedDB ||
      window.mozIndexedDB;

    var request = indexedDB.open(this._dbName, this._dbVersion);

    request.onsuccess = function(e) {
      console.log('open success');
      this._db = e.target.result;
    }.bind(this);

    request.onupgradeneeded = function (e) {
      console.log('onupgradeneeded');
      this._db = e.target.result;
      if (this._db.objectStoreNames.contains(this._dbStore)) {
        this._db.deleteObjectStore(this._dbStore);
      }
      var store = this._db.createObjectStore(this._dbStore, { keyPath: "barCode" });
      for (var item in commodityData) {
        console.log('add item');
        store.add(commodityData[item]);
      }
    }.bind(this);

    request.onerror = function(e) {
      console.log('commodityDB::openDB error ');
    };
  },

  //Get data by key
  _getItemByKey: function getItemByKey(key, callback) {
    var db = this._db;
    var trans = db.transaction([this._dbStore], 'readwrite');
    var store = trans.objectStore(this._dbStore);
    var request = store.get(key);
    var commodity = null;
    request.onsuccess = function(e) {
      commodity = e.target.result;
      console.log('commodityDB::name: ' + commodity.name);
      if (callback) {
        callback(commodity);
      }
    };

    request.onerror = function(e) {
      console.log('get commodity error');
    };
  },
  //close DB
  _closeDB: function closeDB() {
    this._db.close();
    this._db = null;
  }
};

CommodityDB._openDB();