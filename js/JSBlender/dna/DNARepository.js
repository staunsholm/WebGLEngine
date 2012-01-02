/**
 * @author timknip
 * translated to javascript by @staunsholm
 */

var JSBlender = JSBlender || {};

JSBlender.DNARepository = function(data, header)
{
    /**
     *
     */
    this.header = header;

    /**
     *
     */
    this.names = null;

    /**
     *
     */
    this.types = null;

    /**
     *
     */
    this.lengths = null;

    /**
     *
     */
    this.structs = null;

    this._structByType = null;

    /**
     *
     */
    this.getStructByType = function(type)
    {
        return this._structByType[type];
    }

    /**
     *
     */
    this.read = function(data)
    {

        if (data.readMultiByte(4, this.header.charSet) != "SDNA")
        {
            throw new IllegalOperationError("Not a DNA fileblock!");
        }

        if (data.readMultiByte(4, this.header.charSet) != "NAME")
        {
            throw new IllegalOperationError("Not a DNA fileblock!");
        }

        this.readNames(data);

        this.byteAlign(data, 4);
        if (data.readMultiByte(4, this.header.charSet) != "TYPE")
        {
            throw new IllegalOperationError("Not a DNA fileblock!");
        }

        this.readTypes(data);

        this.byteAlign(data, 4);
        if (data.readMultiByte(4, this.header.charSet) != "STRC")
        {
            throw new IllegalOperationError("Invalid Blender file!");
        }

        this.readStructs(data);
    }

    /**
     *
     */
    this.byteAlign = function(data, count)
    {
        if (count === undefined) count = 4;
        data.position = Math.ceil(data.position / count) * count;
    }

    /**
     *
     */
    this.readNames = function(data)
    {
        var count = data.readInt();
        var i;

        this.names = new Array(count);

        for (i = 0; i < count; i++)
        {
            this.names[i] = this.readString(data);
        }
    }

    /**
     *
     */
    this.readStructs = function(data)
    {
        var count = data.readInt();
        var i, j;

        this.structs = new Array(count);

        this._structByType = new Object();

        for (i = 0; i < count; i++)
        {
            var struct = new JSBlender.DNAStruct(data.readShort(), data.readShort());

            for (j = 0; j < struct.numFields; j++)
            {
                var field = new JSBlender.DNAField(data.readShort(), data.readShort());
                field.name = this.names[field.nameIndex];
                field.type = this.types[field.typeIndex];
                field.length = this.lengths[field.typeIndex];

                struct.fields[j] = field;

                struct.length += field.length;
            }

            struct.index = i;

            this.structs[i] = struct;

            this._structByType[this.types[struct.type]] = struct;
        }
    }

    /**
     *
     */
    this.readTypes = function(data)
    {
        var count = data.readInt();
        var i;

        this.types = new Array(count);
        this.lengths = new Array(count);

        for (i = 0; i < count; i++)
        {
            this.types[i] = this.readString(data);
        }

        this.byteAlign(data, 4);

        if (data.readMultiByte(4, this.header.charSet) != "TLEN")
        {
            throw new Error("Invalid Blender file!");
        }

        for (i = 0; i < count; i++)
        {
            this.lengths[i] = data.readShort();
        }
    };

    /**
     *
     */
    this.readString = function(data)
    {
        var s = "";
        var c = data.readByte();
        while (c)
        {
            s += String.fromCharCode(c);
            c = data.readByte();
        }
        return s;
    };

    /**
     * constructor code
     */
    if (data)
    {
        this.read(data);
    }
};