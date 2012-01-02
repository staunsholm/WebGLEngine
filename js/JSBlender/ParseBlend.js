var JSBlender = JSBlender || {};

JSBlender.ParseBlend = function (blendData, handlers)
{
    var blend = new JSBlender.BlendFile();

    blend.read(blendData);

    if (blend.scenes.length)
    {
        var scene = blend.scenes[0];

        buildScene(scene);
    }

    function buildScene(scene)
    {
        var blendObj = scene.base.first;

        while (blendObj)
        {
            var blendObject = blendObj.object;

            if (blendObject && blendObject.data)
            {
                switch (blendObject.type)
                {
                    case 1: // Mesh
                        var mesh = blendObject.data;
                        handlers.mesh && handlers.mesh({
                            name: mesh.id.name,
                            matrix: blendObject.obmat,
                            rotation: blendObject.rot,
                            vertexPositionBuffer: mesh.mvert,
                            vertexIndexBuffer: mesh.mface,
                            uvBuffer: mesh.mtface,
                            numVertices: mesh.totvert,
                            numFaces: mesh.totface
                        });
                        break;
                    case 10: // Lamp
                        handlers.light && handlers.light({
                            name: blendObject.data.id.name,
                            matrix: blendObject.obmat
                        });
                        break;
                    case 11: // Camera
                        handlers.camera && handlers.camera({
                            name: blendObject.data.id.name,
                            matrix: blendObject.obmat
                        });
                        break;
                    case 25: // Armature
                        handlers.armature && handlers.armature({
                            name: blendObject.data.id.name,
                            matrix: blendObject.obmat
                        });
                        break;
                    default:
                        console.log("unknown type: " + blendObject.type);
                        break;
                }
            }

            blendObj = blendObj.next;
        }
    }
};
