/**
 * @author timknip
 * translated to javascript by @staunsholm
 */

var JSBlender = JSBlender || {};

JSBlender.DNAStruct = function(type, numFields)
{
    /**
     *
     */
    this.index = -1;

    /**
     *
     */
    this.type = type;

    /**
     *
     */
    this.numFields = numFields;

    /**
     *
     */
    this.fields = new Array(numFields);

    /**
     *
     */
    this.length = 0;
};
