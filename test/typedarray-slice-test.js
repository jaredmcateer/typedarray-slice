var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-fuzzy'));

describe('TypedArray', function () {
    if (process.version.indexOf('v0.12') > -1) {
        describe('without the polyfill', function () {
            it('should not be able to slice on v0.12', function () {
                var arr = new Int8Array(new ArrayBuffer(9));
                expect(arr.hasOwnProperty('slice')).to.be.false;
            });
        });
    } else {
        console.info(
            'This test is being run on node ' + process.version +
            ' which has native slice support for TypedArrays.'
        );
    }

    describe('after polyfill is applied', function () {
        require('../src/typedarray-slice');
        var typedArrays = [
            Int8Array,
            Uint8Array,
            Int16Array,
            Uint16Array,
            Int32Array,
            Uint32Array,
            Float32Array,
            Float64Array
        ];

        var arrs = [];

        typedArrays.forEach(function (typedArray) {
            var tArray = new typedArray(new ArrayBuffer(32));
            var vals = [];
            for (var i = 0; i < 32 / typedArray.BYTES_PER_ELEMENT; i++) {
                vals.push(Math.round(Math.random() * 16));
            }

            tArray.set(vals);
            arrs.push(tArray);
        });

        arrs.forEach(function (arr) {
            describe(arr.constructor.name, function () {
                it('should have the slice method', function () {
                    expect(arr).to.have.property('slice'); 
                });

                it('should create a shallow copy when slicing', function () {
                    var copy = arr.slice(0);

                    expect(copy).to.be.a(arr.constructor.name);
                    expect(copy.length).to.equal(arr.length);
                    expect(copy.byteLength).to.equal(arr.byteLength);
                    expect(copy).to.be.like(arr);

                    // Unlike subarray slice should not be a live view of the 
                    // buffer and should not update the original copy when 
                    // changed.
                    copy[0] = copy[0] + 2;
                    expect(copy).to.not.be.like(arr);
                });

                it('should slice a subset of the array', function () {
                    var copy = arr.slice(0, 2);

                    expect(copy.length).to.equal(2);
                    expect(copy[0]).to.be.equal(arr[0]);
                    expect(copy[1]).to.be.equal(arr[1]);
                });

                it('should slice with a negative start', function () {
                    var copy = arr.slice(-2);

                    expect(copy.length).to.equal(2);
                    expect(copy[0]).to.be.equal(arr[arr.length-2]);
                    expect(copy[1]).to.be.equal(arr[arr.length-1]);
                });

                it('should slice with a negative end', function () {
                    var copy = arr.slice(-2, -1);

                    expect(copy.length).to.equal(1);
                    expect(copy[0]).to.be.equal(arr[arr.length-2]);
                });

                it('should be empty when given a positive start greater than the lenght', function () {
                    var copy = arr.slice(arr.length + 2);
                    expect(copy).to.be.empty;
                });

                it('should be empty if given a negative start less than the positive end', function () {
                    var copy = arr.slice(-2, 1);
                    expect(copy).to.be.empty;
                });

                it('should be wrap negative starts when greater than the posititve', function () {
                    var copy = arr.slice((-1 * (arr.length - 1)), 3);

                    expect(copy.length).to.equal(2);
                    expect(copy[0]).to.equal(arr[1]);
                    expect(copy[1]).to.equal(arr[2]);
                });
            });
        });
    });
});
