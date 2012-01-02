var WGLE = WGLE || {};
WGLE.Object = function (name)
{
    var self = this;
    var gl = WGLE.gl;

    this.type = "Object";
    this.name = name;

    this.x = 0;
    this.y = 0;
    this.z = 0;

    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = 0;

    this.children = [];
    this.vertexIndexBuffer = null;
    this.vertexPositionBuffer = null;
    this.vertexTextureCoordBuffer = null;
    this.shader = null;

    this.addChild = function(child)
    {
        child.parent = self;
        self.children.push(child);
    }
};

WGLE.Object.loadBlend = function (url, onReady)
{
    var baseObject = new WGLE.Object(url);

    JSBlender.BlendFile.load(url, function (data)
    {
        JSBlender.ParseBlend(data, {
            mesh: newMesh,
            camera: newCamera
        });

        onReady(baseObject);
    });

    return baseObject;

    function newMesh(blendObject)
    {
        var obj = WGLE.Object.createMesh(blendObject.name, blendObject.vertexPositionBuffer, blendObject.vertexIndexBuffer);

        var m = blendObject.matrix;

        obj.x = m[12];
        obj.y = m[13];
        obj.z = m[14];

        obj.rotationX = blendObject.rotation[0];
        obj.rotationY = blendObject.rotation[1];
        obj.rotationZ = blendObject.rotation[2];

        obj.shader = WGLE.defaultShader;

        baseObject.addChild(obj);
    }

    function newCamera(blendObject)
    {
        var camera = new WGLE.Camera(blendObject.name);

        camera.matrix = mat4.create(blendObject.matrix);
    }
};

WGLE.Object.createMesh = function (name, vertexPositions, vertexIndices)
{
    var gl = WGLE.gl;
    var mesh = new WGLE.Object(name);
    mesh.type = "Mesh";

    mesh.vertexPositionBuffer = createVertexPositionBuffer();
    mesh.vertexIndexBuffer = createVertexIndexBuffer();

    function createVertexPositionBuffer()
    {
        var vertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);

        var vertices = [];
        var v;
        for (var i = 0, l = vertexPositions.length; i < l; i++)
        {
            v = vertexPositions[i];
            vertices.push(v.co[0], v.co[1], v.co[2]);
        }

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        vertexPositionBuffer.itemSize = 3;
        vertexPositionBuffer.numItems = vertexPositions.length;

        return vertexPositionBuffer;
    }

    function createVertexIndexBuffer()
    {
        var vertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);

        var indices = [];
        var n;
        for (var i = 0, l = vertexIndices.length; i < l; i++)
        {
            n = vertexIndices[i];
            if (n)
            {
                indices.push(n.v1, n.v2, n.v3, n.v1, n.v3, n.v4);
            }
        }

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        vertexIndexBuffer.itemSize = 1;
        vertexIndexBuffer.numItems = vertexIndices.length * 6;

        return vertexIndexBuffer;
    }

    return mesh;
};

WGLE.Object.createTriangle = function (name)
{
    var gl = WGLE.gl;
    var triangle = new WGLE.Object(name);
    triangle.type = "Mesh";

    triangle.vertexPositionBuffer = createVertexPositionBuffer();

    // create a simple triangle
    function createVertexPositionBuffer()
    {
        var vertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
        var vertices = [
            0.0, 1.0, 0.0,
            -1.0, -1.0, 0.0,
            1.0, -1.0, 0.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        vertexPositionBuffer.itemSize = 3;
        vertexPositionBuffer.numItems = 3;

        return vertexPositionBuffer;
    }

    return triangle;
};

WGLE.Object.createCube = function (name)
{
    var gl = WGLE.gl;
    var cube = new WGLE.Object(name);
    cube.type = "Mesh";

    cube.vertexPositionBuffer = createVertexPositionBuffer();
    cube.vertexTextureCoordBuffer = createVertexTextureCoordBuffer();
    cube.vertexIndexBuffer = createVertexIndexBuffer();

    function createVertexPositionBuffer()
    {
        var vertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
        var vertices = [
            // Front face
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,

            // Top face
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, 1.0,
            -1.0, -1.0, 1.0,

            // Right face
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        vertexPositionBuffer.itemSize = 3;
        vertexPositionBuffer.numItems = 24;

        return vertexPositionBuffer;
    }

    function createVertexTextureCoordBuffer()
    {
        var vertexTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer);
        var textureCoords = [
            // Front face
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,

            // Back face
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,

            // Top face
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,

            // Bottom face
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,

            // Right face
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,

            // Left face
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
        vertexTextureCoordBuffer.itemSize = 2;
        vertexTextureCoordBuffer.numItems = 24;

        return vertexTextureCoordBuffer;
    }

    function createVertexIndexBuffer()
    {
        var vertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
        var vertexIndices = [
            0, 1, 2, 0, 2, 3, // Front face
            4, 5, 6, 4, 6, 7, // Back face
            8, 9, 10, 8, 10, 11, // Top face
            12, 13, 14, 12, 14, 15, // Bottom face
            16, 17, 18, 16, 18, 19, // Right face
            20, 21, 22, 20, 22, 23  // Left face
        ];
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
        vertexIndexBuffer.itemSize = 1;
        vertexIndexBuffer.numItems = 36;

        return vertexIndexBuffer;
    }

    return cube;
};
