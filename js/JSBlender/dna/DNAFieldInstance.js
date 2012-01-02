/**
 * @author timknip
 * translated to javascript by @staunsholm
 */

var JSBlender = JSBlender || {};

JSBlender.DNAFieldInstance = function(field, pointerSize)
{
    if (pointerSize === undefined)
    {
        pointerSize = 4;
    }

    /**
     *
     */
    this.field = field;

    /**
     *
     */
    this.pointerSize = pointerSize;

    /**
     *
     */
    this.read = function(data)
    {
        var result = new Array();
        var num = this.field.getNumArrayItems();
        var i;

        for (i = 0; i < num; i++)
        {
            if (this.field.getIsPointer())
            {
                result.push(data.readInt());
                if (pointerSize == 8)
                {
                    result.push(data.readInt());
                }
            }
            else if (this.field.getIsSimpleType())
            {
                switch (this.field.type)
                {
                    case "void":
                        break;
                    case "char":
                        result.push(data.readByte());
                        break;
                    case "uchar":
                        result.push(data.readUnsignedByte());
                        break;
                    case "ushort":
                        result.push(data.readUnsignedShort());
                        break;
                    case "short":
                        result.push(data.readShort());
                        break;
                    case "int":
                    case "long":
                        result.push(data.readInt());
                        break;
                    case "ulong":
                        result.push(data.readUnsignedInt());
                        break;
                    case "float":
                        result.push(data.readFloat());
                        break;
                    case "double":
                        result.push(data.readDouble());
                        break;
                    default:
                        break;
                }
            }
        }
        return result;
    }
}
