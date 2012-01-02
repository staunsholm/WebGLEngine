/**
 * A BHeadStruct is the Blender internal's name of a blend-file-header.
 * It contains information on how to parse the next data-section.
 *
 * @author timknip
 * translated to javascript by @staunsholm
 */

var JSBlender = JSBlender || {};

JSBlender.BHeadStruct = function(data, pointerSize, charSet)
{
    /**
     *
     */
    this.code = null;

    /**
     *
     */
    this.size = null;

    /**
     *
     */
    this.sdnaIndex = null;

    /**
     *
     */
    this.count = null;

    /**
     *
     */
    this.position = null;

    /**
     *
     */
    this.pointer = null;

    /**
     * constructor code
     */
    if (pointerSize === undefined) pointerSize = 4;
    if (charSet === undefined) charSet = "iso-8859-1";

    this.code = data.readMultiByte(4, charSet);
    this.size = data.readInt();
    this.pointer = "" + data.readInt();
    if (pointerSize == 8)
    {
        this.pointer += "T" + data.readInt();
    }
    this.sdnaIndex = data.readInt();
    this.count = data.readInt();
    this.position = data.position;
};
