/**
 * ByteArray.js by @staunsholm
 */

var JSBlender = JSBlender || {};

JSBlender.ByteArray = function(data)
{
    // constants
    JSBlender.ByteArray.ENDIAN_BIG = "V";
    JSBlender.ByteArray.ENDIAN_LITTLE = "v";

    // public variables
    this.position = 0;
    this.length = data.byteLength;
    this.endian = JSBlender.ByteArray.ENDIAN_BIG;

    // constructor
    var uInt8Array = new Uint8Array(data);
    var int8Array = new Int8Array(data);
    var uInt16Array = new Uint16Array(data);
    var int16Array = new Int16Array(data);
    //var uInt32Array = new Uint32Array(data);
    var int32Array = new Int32Array(data);
    var float32Array = new Float32Array(data);

    // float64 not yet in safari...
    var float64Array = typeof(Float64Array) !== "undefined" ? new Float64Array(data, 0, data.length - data.length & 7) : null;

    this.readMultiByte = function(length, charset)
    {
        var string = "";
        for (var i = 0; i < length; i++)
        {
            string += String.fromCharCode(uInt8Array[this.position]);
            this.position++;
        }
        return string;
    };

    this.readInt = function()
    {
        var tmp = int32Array[this.position >> 2];

        var c1 = uInt8Array[this.position++];
        var c2 = uInt8Array[this.position++];
        var c3 = uInt8Array[this.position++];
        var c4 = uInt8Array[this.position++];
        var i;
        if (this.endian === JSBlender.ByteArray.ENDIAN_BIG)
        {
            i = (c1 << 24) + (c2 << 16) + (c3 << 8) + c4;
        }
        else
        {
            i = (c4 << 24) + (c3 << 16) + (c2 << 8) + c1;
        }
        return i;
    };

    this.readUnsignedInt = function()
    {
        // don't know how to read have unsigned ints in javascript...
        return this.readInt();
    };

    this.readByte = function()
    {
        var i = int8Array[this.position];
        this.position += 1;
        return i;
    };

    this.readUnsignedByte = function()
    {
        var i = uInt8Array[this.position];
        this.position += 1;
        return i;
    };

    this.readShort = function()
    {
        var i = this.readUnsignedShort();

        // handle negative values
        if (i >= 0x8000) i -= 0x10000;

        return i;
    };

    this.readUnsignedShort = function()
    {
        var c1 = uInt8Array[this.position++];
        var c2 = uInt8Array[this.position++];
        var i;
        if (this.endian === JSBlender.ByteArray.ENDIAN_BIG)
        {
            i = (c1 << 8) + c2;
        }
        else
        {
            i = (c2 << 8) + c1;
        }
        return i;
    };

    this.readFloat = function()
    {
        var i = float32Array[this.position >> 2];
        this.position += 4;
        return i;
    };

    this.readDouble = function()
    {
        // float64 not yet in safari
        if (float64Array === null) return 0;

        var i = float64Array[this.position >> 3];
        this.position += 8;
        return i;
    };

    this.readBytes = function(length)
    {
        return new Uint8Array(data, this.position, length);
    };
};
