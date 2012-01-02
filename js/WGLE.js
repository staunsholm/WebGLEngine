var WGLE = function (id, width, height)
{
    var self = this;
    var container = document.getElementById(id);
    var fps = document.getElementById('fps');

    // create canvas
    var canvas = createCanvas();

    // setup WebGL
    var gl = initWebGL();
    WGLE.gl = gl;

    var sceneGraph = new WGLE.SceneGraph();
    WGLE.defaultShader = createDefaultShader();

    // everything is ready, show the canvas
    showCanvas();

    // start update loop
    window.requestAnimationFrame || (window.requestAnimationFrame =
            window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    function (callback, element)
                    {
                        return window.setTimeout(function ()
                        {
                            callback(+new Date());
                        }, 1000 / 60);
                    }
            );

    var startTime, lastTime;

    function step(timestamp)
    {
        if (!startTime)
        {
            lastTime = startTime = timestamp;
        }

        var dt = timestamp - lastTime;

        var time = timestamp - startTime;
        lastTime = timestamp;

        if (fps)
        {
            var no = Math.floor(1000 / dt);

            if (no >= 60)
            {
                fps.style.color = "#0f0";
            }
            else if (no >= 30)
            {
                fps.style.color = "#0ff";
            }
            else if (no >= 15)
            {
                fps.style.color = "#f80";
            }
            else
            {
                fps.style.color = "#f00";
            }

            fps.innerHTML = no;
        }

        if (self.update)
        {
            clearBuffer();
            setupMatrices();

            sceneGraph.iterate(function (object)
            {
                updatePosition(object);

                if (object.type === "Mesh")
                {
                    drawVertexBuffer(object);
                }
            });

            self.update(time, dt);
        }

        window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);

    // get gl context
    self.getGL = function ()
    {
        return gl;
    };

    // add something to scene
    self.addChild = function (thing, parent)
    {
        sceneGraph.addChild(thing, parent)
    };

    // insert canvas on page
    function showCanvas()
    {
        container.innerHTML = "";
        container.appendChild(canvas);
    }

    // create a canvas object, it is not added to the actual DOM yet
    function createCanvas()
    {
        if (!width)
        {
            width = container.offsetWidth;
        }
        if (!height)
        {
            height = container.offsetHeight;
        }

        var canvas = document.createElement('canvas');
        canvas.setAttribute('width', width + 'px');
        canvas.setAttribute('height', height + 'px');

        return canvas;
    }

    // setup webgl
    function initWebGL()
    {
        var gl = canvas.getContext("webgl");
        gl = gl || canvas.getContext("experimental-webgl");

        gl.viewportWidth = width;
        gl.viewportHeight = height;

        gl.enable(gl.DEPTH_TEST);

        return gl;
    }

    // clear the gl buffer
    function clearBuffer()
    {
        gl.clearColor(0.5, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    // setup model view and projection matrices
    function setupMatrices()
    {
        self.projectionMatrix = mat4.create();
        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, self.projectionMatrix);

        self.modelViewMatrix = mat4.create();
        mat4.identity(self.modelViewMatrix);
    }

    // translate and rotate object
    function updatePosition(object)
    {
        if (object.parent !== undefined && object.parent.matrix !== undefined)
        {
            mat4.set(object.parent.matrix, self.modelViewMatrix);
        }
        else
        {
            mat4.identity(self.modelViewMatrix);
        }

        if (object.matrix === undefined)
        {
            object.matrix = mat4.create();
        }

        mat4.translate(self.modelViewMatrix, [object.x, object.y, object.z]);

        mat4.rotate(self.modelViewMatrix, object.rotationX, [1, 0, 0]);
        mat4.rotate(self.modelViewMatrix, object.rotationY, [0, 1, 0]);
        mat4.rotate(self.modelViewMatrix, object.rotationZ, [0, 0, 1]);

        mat4.set(self.modelViewMatrix, object.matrix);
    }

    // draw the object
    function drawVertexBuffer(object)
    {
        // vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, object.vertexPositionBuffer);
        gl.vertexAttribPointer(object.shader.program.vertexPositionAttribute, object.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // texture buffer
        if (object.vertexTextureCoordBuffer)
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, object.vertexTextureCoordBuffer);
            gl.vertexAttribPointer(object.shader.program.textureCoordAttribute, object.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
        }

        // bind texture
        if (object.shader.texture)
        {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, object.shader.texture);
        }

        // update shaders
        object.shader.use({
            uPMatrix: self.projectionMatrix,
            uMVMatrix: self.modelViewMatrix
        });

        // draw from index buffer
        if (object.vertexIndexBuffer)
        {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.vertexIndexBuffer);
            gl.drawElements(gl.TRIANGLES, object.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        }

        // draw from position buffer
        else
        {
            gl.drawArrays(gl.TRIANGLES, 0, object.vertexPositionBuffer.numItems);
        }
    }

    function createDefaultShader()
    {
        var defaultShader = WGLE.Shader.createFromScript('texture-shader-vs', 'texture-shader-fs', {
            textureAttributes: {
                uSampler: 1
            },
            vertexAttributes: [
                "aVertexPosition",
                "aTextureCoord"
            ]
        });

        return defaultShader;
    }
};