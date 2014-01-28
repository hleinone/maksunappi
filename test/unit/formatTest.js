var _ = require('underscore')._;
var assert = require("assert");
var formatter = require("../../format");

describe('Payment reference format', function(){
  it('should convert series of numbers to valid referenceFormat', function(){
    assert.equal(12345672, formatter.formatToPaymentReference(1234567));
    assert.equal(13, formatter.formatToPaymentReference(1));
    assert.equal(110, formatter.formatToPaymentReference(11));
  });
});

describe('Message formatting', function () {
  it('should split a message into rows of max 35 characters each', function () {
    var message = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. "+
      "Pellentesque pellentesque dui dictum, fermentum risus non, congue tortor. "+
      "Nam ornare sapien.";
    var rows = formattedRows(message);
    _.each(rows, function (row) {
      assert.ok(row.length <= 35);
    });
    assert.equal(5, rows.length);
  });

  it('should cut out rows exceeding a maximum of 6', function () {
    var message = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. "+
      "Donec sollicitudin nisl ut quam dictum luctus. Mauris bibendum justo eget "+
      "libero sagittis, hendrerit dignissim nunc lacinia. Aliquam non lorem"+
      "tincidunt metus porta rhoncus. Sed elementum quam vitae vestibulum lacinia. Nunc id.";
    var rows = formattedRows(message);
    assert.equal(6, rows.length);
  });

  it('should split words longer than 35 characters', function () {
    var message = "LoremipsumdolorsitametconsecteturadipiscingelitPellentesquepellentesqueduidictum...";
    var rows = formattedRows(message);
    _.each(_.initial(rows), function (row) {
      assert.equal(35, row.length);
    });
    assert.equal(Math.ceil(message.length / 35.0), rows.length);
  });

  function formattedRows (message) {
    return formatter.formatMessage(message).split('\r\n');
  }
});

describe('Language formatting', function () {
  it('should map EN to 1 (FI) or 3 (EN) depending on selected mapping', function () {
    assert.equal(1, formatter.formatLanguage('EN', formatter.mapEnglishToDefault));
    assert.equal(3, formatter.formatLanguage('EN', formatter.allowEnglish));
  });

  it('should map null or undefined to Finnish', function () {
    assert.equal(1, formatter.formatLanguage(null, formatter.allowEnglish));
    assert.equal(1, formatter.formatLanguage(undefined, formatter.allowEnglish));
  });

  it('should throw when an unknown language code is given', function () {
    assert.throws(function () {
      formatter.formatLanguage('se', formatter.allowEnglish);
    }, /Unsupported language code 'se'/);
  });
});