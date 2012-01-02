/**
 * @author timknip
 * translated to javascript by @staunsholm
 */

var JSBlender = JSBlender || {};

JSBlender.BlendFileHeader = function(data)
{
    JSBlender.BlendFileHeader.CHARSET = "iso-8859-1";

    JSBlender.BlendFileHeader.MAGIC = 'BLENDER';
    JSBlender.BlendFileHeader.ENDIAN_BIG = 'V';
    JSBlender.BlendFileHeader.ENDIAN_LITTLE = 'v';
    JSBlender.BlendFileHeader.POINTERSIZE_4 = '_';
    JSBlender.BlendFileHeader.POINTERSIZE_8 = '-';

    /**
     * Pointer size, allowed values are 4 and 8.
     */
    this.pointerSize = null;

    /**
     * Endian. @see flash.utils.Endian
     */
    this.endian = null;

    /**
     * Charset to use for reading multibytes from the filestream.
     */
    this.charSet = null;

    /**
     * Blender version.
     */
    this.version = null;

    /**
     * Constructor.
     *
     * @param data
     */
    this.charSet = JSBlender.BlendFileHeader.CHARSET;

    data.position = 0;

    if (data.readMultiByte(7, this.charSet) != JSBlender.BlendFileHeader.MAGIC)
    {
        throw new Error("Not a Blender .blend file!");
    }

    var pointerSize = String.fromCharCode(data.readByte());
    switch (pointerSize)
    {
        case JSBlender.BlendFileHeader.POINTERSIZE_4:
            this.pointerSize = 4;
            break;
        case JSBlender.BlendFileHeader.POINTERSIZE_8:
            this.pointerSize = 8;
            break;
        default:
            throw new Error("Not a Blender .blend file!");
    }

    var endian = String.fromCharCode(data.readByte());
    switch (endian)
    {
        case JSBlender.BlendFileHeader.ENDIAN_BIG:
            data.endian = this.endian = JSBlender.BlendFileHeader.ENDIAN_BIG;
            break;
        case JSBlender.BlendFileHeader.ENDIAN_LITTLE:
            data.endian = this.endian = JSBlender.BlendFileHeader.ENDIAN_LITTLE;
            break;
        default:
            throw new Error("Not a Blender .blend file!");
    }

    this.version = data.readMultiByte(3, this.charSet);

    /**
     *
     */
    this.info = function()
    {
        var s = "";
        s += "pointerSize: " + this.pointerSize;
        s += "\nendian: " + this.endian;
        s += "\nversion: " + this.version + "\n";
        return s;
    }
}

