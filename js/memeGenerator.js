var memeGenerator = {
	canvas: document.getElementById('memecanvas'), 
	ctx: null,
	xImage: null,
	yImage: null,

	dom:{
		image: document.getElementById('image'),
		textareaTop: document.getElementById('textarea-top'),
		textareaBottom: document.getElementById('textarea-bottom'),
		btnSave: document.getElementById('btn-save')
	},
	
	init: function(){
		this.setupCanvas();
		this.events();
	},

	events: function(){
		this.dom.textareaTop.addEventListener('keyup', this.drawTextOnImage, false);
		this.dom.textareaBottom.addEventListener('keyup', this.drawTextOnImage, false);
		this.dom.btnSave.addEventListener('click', this.saveMeme, false);
	},


	setupCanvas: function(){
		this.ctx = this.canvas.getContext('2d');
		this.canvas.width = this.dom.image.width;
		this.canvas.height = this.dom.image.height;
		this.ctx.lineWidth  = 5;
		this.ctx.font = '20pt sans-serif';
		this.ctx.strokeStyle = 'black';
		this.ctx.fillStyle = 'white';
		this.ctx.textAlign = 'center';
		this.ctx.lineJoin = 'round';

		this.drawImage();
	},


	drawImage: function(){
		var that = this;
		this.dom.image.onload = function() {
			that.xImage = that.canvas.width/2 - that.dom.image.width/2;
			that.yImage = that.canvas.height/2 - that.dom.image.height/2;
			that.ctx.drawImage(that.dom.image, that.xImage, that.yImage);
		}
	},

	drawTextOnImage: function(){
		

		memeGenerator.ctx.save();
	 	memeGenerator.ctx.clearRect(0, 0, memeGenerator.canvas.width, memeGenerator.canvas.height);
		memeGenerator.ctx.drawImage(memeGenerator.dom.image,  memeGenerator.xImage, memeGenerator.yImage);

		memeGenerator.drawTextAtTop();
		memeGenerator.drawTextAtBottom();
	 
	    memeGenerator.ctx.restore();
	},
	

	drawTextAtTop: function(){
		var textTop = memeGenerator.dom.textareaTop.value;
		textTop = textTop.toUpperCase();
		var x = memeGenerator.canvas.width/2;
		var y = 30;
		memeGenerator.ctx.wrapText(textTop,x,y,400,25);
	},

	drawTextAtBottom: function(){
		var text = memeGenerator.dom.textareaBottom.value;
		text = text.toUpperCase();
		x = memeGenerator.canvas.width/2;
		y = memeGenerator.canvas.height / 2 + 90;
		memeGenerator.ctx.wrapText(text,x,y,400,25);
	},

	saveMeme: function(){
		var dataURL = memeGenerator.canvas.toDataURL();
		$.ajax({
		  type: "POST",
		  url: "upload.php",
		  data: { 
		     imgBase64: dataURL
		  }
		}).done(function(o) {
			alert("El meme se genero correctamente");
			window.location = 'meme.jpg';
		});
	}
};

memeGenerator.init();


// Add method to prototype to support break lines on fill text 
CanvasRenderingContext2D.prototype.wrapText = function (text, x, y, maxWidth, lineHeight) {
    var lines = text.split("\n");

    for (var i = 0; i < lines.length; i++) {

        var words = lines[i].split(' ');
        var line = '';

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = this.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                this.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }

        this.strokeText(line, x, y);
        this.fillText(line, x, y);
        y += lineHeight;
    }
};








