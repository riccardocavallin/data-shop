App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    // Load pets.
    $.getJSON('../data.json', function (data) {
      var dataRow = $('#dataRow');
      var dataTemplate = $('#dataTemplate');

      for (i = 0; i < data.length; i++) {
        dataTemplate.find('.panel-title').text(data[i].name);
        dataTemplate.find('img').attr('src', data[i].picture);
        dataTemplate.find('.data-info').text(data[i].info);
        $('.linkContainer').hide();
        dataTemplate.find('.data-link').text(data[i].link);
        dataTemplate.find('.btn-buy').attr('data-id', data[i].id);


        dataRow.append(dataTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function () {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {
    $.getJSON('Purchase.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var PurchaseArtifact = data;
      App.contracts.Purchase = TruffleContract(PurchaseArtifact);

      // Set the provider for our contract
      App.contracts.Purchase.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the bought datas
      return App.markBought();
    });

    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on('click', '.btn-buy', App.handleBuy);
  },

  markBought: function (buyers, account) {
    var purchaseInstance;

    App.contracts.Purchase.deployed().then(function (instance) {
      purchaseInstance = instance;

      return purchaseInstance.getBuyers.call();
    }).then(function (buyers) {
      for (i = 0; i < buyers.length; i++) {
        if (buyers[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-data').eq(i).find('button').text('Success').attr('disabled', true);
          $('.linkContainer').eq(i).show();
        }
      }
    }).catch(function (err) {
      console.log(err.message);
    });
  },

  handleBuy: function (event) {
    event.preventDefault();
          
    var dataId = parseInt($(event.target).data('id'));

    var purchaseInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Purchase.deployed().then(function (instance) {
        purchaseInstance = instance;

        // Execute buy as a transaction by sending account
        return purchaseInstance.buy(dataId, { from: account });
      }).then(function (result) {
        return App.markBought();
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  }

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
