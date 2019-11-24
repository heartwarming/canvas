/*
*
*/
(function(window){
	/*
	 传进来的option参数
		id:'myCanvas';
		width:'400';
		height:'400';
		clockOuterColor:"black",
		hourDialColor:"red",
		minuteDialColor:'brown',
		hourDynamicPointerColor:'red',
		minuteDynamicPointerColor:'green',
		secondDynamicPointerColor:'black',
    */
	window.Clock=function(options){
        //用户自定义的参数 
		this.config={
			id:'myCanvas',
			width:600,
			height:600,
			clockOuterColor:'black',
			outerBorderWidth:5,
			hourDialColor:'black',
			hourDialWidth:5,
			minuteDialColor:'red',
			minuteDialWidth:4,
			hourDynamicPointerColor:'red',
			hourDynamicPointerWidth:'5',
			minuteDynamicPointerColor:'green',
			minuteDynamicPointerWidth:'5',
			secondDynamicPointerColor:'black',
			secondDynamicPointerWidth:'5',
			onInit:'',
			onProgress:''
		}
        
        // 用户传进来的属性值覆盖
		for(var i in options){
			this.config[i]=options[i];			
		}
		
		var canvas=document.createElement('canvas');
		canvas.style.border='1px solid #acacac';
		canvas.id=this.config.id;
		canvas.width=this.config.width;
		canvas.height=this.config.height;
		document.body.appendChild(canvas);
		this.context=canvas.getContext('2d');	
		this.radius=Math.min(canvas.width/2,canvas.height/2);
		
		
		this.startTimer();
		if(typeof this.config.onInit == "function"){
			this.config.onInit();
		}
	};
	window.Clock.prototype={
		init:function(){
			this.context.clearRect(0,0,this.config.width,this.config.height)
			this.context.save();
			//先偏移，再旋转
			this.context.translate(this.config.width/2,this.config.height/2);
			this.context.rotate(-Math.PI/2);
			this.context.scale(0.95,0.95);
			this.context.save();				
		},
		//绘制外边框
		drawOuterBorder:function(){
			this.context.beginPath();
			this.context.strokeStyle=this.config.clockOuterColor;
			this.context.lineWidth=this.config.outerBorderWidth;
			this.context.arc(0,0,this.radius,0,Math.PI*2);
			this.context.stroke();
			this.context.restore();
			this.context.save();
		},
		drawNumber: function(){
		    this.context.beginPath();
	    	this.context.rotate(Math.PI/2);
		    this.context.font = '36px Arial';
		    this.context.fillStyle = '#000';
		    this.context.textAlign = 'center';
		    this.context.textBaseline = 'middle';
		    for (var n = 1; n <= 12; n++) {
				var theta = (n - 3) * (Math.PI * 2) / 12;
				var x = this.radius * 0.7 * Math.cos(theta);
				var y = this.radius * 0.7 * Math.sin(theta);
				this.context.fillText(n, x, y);
			}
		    this.context.restore();
		    this.context.save();
		},
		//绘制小时刻度
		drawHourDial:function(){
			this.context.beginPath();
			this.context.strokeStyle=this.config.hourDialColor;
			this.context.lineWidth=this.config.hourDialWidth;
			this.context.lineCap='round';
			for(var i = 0;i < 12;i++){
				this.context.moveTo(this.radius-5,0);
				this.context.lineTo(this.radius-20,0);
				this.context.stroke();
				this.context.rotate(Math.PI/6);
			}
			this.context.restore();
			this.context.save();
		},
		//绘制分钟刻度
		drawMinuteDial:function(){
			this.context.beginPath();
			this.context.strokeStyle=this.config.minuteDialColor;
			this.context.strokeStyle=this.config.minuteDialWidth;
			this.context.lineCap='round';
			for(var i=0;i<60;i++){
				if(i%5!=0){
					this.context.moveTo(this.radius-5,0);
					this.context.lineTo(this.radius-10,0);
					this.context.stroke()
				}
				this.context.rotate(Math.PI/30);
			}	
			this.context.restore();
			this.context.save();
		},
		getNowTime:function(){
			var date=new Date();
			this.hour=date.getHours();
			this.minute=date.getMinutes();
			this.second=date.getSeconds();
			this.hour>=12?this.hour-12:this.hour;
		},
		drawHourDynamicPointer:function(){
			this.context.rotate(Math.PI/6*this.hour+Math.PI/6/60*this.minute+Math.PI/6/60/60*this.second);
			this.context.beginPath();
			this.context.strokeStyle=this.config.hourDynamicPointerColor;
			this.context.lineWidth=this.config.hourDynamicPointerWidth;
			this.context.lineCap='round';
			this.context.moveTo(-20,0);
			this.context.lineTo(this.radius*0.4,0);
			this.context.stroke();
			this.context.restore();
			this.context.save();
		},
		drawMinuteDynamicPointer:function(){
			this.context.rotate(Math.PI/30*this.minute+Math.PI/30/60*this.second);
			this.context.beginPath();
			this.context.strokeStyle=this.config.minuteDynamicPointerColor;
			this.context.lineWidth=this.config.minuteDynamicPointerWidth;
			this.context.lineCap='round';
			this.context.moveTo(-20,0);
			this.context.lineTo(this.radius*0.5,0);
			this.context.stroke();
			this.context.restore();
			this.context.save();
		},
		drawSecondDynamicPointer:function(){
			this.context.rotate(Math.PI/30*this.second);
			this.context.beginPath();
			this.context.strokeStyle=this.config.secondDynamicPointerColor;
			this.context.lineWidth=this.config.secondDynamicPointerWidth;
			this.context.lineCap='round';
			this.context.moveTo(-20,0);
			this.context.lineTo(this.radius*0.6,0);
			this.context.stroke();
			this.context.restore();
			this.context.restore();
		},
		startTimer:function(){
			var self=this;
			setInterval(function(){
				self.init();
				self.getNowTime();
				self.drawOuterBorder();
				self.drawNumber();
				self.drawHourDial();
				self.drawMinuteDial();
				self.drawHourDynamicPointer();
				self.drawMinuteDynamicPointer();
				self.drawSecondDynamicPointer();
				
			},1000)
			if(typeof this.config.onProgress == 'function'){
				this.config.onProgress();
			}
		}
	};	
})(window);

































