/**
 * @author timknip
 * translated to javascript by @staunsholm
 */

var JSBlender = JSBlender || {};

JSBlender.DNAField = function(typeIndex, nameIndex)
{
    if (typeIndex === undefined) typeIndex = -1;
    if (nameIndex === undefined) nameIndex = -1;

    /**
     *
     */
    this.typeIndex = typeIndex;

    /**
     *
     */
    this.nameIndex = nameIndex;

    /**
     *
     */
    this.type = "";

    /**
     *
     */
    this.name = "";

    /**
     *
     */
    this.length = -1;

    /**
     *
     */
    this.arrayItems = new Array();

    /**
     *
     */
    this.getNumArrayItems = function()
    {
        var num = 1;

        this.arrayItems = new Array();

        if (this.getIsArray())
        {
            var s = this.name.indexOf("[");
            var e = this.name.indexOf("]");
            if (s != -1 && e != -1)
            {
                num = parseInt(this.name.substr(s + 1, e - s - 1), 10);
                this.arrayItems.push(num);

                var t = this.name.substr(e + 1);
                s = t.indexOf("[");
                e = t.indexOf("]");
                if (s != -1 && e != -1)
                {
                    var n = parseInt(t.substr(s + 1, e - s - 1), 10);
                    num *= n;
                    this.arrayItems.push(n);
                }
            }
        }

        return num;
    }

    /**
     *
     */
    this.getIsArray = function()
    {
        return (this.name.indexOf("[") != -1 && this.name.indexOf("]") != -1);
    }

    /**
     *
     */
    this.getIsCType = function()
    {
        return (
            this.type == "void" ||
            this.type == "char" ||
            this.type == "short" ||
            this.type == "int" ||
            this.type == "float" ||
            this.type == "double"
        );
    }

    /**
     *
     */
    this.getIsPointer = function()
    {
        return (this.name[0] == "*");
    }

    /**
     *
     */
    this.getIsSimpleType = function()
    {
        if (this.getIsPointer())
        {
            return true;
        }

        return this.getIsCType();
    }

    /**
     *
     */
    this.getShortName = function()
    {
        var name = this.name;

        while (name[0] == "*")
        {
            name = name.substr(1);
        }

        if (name.indexOf("[") != -1)
        {
            var parts = name.split("[");
            name = parts[0];
        }

        return name;
    }
}
