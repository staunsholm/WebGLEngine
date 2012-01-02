var WGLE = WGLE || {};
WGLE.Light = function()
{
    this.children = [];
};

WGLE.Light.createDirectional = function()
{
    return new WGLE.Light();
};
