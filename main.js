/**
 * Created by tclxa on 16-3-9.
 */

var bill = '';
var discount = '';
var free = '';
var print = '';
var result = '';
var billIndex = 0;
var billReslult = [];
var freeResult = [];
var resultDiv = '';
var discountComm = '';
var freeComm = '';
var itemCount = 0;
var discountVelue = 0.95;
var freeVelue = 3;

//Get the text input
function getInput() {
  discountComm = discount.value;
  freeComm = free.value;
  console.log('cashier::readBill::discountValue: '+ discountComm +
    ' freeValue: ' + freeComm);
}

//Find commodity data from DB
function findCommodity(barCode, count) {
  console.log('cashier::findCommodity');
  CommodityDB._getItemByKey(barCode, function(commodity) {
    console.log('commodityId: '+ commodity.name);
    if (barCode === commodity.barCode) {
      var entry = commodity;
      entry.count = count;
      entry.total = (count * commodity.unitPrice).toFixed(2);
      if (discountComm == barCode) {
        if (discountComm !== freeComm) {
          entry.total = (entry.total * discountVelue).toFixed(2);
          entry.save = (count * commodity.unitPrice -
          entry.total).toFixed(2);
        }
      }
      if (freeComm == barCode) {
        if (count > freeVelue - 1) {
          entry.total = (count - parseInt(count / freeVelue)) * commodity.unitPrice;
          entry.give = parseInt(count / freeVelue);
          entry.save = parseInt(count / freeVelue) * commodity.unitPrice;
          freeResult.push(entry);
        }
      }
      billReslult.push(entry);
      itemCount++;
      console.log('name:' + entry.name
        + ' unit:' + entry.unit
        + ' unitPrice:' + entry.unitPrice
        + ' count:' + entry.count
        + ' total:' + entry.total
        + ' save:' + entry.save
        + ' give:' + entry.give
        + ' itemCount:' + itemCount);
      while(itemCount === bills[billIndex].length) {
        printBill();
        break;
      }
    }
  });
}

//Click print button
function readBill() {
  console.log('cashier::readBill::bills[billIndex]'+ bills[billIndex].length);
  cleanElement();

  getInput();

  bills[billIndex].forEach(function(id) {
    console.log('barCode: ' + id);
    var barCode = '';
    var count = 1;
    if (id.length > 6) {
      barCode = id.substr(0, 6);
      count = id.substr(7);
    } else {
      barCode = id
    }

    findCommodity(barCode, count);
  });

}

//Print the result
function printBill() {
  console.log('printBill');
  var totalPrice = 0;
  var savePrice = 0;

  if (billReslult.length) {
    resultDiv = document.createElement('div');
    result.appendChild(resultDiv);
    printSplit(true);
    for (var index in billReslult) {
      printCommodity(billReslult[index]);
      totalPrice += Number(billReslult[index].total);
      if (billReslult[index].save) {
        savePrice += Number(billReslult[index].save);
      }
    }
    printSplit(false);
  }

  if (freeResult.length) {
    for (var index in freeResult) {
      printSave(freeResult[index]);
    }
    printSplit(false);
  }

  if (billReslult.length) {
    printTotal(totalPrice, savePrice);
  }
}

//Print each commodity
function printCommodity(value) {
  var str = '名称： ' + value.name + '，'
    + '数量: ' + value.count + value.unit + '，'
    + '单价： ' + value.unitPrice + '(元)，'
    + '<br>' + '小计： ' + value.total + '(元)';
  if (value.save) {
    str = str + '，' + '节省： ' + value.save + '(元)'
  }
  var itemDom = document.createElement('p');
  itemDom.innerHTML = str;
  resultDiv.appendChild(itemDom);
}
//Print split
function printSplit(title) {
  var split = ''
  if (title) {
    split = '***\<'+ '没钱赚商店>购物清单***' + '\n'
  } else {
    split = '\n' + '------------------------------------------' + '\n';
  }
  var splitDom = document.createElement('p');
  splitDom.innerHTML = split;
  resultDiv.appendChild(splitDom);
}

//Print save value
function printSave(value) {
  if (value.give) {
    var str1 = '买二赠一商品：' + '<br>'
      + '名称： ' + value.name + '，'
      + '数量: ' + value.give + value.unit
  }
  var itemGiveDom = document.createElement('p');
  itemGiveDom.innerHTML = str1;
  resultDiv.appendChild(itemGiveDom);
}

//print total value
function printTotal(totalPrice, savePrice) {
  var totalStr = '总计：' + totalPrice + '(元)' + '<br>';
  if (savePrice) {
    totalStr = totalStr + '节省：' + savePrice + '(元)' + '<br>';
  }
  totalStr += '<br>' + '***************************';
  var totalDom = document.createElement('p');
  totalDom.innerHTML = totalStr;
  resultDiv.appendChild(totalDom);
}

//When click print button, clean the print value element
function cleanElement() {
  if (result.hasChildNodes()) {
    result.removeChild(result.childNodes[0]);
    billReslult = [];
    freeResult = [];
    itemCount = 0;
  }
}

//init dom element
function initElement() {
  console.log('cashier::initElement');
  bill = document.getElementById('singleSel');
  for(var i = 1; i <= bills.length; i++) {
    var select = document.createElement('option');
    select.innerHTML = 'Test Data ' + i;
    bill.appendChild(select);
  }

  discount = document.getElementById('discount');
  free = document.getElementById('free');
  print = document.getElementById('print');
  result = document.getElementById('result');

  bill.onchange = selectChange;
  print.onclick = readBill;
}

//select change value
function selectChange(evt) {
  console.log('cashier::selectChange ' + this.selectedIndex);
  billIndex = this.selectedIndex;
}

//onload element
window.onload = function () {
  initElement();
};

window.onbeforeunload = function ()  {
  CommodityDB._closeDB();
}