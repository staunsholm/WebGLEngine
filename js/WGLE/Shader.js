var WGLE = WGLE || {};
WGLE.Shader = function (vertexShader, fragmentShader, props)
{
    var self = this;
    var gl = WGLE.gl;

    self.vertexShader = createVertexShader(vertexShader);
    self.fragmentShader = createFragmentShader(fragmentShader);
    self.program = createShaderProgram();
    self.texture = createTexture();

    // texture
    function createTexture()
    {
        if (!WGLE.defaultTexture)
        {
            var c = document.createElement('canvas').getContext('2d');
            c.canvas.width = c.canvas.height = 128;
            for (var y = 0; y < c.canvas.height; y += 16)
            {
                for (var x = 0; x < c.canvas.width; x += 16)
                {
                    c.fillStyle = (x ^ y) & 16 ? '#FFF' : '#DDD';
                    c.fillRect(x, y, 16, 16);
                }
            }
            WGLE.defaultTexture = c.canvas;
        }

        var texture = gl.createTexture();
        texture.image = WGLE.defaultTexture;

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, WGLE.defaultTexture);

        return texture;
    }

    self.setTexture = function (image)
    {
        gl.bindTexture(gl.TEXTURE_2D, self.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    };

    // handle properties
    for (var a in props.vertexAttributes)
    {
        gl.enableVertexAttribArray(gl.getAttribLocation(self.program, props.vertexAttributes[a]));
    }

    for (var a in props.textureAttributes)
    {
        gl.enableVertexAttribArray(gl.getAttribLocation(self.program, a), props.textureAttributes[a]);
    }

    // activate this set of shaders
    self.use = function (parameters)
    {
        var param;

        for (var p in parameters)
        {
            param = parameters[p];
            if (param instanceof Float32Array)
            {
                gl.uniformMatrix4fv(gl.getUniformLocation(self.program, p), false, param);
            }
            else
            {
                gl.uniform1i(gl.getUniformLocation(self.program, p), param);
            }
        }

        gl.useProgram(self.program);
    };

    // setup vertex and fragment shader
    function createVertexShader(str)
    {
        var shader = gl.createShader(gl.VERTEX_SHADER);
        compileShader(shader, str);
        return shader;
    }

    function createFragmentShader(str)
    {
        var shader = gl.createShader(gl.FRAGMENT_SHADER);
        compileShader(shader, str);
        return shader;
    }

    function compileShader(shader, str)
    {
        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        {
            // spit out shader error
            console.log(gl.getShaderInfoLog(shader));
        }
    }

    function createShaderProgram()
    {
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, self.vertexShader);
        gl.attachShader(shaderProgram, self.fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
        {
            console.log("Could not initialise shaders");
            return null;
        }

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        return shaderProgram;
    }
};

// load a shader from <script type="x-shader/x-vertex/fragment"> tags
WGLE.Shader.createFromScript = function (vertexShaderId, fragmentShaderId, props)
{
    return new WGLE.Shader(getShader(vertexShaderId), getShader(fragmentShaderId), props);

    function getShader(id)
    {
        var shaderScript = document.getElementById(id);
        if (!shaderScript)
        {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k)
        {
            if (k.nodeType == 3) // <script>
            {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        return str;
    }
};

