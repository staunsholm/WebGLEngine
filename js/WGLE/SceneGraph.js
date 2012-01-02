var WGLE = WGLE || {};
WGLE.SceneGraph = function()
{
    var graph = [];

    this.addChild = function(thing, parent)
    {
        if (!parent)
        {
            graph.push(thing)
        }
        else
        {
            thing.parent = parent;
            parent.children.push(thing);
        }
    };

    this.iterate = function(callback)
    {
        loop(graph);

        function loop(g)
        {
            for (var i = 0, l = g.length; i < l; i++)
            {
                callback(g[i]);
                loop(g[i].children);
            }
        }
    };
};

