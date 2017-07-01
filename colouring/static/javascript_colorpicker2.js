/* Colour picker */

var Colors = new function()
{
  this.ColorFromHSV = function(hue, sat, val)
  {
    var color = new Color();
    color.SetHSV(hue,sat,val);
    return color;
  }

  this.ColorFromRGB = function(r, g, b)
  {
    var color = new Color();
    color.SetRGB(r,g,b);
    return color;
  }

  this.ColorFromHex = function(hexStr)
  {
    var color = new Color();
    color.SetHexString(hexStr);
    return color;
  }

  function Color()
  {
    //Stored as values between 0 and 1
    var red = 0;
    var green = 0;
    var blue = 0;
   
    //Stored as values between 0 and 360
    var hue = 0;
   
    //Strored as values between 0 and 1
    var saturation = 0;
    var value = 0;
     
    this.SetRGB = function(r, g, b)
    {
      if (isNaN(r) || isNaN(g) || isNaN(b))
        return false;
        
      r = r/255.0;
      red = r > 1 ? 1 : r < 0 ? 0 : r;
      g = g/255.0;
      green = g > 1 ? 1 : g < 0 ? 0 : g;
      b = b/255.0;
      blue = b > 1 ? 1 : b < 0 ? 0 : b;
      
      calculateHSV();
      return true;
    }
   
    this.Red = function()
    { return Math.round(red*255); }
   
    this.Green = function()
    { return Math.round(green*255); }
   
    this.Blue = function()
    { return Math.round(blue*255); }
   
    this.SetHSV = function(h, s, v)
    {
      if (isNaN(h) || isNaN(s) || isNaN(v))
        return false;
        
      hue = (h >= 360) ? 359.99 : (h < 0) ? 0 : h;
      saturation = (s > 1) ? 1 : (s < 0) ? 0 : s;
      value = (v > 1) ? 1 : (v < 0) ? 0 : v;
      calculateRGB();
      return true;
    }
     
    this.Hue = function()
    { return hue; }
     
    this.Saturation = function()
    { return saturation; }
     
    this.Value = function()
    { return value; } 
     
    this.SetHexString = function(hexString)
    {
      if(hexString == null || typeof(hexString) != "string")
        return false;
       
      if (hexString.substr(0, 1) == '#')
        hexString = hexString.substr(1);
       
      if(hexString.length != 6)
        return false;
         
      var r = parseInt(hexString.substr(0, 2), 16);
      var g = parseInt(hexString.substr(2, 2), 16);
      var b = parseInt(hexString.substr(4, 2), 16);
      
      return this.SetRGB(r,g,b);
    }
     
    this.HexString = function()
    {
      var rStr = this.Red().toString(16);
      if (rStr.length == 1)
        rStr = '0' + rStr;
      var gStr = this.Green().toString(16);
      if (gStr.length == 1)
        gStr = '0' + gStr;
      var bStr = this.Blue().toString(16);
      if (bStr.length == 1)
        bStr = '0' + bStr;
      return ('#' + rStr + gStr + bStr).toUpperCase();
    }
   
    this.Complement = function()
    {
      var newHue = (hue>= 180) ? hue - 180 : hue + 180;
      var newVal = (value * (saturation - 1) + 1);
      var newSat = (value*saturation) / newVal;
      var newColor = new Color();
      newColor.SetHSV(newHue, newSat, newVal);
      return newColor;
    }
   
    function calculateHSV()
    {
      var max = Math.max(Math.max(red, green), blue);
      var min = Math.min(Math.min(red, green), blue);
     
      value = max;
     
      saturation = 0;
      if(max != 0)
        saturation = 1 - min/max;
       
      hue = 0;
      if(min == max)
        return;
     
      var delta = (max - min);
      if (red == max)
        hue = (green - blue) / delta;
      else if (green == max)
        hue = 2 + ((blue - red) / delta);
      else
        hue = 4 + ((red - green) / delta);
      hue = hue * 60;
      if(hue <0)
        hue += 360;
    }
   
    function calculateRGB()
    {
      red = value;
      green = value;
      blue = value;
     
      if(value == 0 || saturation == 0)
        return;
     
      var tHue = (hue / 60);
      var i = Math.floor(tHue);
      var f = tHue - i;
      var p = value * (1 - saturation);
      var q = value * (1 - saturation * f);
      var t = value * (1 - saturation * (1 - f));
      switch(i)
      {
        case 0:
          red = value; green = t; blue = p;
          break;
        case 1:
          red = q; green = value; blue = p;
          break;
        case 2:
          red = p; green = value; blue = t;
          break;
        case 3:
          red = p; green = q; blue = value;
          break;
        case 4:
          red = t; green = p; blue = value;
          break;
        default:
          red = value; green = p; blue = q;
          break;
      }
    }
  }
}
();

function Position(x, y)
{
  this.X = x;
  this.Y = y;
  
  this.Add = function(val)
  {
    var newPos = new Position(this.X, this.Y);
    if(val != null)
    {
      if(!isNaN(val.X))
        newPos.X += val.X;
      if(!isNaN(val.Y))
        newPos.Y += val.Y
    }
    return newPos;
  }
  
  this.Subtract = function(val)
  {
    var newPos = new Position(this.X, this.Y);
    if(val != null)
    {
      if(!isNaN(val.X))
        newPos.X -= val.X;
      if(!isNaN(val.Y))
        newPos.Y -= val.Y
    }
    return newPos;
  }
  
  this.Min = function(val)
  {
    var newPos = new Position(this.X, this.Y)
    if(val == null)
      return newPos;
    
    if(!isNaN(val.X) && this.X > val.X)
      newPos.X = val.X;
    if(!isNaN(val.Y) && this.Y > val.Y)
      newPos.Y = val.Y;
    
    return newPos;  
  }
  
  this.Max = function(val)
  {
    var newPos = new Position(this.X, this.Y)
    if(val == null)
      return newPos;
    
    if(!isNaN(val.X) && this.X < val.X)
      newPos.X = val.X;
    if(!isNaN(val.Y) && this.Y < val.Y)
      newPos.Y = val.Y;
    
    return newPos;  
  }  
  
  this.Bound = function(lower, upper)
  {
    var newPos = this.Max(lower);
    return newPos.Min(upper);
  }
  
  this.Check = function()
  {
    var newPos = new Position(this.X, this.Y);
    if(isNaN(newPos.X))
      newPos.X = 0;
    if(isNaN(newPos.Y))
      newPos.Y = 0;
    return newPos;
  }
  
  this.Apply = function(element)
  {
    if(typeof(element) == "string")
      element = document.getElementById(element);
    if(element == null)
      return;
    if(!isNaN(this.X))
      element.style.left = this.X + 'px';
    if(!isNaN(this.Y))
      element.style.top = this.Y + 'px';  
  }
}

var pointerOffset = new Position(0, navigator.userAgent.indexOf("Firefox") >= 0 ? 1 : 0);
var circleOffset = new Position(5, 5);
var arrowsOffset = new Position(0, 4);

var arrowsLowBounds = new Position(0, -4);
var arrowsUpBounds = new Position(0, 195);
var circleLowBounds = new Position(-5, -5);
var circleUpBounds = new Position(194, 194);

function correctOffset(pos, offset, neg)
{
  if(neg)
    return pos.Subtract(offset);
  return pos.Add(offset);
}

function hookEvent(element, eventName, callback)
{
  if(typeof(element) == "string")
    element = document.getElementById(element);
  if(element == null)
    return;
  if(element.addEventListener)
  {
    element.addEventListener(eventName, callback, false);
  }
  else if(element.attachEvent)
    element.attachEvent("on" + eventName, callback);
}

function unhookEvent(element, eventName, callback)
{
  if(typeof(element) == "string")
    element = document.getElementById(element);
  if(element == null)
    return;
  if(element.removeEventListener)
    element.removeEventListener(eventName, callback, false);
  else if(element.detachEvent)
    element.detachEvent("on" + eventName, callback);
}

function cancelEvent(e)
{
  e = e ? e : window.event;
  if(e.stopPropagation)
    e.stopPropagation();
  if(e.preventDefault)
    e.preventDefault();
  e.cancelBubble = true;
  e.cancel = true;
  e.returnValue = false;
  return false;
}

function getMousePos(eventObj)
{
  eventObj = eventObj ? eventObj : window.event;
  var pos;
  if(isNaN(eventObj.layerX))
    pos = new Position(eventObj.offsetX, eventObj.offsetY);
  else
    pos = new Position(eventObj.layerX, eventObj.layerY);
  return correctOffset(pos, pointerOffset, true);
}

function getEventTarget(e)
{
  e = e ? e : window.event;
  return e.target ? e.target : e.srcElement;
}

function absoluteCursorPostion(eventObj)
{
  eventObj = eventObj ? eventObj : window.event;
  
  if(isNaN(window.scrollX))
    return new Position(eventObj.clientX + document.documentElement.scrollLeft + document.body.scrollLeft, 
      eventObj.clientY + document.documentElement.scrollTop + document.body.scrollTop);
  else
    return new Position(eventObj.clientX + window.scrollX, eventObj.clientY + window.scrollY);
}

function dragObject(element, attachElement, lowerBound, upperBound, startCallback, moveCallback, endCallback, attachLater)
{
  if(typeof(element) == "string")
    element = document.getElementById(element);
  if(element == null)
      return;
  
  if(lowerBound != null && upperBound != null)
  {
    var temp = lowerBound.Min(upperBound);
    upperBound = lowerBound.Max(upperBound);
    lowerBound = temp;
  }

  var cursorStartPos = null;
  var elementStartPos = null;
  var dragging = false;
  var listening = false;
  var disposed = false;
  
  function dragStart(eventObj)
  { 
    if(dragging || !listening || disposed) return;
    dragging = true;
    
    if(startCallback != null)
      startCallback(eventObj, element);
    
    cursorStartPos = absoluteCursorPostion(eventObj);
    
    elementStartPos = new Position(parseInt(element.style.left), parseInt(element.style.top));
   
    elementStartPos = elementStartPos.Check();
    
    hookEvent(document, "mousemove", dragGo);
    hookEvent(document, "mouseup", dragStopHook);
    
    return cancelEvent(eventObj);
  }
  
  function dragGo(eventObj)
  {
    if(!dragging || disposed) return;
    
    var newPos = absoluteCursorPostion(eventObj);
    newPos = newPos.Add(elementStartPos).Subtract(cursorStartPos);
    newPos = newPos.Bound(lowerBound, upperBound)
    newPos.Apply(element);
    if(moveCallback != null)
      moveCallback(newPos, element);
        
    return cancelEvent(eventObj); 
  }
  
  function dragStopHook(eventObj)
  {
    dragStop();
    return cancelEvent(eventObj);
  }
  
  function dragStop()
  {
    if(!dragging || disposed) return;
    unhookEvent(document, "mousemove", dragGo);
    unhookEvent(document, "mouseup", dragStopHook);
    cursorStartPos = null;
    elementStartPos = null;
    if(endCallback != null)
      endCallback(element);
    dragging = false;
  }
  
  this.Dispose = function()
  {
    if(disposed) return;
    this.StopListening(true);
    element = null;
    attachElement = null
    lowerBound = null;
    upperBound = null;
    startCallback = null;
    moveCallback = null
    endCallback = null;
    disposed = true;
  }
  
  this.StartListening = function()
  {
    if(listening || disposed) return;
    listening = true;
    hookEvent(attachElement, "mousedown", dragStart);
  }
  
  this.StopListening = function(stopCurrentDragging)
  {
    if(!listening || disposed) return;
    unhookEvent(attachElement, "mousedown", dragStart);
    listening = false;
    
    if(stopCurrentDragging && dragging)
      dragStop();
  }
  
  this.IsDragging = function(){ return dragging; }
  this.IsListening = function() { return listening; }
  this.IsDisposed = function() { return disposed; }
  
  if(typeof(attachElement) == "string")
    attachElement = document.getElementById(attachElement);
  if(attachElement == null)
    attachElement = element;
    
  if(!attachLater)
    this.StartListening();
}

function arrowsDown(e, arrows)
{
  var pos = getMousePos(e);
  
  if(getEventTarget(e) == arrows)
    pos.Y += parseInt(arrows.style.top);
  
  pos = correctOffset(pos, arrowsOffset, true);
  
  pos = pos.Bound(arrowsLowBounds, arrowsUpBounds);
  
  pos.Apply(arrows);
  
  arrowsMoved(pos);
}

function circleDown(e, circle)
{ 
  var pos = getMousePos(e);
  
  if(getEventTarget(e) == circle)
  {
    pos.X += parseInt(circle.style.left);
    pos.Y += parseInt(circle.style.top);
  }
  
  pos = correctOffset(pos, circleOffset, true);
  
  pos = pos.Bound(circleLowBounds, circleUpBounds);
  
  pos.Apply(circle);
    
  circleMoved(pos);
}

function arrowsMoved(pos, element)
{
  pos = correctOffset(pos, arrowsOffset, false);
  currentColor.SetHSV((200 - pos.Y)*359.99/199, currentColor.Saturation(), currentColor.Value());
  colorChanged("arrows");
}

function circleMoved(pos, element)
{
  pos = correctOffset(pos, circleOffset, false);
  console.log('pos.Y is ' + pos.Y);
  currentColor.SetHSV(currentColor.Hue(), 1-pos.Y/199.0, pos.X/199.0);
  colorChanged("circle");
}

function colorChanged(source)
{
  var new_red = currentColor.Red();
  var new_green = currentColor.Green();
  var new_blue = currentColor.Blue();
  document.getElementById("hexBox").value = currentColor.HexString();
  document.getElementById("redBox").value = new_red;
  document.getElementById("greenBox").value = new_green;
  document.getElementById("blueBox").value = new_blue;
  document.getElementById("hueBox").value = Math.round(currentColor.Hue());
  
  targetRed = new_red;
  targetGreen = new_green;
  targetBlue = new_blue;
  console.log('target colours:')
  console.log(targetRed, targetGreen, targetBlue);
    
  var str = (currentColor.Saturation()*100).toString();
  if(str.length > 4)
    str = str.substr(0,4);
  document.getElementById("saturationBox").value = str;
  str = (currentColor.Value()*100).toString();
  if(str.length > 4)
    str = str.substr(0,4);
  document.getElementById("valueBox").value = str;
  
  if(source == "arrows" || source == "box")
    document.getElementById("gradientBox").style.backgroundColor = Colors.ColorFromHSV(currentColor.Hue(), 1, 1).HexString();
    
  if(source == "box")
  {
    var el = document.getElementById("arrows");
    el.style.top = (200 - currentColor.Hue()*199/359.99 - arrowsOffset.Y) + 'px';
    var pos = new Position(currentColor.Value()*199, (1-currentColor.Saturation())*199);
    pos = correctOffset(pos, circleOffset, true);
    pos.Apply("circle");
    endMovement();
  }
  
  document.getElementById("quickColor").style.backgroundColor = currentColor.HexString();
  
  change_palette();
  
//  var the_box = document.getElementById(box);
//	var box_colour = window.getComputedStyle(the_box, null).getPropertyValue("background-color");
//	var parseRGB = box_colour.match(/\d+/g);
//	targetRed = Number(parseRGB[0]);
//	targetGreen = Number(parseRGB[1]);
//	targetBlue = Number(parseRGB[2]);
//	var red_box = document.getElementById('redBox');
//	var green_box = document.getElementById('greenBox');
//	var blue_box = document.getElementById('blueBox');
//	red_box.value = targetRed;
//	green_box.value = targetGreen;
//	blue_box.value = targetBlue;

//	var display_selected = document.getElementById("selected_colour_box");
//	display_selected.style.backgroundColor = box_colour;
	
}

function endMovement()
{
  document.getElementById("staticColor").style.backgroundColor = currentColor.HexString();
//  get_target_colour('staticColor');
}

function hexBoxChanged(e)
{
  currentColor.SetHexString(document.getElementById("hexBox").value);
  colorChanged("box");
}

function redBoxChanged(e)
{
  currentColor.SetRGB(parseInt(document.getElementById("redBox").value), currentColor.Green(), currentColor.Blue());
  colorChanged("box");
}

function greenBoxChanged(e)
{
  currentColor.SetRGB(currentColor.Red(), parseInt(document.getElementById("greenBox").value), currentColor.Blue());
  colorChanged("box");
}

function blueBoxChanged(e)
{
  currentColor.SetRGB(currentColor.Red(), currentColor.Green(), parseInt(document.getElementById("blueBox").value));
  colorChanged("box");
}

function hueBoxChanged(e)
{
  currentColor.SetHSV(parseFloat(document.getElementById("hueBox").value), currentColor.Saturation(), currentColor.Value());
  colorChanged("box");
}

function saturationBoxChanged(e)
{
  currentColor.SetHSV(currentColor.Hue(), parseFloat(document.getElementById("saturationBox").value)/100.0, currentColor.Value());
  colorChanged("box");
}

function valueBoxChanged(e)
{
  currentColor.SetHSV(currentColor.Hue(), currentColor.Saturation(), parseFloat(document.getElementById("valueBox").value)/100.0);
  colorChanged("box");
}

function fixPNG(myImage) 
{
  if(!document.body.filters)
    return;
  var arVersion = navigator.appVersion.split("MSIE");
  var version = parseFloat(arVersion[1]);
  if(version < 5.5 || version >= 7)
    return;

  var imgID = (myImage.id) ? "id='" + myImage.id + "' " : ""
  var imgStyle = "display:inline-block;" + myImage.style.cssText
  var strNewHTML = "<span " + imgID 
              + " style=\"" + "width:" + myImage.width 
              + "px; height:" + myImage.height 
              + "px;" + imgStyle + ";"
              + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader"
              + "(src=\'" + myImage.src + "\', sizingMethod='scale');\"></span>"
  myImage.outerHTML = strNewHTML
}

function fixGradientImg()
{
  fixPNG(document.getElementById("gradientImg"));
}


///////////

var palette_frozen = false;

function colour(e) {

    // added this to re-capture image data after any resize tinkering
    imgData = context.getImageData(0, 0, canvas.width, canvas.height);
//    console.log('running colour function');
    

	var x = e.pageX - canvas.offsetLeft;
  console.log('x is ' + x);
	var y = e.pageY - canvas.offsetTop - 67;
  console.log('y is ' + y);
  console.log($('#canvas').offset().top)

	var pixel = (y * imgData.width + x) * 4;
	start_red = imgData.data[pixel];
	start_green = imgData.data[pixel+1];
	start_blue = imgData.data[pixel+2];
	
	// do nothing if start pixel is selected colour
	var selected_box = document.getElementById("staticColor");
    var boxRGB = selected_box.style.backgroundColor;
    var parseRGB = boxRGB.match(/\d+/g);
    var selected_red = Number(parseRGB[0]);
    var selected_green = Number(parseRGB[1]);
    var selected_blue = Number(parseRGB[2]);
    
    if (start_red == selected_red && start_green == selected_green && start_blue == selected_blue) {
        return;
    }     
	
	// do nothing if start pixel is reserved outline colour - currently rgb(0,0,0) but change to rgb(0,0,1)? or not
	if (start_red == 0 && start_green == 0 && start_blue == 0) {
        return;
    }
	
	stack.push(pixel);
	action_history.push([pixel, start_red, start_green, start_blue]);  // (For Undo: save start position and colour to action history)	

    while (stack.length > 0) {	
	
	    left_to_colour = false;
	    right_to_colour = false;
	    pix = stack.pop();
	
	    while (pix >= 0 && match_start_colour(pix)) {		// this while loop finds the top bound to colour
		        pix -= imgData.width * 4;
		    }
		
	    pix += imgData.width * 4;
	
	    while (match_start_colour(pix)) 	{					// this while loop colours down the line
		    if (match_start_colour(pix-4) && left_to_colour == false && (pix-4) % (imgData.width*4) != (imgData.width*4 - 4)) {
			    stack.push(pix-4);
			    left_to_colour = true;
			}
		    else if (!match_start_colour(pix-4)) {
			    left_to_colour = false;
		    }
			
		    if (match_start_colour(pix+4) && right_to_colour == false && (pix+4) % (imgData.width*4) != 0) {
			    stack.push(pix+4);
			    right_to_colour = true;
			}
		    else if (!match_start_colour(pix+4)) {
			    right_to_colour = false;
		    }
		    imgData.data[pix] = targetRed;
		    imgData.data[pix+1] = targetGreen;
		    imgData.data[pix+2] = targetBlue;
	        pix += imgData.width * 4;
	    }
}
	
	context.putImageData(imgData, 0, 0);
	
//	console.log(stack);
}


function undo_last() {

	
	last_info = action_history.pop();
	pixel = last_info[0];
	
	stack.push(pixel);
	
	start_red = imgData.data[pixel];
	start_green = imgData.data[pixel+1];
	start_blue = imgData.data[pixel+2];
	
	while (stack.length > 0) {	
	
	left_to_colour = false;
	right_to_colour = false;
	pix = stack.pop();
	
	while (pix >= 0 && match_start_colour(pix)) {										// this while loop finds the top bound to colour
		pix -= imgData.width * 4;
		}
	pix += imgData.width * 4;
	
	while (match_start_colour(pix)) 	{	// this while loop colours down the line
	
		if (match_start_colour(pix-4) && left_to_colour == false && (pix-4) % (imgData.width*4) != (imgData.width*4 - 4)) {
			stack.push(pix-4);
			left_to_colour = true;
			}		
		else if (!match_start_colour(pix-4)) {		
			left_to_colour = false;		
		}		
		if (match_start_colour(pix+4) && right_to_colour == false && (pix+4) % (imgData.width*4) != 0) {	
			stack.push(pix+4);
			right_to_colour = true;
			}
		else if (!match_start_colour(pix+4)) {		
			right_to_colour = false;		
		}
		imgData.data[pix] = last_info[1];
		imgData.data[pix+1] = last_info[2];
		imgData.data[pix+2] = last_info[3];
	pix += imgData.width * 4;
	}	
}
	context.putImageData(imgData, 0, 0);
	
}


function match_start_colour(pxx) {

	if (imgData.data[pxx] == start_red && imgData.data[pxx+1] == start_green && imgData.data[pxx+2] == start_blue) {
		return true;
	}
	else {
		return false;
	}	
	
}

function get_target_colour(box) {

    var the_box = document.getElementById(box);
 //   the_box.style.backgroundColor = 'blue';
	var box_colour = window.getComputedStyle(the_box, null).getPropertyValue("background-color");
	var parseRGB = box_colour.match(/\d+/g);
	var r = Number(parseRGB[0]);
	var g = Number(parseRGB[1]);
	var b = Number(parseRGB[2]);
	currentColor = Colors.ColorFromRGB(r,g,b);
    colorChanged('box');
	
}


/*function random_colour() {
	
	var red = Math.round(Math.random()*255);
	var green = Math.round(Math.random()*255);
	var blue = Math.round(Math.random()*255);
	
	var selected_box = document.getElementById("selected_colour_box");
	selected_box.style.backgroundColor = "rgb(" + red + "," + green + "," + blue + ")";
	
	change_palette();
	
}

random_colour();*/

function change_palette() {

var selected_box = document.getElementById("staticColor");
var boxRGB = selected_box.style.backgroundColor;
var parseRGB = boxRGB.match(/\d+/g);

var red = Number(parseRGB[0]);
var green = Number(parseRGB[1]);
var blue = Number(parseRGB[2]);

var red_comp = 255 - red;
var green_comp = 255 - green;
var blue_comp = 255 - blue;

// change values in RGB list to new colour

//var red_value = document.getElementById("red_value");
//red_value.innerHTML = red;
//var green_value = document.getElementById("green_value");
//green_value.innerHTML = green;
//var blue_value = document.getElementById("blue_value");
//blue_value.innerHTML = blue;

var hue;
var lightness;
var saturation;

var xred = red/255;
var xgreen = green/255;
var xblue = blue/255;

var Min = Math.min(xred, xgreen, xblue);   //Min. value of RGB
var Max = Math.max(xred, xgreen, xblue);   //Max. value of RGB
var delta_Max = Max - Min;            //Delta RGB value

lightness = (Max + Min)/2;

if (delta_Max == 0) {                   //This is a gray, no chroma... 
   hue = 0;                             //HSL results from 0 to 1
   saturation = 0;
} else {                                   //Chromatic data... 
	if (lightness < 0.5) {
		saturation = delta_Max/(Max + Min);
		}
	else {
		saturation = delta_Max/(2 - Max - Min);
		}

   var delta_R = ( ((Max - xred)/6) + (delta_Max/2) ) / delta_Max;
   var delta_G = ( ((Max - xgreen)/6) + (delta_Max/2) ) / delta_Max;
   var delta_B = ( ((Max - xblue)/6) + (delta_Max/2) ) / delta_Max;

   if (xred == Max) { 
		hue = delta_B - delta_G;
		}
   else if (xgreen == Max) {
		hue = (1/3) + delta_R - delta_B;
		}
   else if (xblue == Max) {
		hue = (2/3) + delta_G - delta_R;
		}

   if (hue < 0) {
		hue += 1;
		}
   if (hue > 1) {
		hue -= 1;
		}
}

hue = Math.round(hue * 360);
saturation *= 100;
saturation = Math.round(saturation);
lightness *= 100;
lightness = Math.round(lightness);

var hex = red.toString(16) + green.toString(16) + blue.toString(16);

//var hue_value = document.getElementById("hue_value");
//hue_value.innerHTML = hue;
cp_hue = hue;
console.log("cp_hue is " + cp_hue);
//var saturation_value = document.getElementById("saturation_value");
//saturation_value.innerHTML = saturation + "%";
//var lightness_value = document.getElementById("lightness_value");
//lightness_value.innerHTML = lightness + "%";
//var hex_value = document.getElementById("hex_value");
//hex_value.innerHTML = "#" + hex;


// this function works out the gap between two complementary colour values (R, G or B)

function comp_gap(colour, col_comp, percentage) {
	
   var col_diff = Math.abs(colour - col_comp)
   if (colour > col_comp) {
      return colour - col_diff * percentage;
      }
   else {
      return colour + col_diff * percentage;
      }
	  
}

comp_gap(red, red_comp, 0.5);

// var selected_box = document.getElementById("selected_colour_box");
// selected_box.style.backgroundColor = "rgb(" + red + "," + green + "," + blue + ")";

if (palette_frozen == true) {

    return;
    
    }
    
else {

/*var p1 = document.getElementById("p1");
p1.style.backgroundColor = "hsl(20, 40%, 70%)";

var p2 = document.getElementById("p2");
p2.style.backgroundColor = "hsl(50, 40%, 70%)";

var p3 = document.getElementById("p3");
p3.style.backgroundColor = "hsl(80, 40%, 70%)";

var p4 = document.getElementById("p4");
p4.style.backgroundColor = "hsl(110, 40%, 70%)";

var p5 = document.getElementById("p5");
p5.style.backgroundColor = "hsl(140, 40%, 70%)";

var p6 = document.getElementById("p6");
p6.style.backgroundColor = "hsl(170, 40%, 70%)";

var p7 = document.getElementById("p7");
p7.style.backgroundColor = "hsl(200, 40%, 70%)";

var p8 = document.getElementById("p8");
p8.style.backgroundColor = "hsl(230, 40%, 70%)";

var p9 = document.getElementById("p9");
p9.style.backgroundColor = "hsl(260, 40%, 70%)";

var p10 = document.getElementById("p10");
p10.style.backgroundColor = "hsl(290, 40%, 70%)";
*/

var p11 = document.getElementById("p11");
p11.style.backgroundColor = "hsl(5, 70%, 50%)";

var p12 = document.getElementById("p12");
p12.style.backgroundColor = "hsl(35, 70%, 50%)";

var p13 = document.getElementById("p13");
p13.style.backgroundColor = "hsl(65, 70%, 50%)";

var p14 = document.getElementById("p14");
p14.style.backgroundColor = "hsl(95, 70%, 50%)";

var p15 = document.getElementById("p15");
p15.style.backgroundColor = "hsl(125, 70%, 50%)";

var p16 = document.getElementById("p16");
p16.style.backgroundColor = "hsl(155, 70%, 50%)";

var p17 = document.getElementById("p17");
p17.style.backgroundColor = "hsl(185, 70%, 50%)";

var p18 = document.getElementById("p18");
p18.style.backgroundColor = "hsl(215, 70%, 50%)";

var p19 = document.getElementById("p19");
p19.style.backgroundColor = "hsl(245, 70%, 50%)";

var p20 = document.getElementById("p20");
p20.style.backgroundColor = "hsl(275, 70%, 50%)";


// different complementary hues

var p21 = document.getElementById("p21");
p21.style.backgroundColor = "hsl(" + hue + ", " + saturation + "%, " + lightness + "%)";

var p22 = document.getElementById("p22");
p22.style.backgroundColor = "hsl(" + (hue+90) + ", " + saturation + "%, " + lightness + "%)";

var p23 = document.getElementById("p23");
p23.style.backgroundColor = "hsl(" + (hue+120) + ", " + saturation + "%, " + lightness + "%)";

var p24 = document.getElementById("p24");
p24.style.backgroundColor = "hsl(" + (hue+180) + ", " + saturation + "%, " + lightness + "%)";

var p25 = document.getElementById("p25");
p25.style.backgroundColor = "hsl(" + (hue+240) + ", " + saturation + "%, " + lightness + "%)";

var p26 = document.getElementById("p26");
p26.style.backgroundColor = "hsl(" + (hue+270) + ", " + saturation + "%, " + lightness + "%)";

// split complementaries, set to plus and minus 25 hue of the complement

var p27 = document.getElementById("p27");
p27.style.backgroundColor = "hsl(" + (hue+(180-25)) + ", " + saturation + "%, " + lightness + "%)";

var p28 = document.getElementById("p28");
p28.style.backgroundColor = "hsl(" + (hue+(180+25)) + ", " + saturation + "%, " + lightness + "%)";

// proximate hues, set to plus and minus 25 hue of the original

var p29 = document.getElementById("p29");
p29.style.backgroundColor = "hsl(" + (hue-25) + ", " + saturation + "%, " + lightness + "%)";

var p30 = document.getElementById("p30");
p30.style.backgroundColor = "hsl(" + (hue+25) + ", " + saturation + "%, " + lightness + "%)";


// progressively darker rgb in proportion towards black

var p31 = document.getElementById("p31");
p31.style.backgroundColor = "rgb(" + Math.round(red) + "," + Math.round(green) + "," + Math.round(blue) + ")";

var p32 = document.getElementById("p32");
p32.style.backgroundColor = "rgb(" + Math.round(red-red*0.1) + "," + Math.round(green-green*0.1) + "," + Math.round(blue-blue*0.1) + ")";

var p33 = document.getElementById("p33");
p33.style.backgroundColor = "rgb(" + Math.round(red-red*0.2) + "," + Math.round(green-green*0.2) + "," + Math.round(blue-blue*0.2) + ")";

var p34 = document.getElementById("p34");
p34.style.backgroundColor = "rgb(" + Math.round(red-red*0.3) + "," + Math.round(green-green*0.3) + "," + Math.round(blue-blue*0.3) + ")";

var p35 = document.getElementById("p35");
p35.style.backgroundColor = "rgb(" + Math.round(red-red*0.4) + "," + Math.round(green-green*0.4) + "," + Math.round(blue-blue*0.4) + ")";

var p36 = document.getElementById("p36");
p36.style.backgroundColor = "rgb(" + Math.round(red-red*0.5) + "," + Math.round(green-green*0.5) + "," + Math.round(blue-blue*0.5) + ")";

var p37 = document.getElementById("p37");
p37.style.backgroundColor = "rgb(" + Math.round(red-red*0.6) + "," + Math.round(green-green*0.6) + "," + Math.round(blue-blue*0.6) + ")";

var p38 = document.getElementById("p38");
p38.style.backgroundColor = "rgb(" + Math.round(red-red*0.7) + "," + Math.round(green-green*0.7) + "," + Math.round(blue-blue*0.7) + ")";

var p39 = document.getElementById("p39");
p39.style.backgroundColor = "rgb(" + Math.round(red-red*0.8) + "," + Math.round(green-green*0.8) + "," + Math.round(blue-blue*0.8) + ")";

var p40 = document.getElementById("p40");
p40.style.backgroundColor = "rgb(" + Math.round(red-red*0.9) + "," + Math.round(green-green*0.9) + "," + Math.round(blue-blue*0.9) + ")";

// progressively lighter rgb in proportion towards white

var p41 = document.getElementById("p41");
p41.style.backgroundColor = "rgb(" + Math.round(red) + "," + Math.round(green) + "," + Math.round(blue) + ")";

var p42 = document.getElementById("p42");
p42.style.backgroundColor = "rgb(" + Math.round(red+(255-red)*0.1) + "," + Math.round(green+(255-green)*0.1) + "," + Math.round(blue+(255-blue)*0.1) + ")";

var p43 = document.getElementById("p43");
p43.style.backgroundColor = "rgb(" + Math.round(red+(255-red)*0.2) + "," + Math.round(green+(255-green)*0.2) + "," + Math.round(blue+(255-blue)*0.2) + ")";

var p44 = document.getElementById("p44");
p44.style.backgroundColor = "rgb(" + Math.round(red+(255-red)*0.3) + "," + Math.round(green+(255-green)*0.3) + "," + Math.round(blue+(255-blue)*0.3) + ")";

var p45 = document.getElementById("p45");
p45.style.backgroundColor = "rgb(" + Math.round(red+(255-red)*0.4) + "," + Math.round(green+(255-green)*0.4) + "," + Math.round(blue+(255-blue)*0.4) + ")";

var p46 = document.getElementById("p46");
p46.style.backgroundColor = "rgb(" + Math.round(red+(255-red)*0.5) + "," + Math.round(green+(255-green)*0.5) + "," + Math.round(blue+(255-blue)*0.5) + ")";

var p47 = document.getElementById("p47");
p47.style.backgroundColor = "rgb(" + Math.round(red+(255-red)*0.6) + "," + Math.round(green+(255-green)*0.6) + "," + Math.round(blue+(255-blue)*0.6) + ")";

var p48 = document.getElementById("p48");
p48.style.backgroundColor = "rgb(" + Math.round(red+(255-red)*0.7) + "," + Math.round(green+(255-green)*0.7) + "," + Math.round(blue+(255-blue)*0.7) + ")";

var p49 = document.getElementById("p49");
p49.style.backgroundColor = "rgb(" + Math.round(red+(255-red)*0.8) + "," + Math.round(green+(255-green)*0.8) + "," + Math.round(blue+(255-blue)*0.8) + ")";

var p50 = document.getElementById("p50");
p50.style.backgroundColor = "rgb(" + Math.round(red+(255-red)*0.9) + "," + Math.round(green+(255-green)*0.9) + "," + Math.round(blue+(255-blue)*0.9) + ")";

// transition from selected colour to its RGB complement

var p51 = document.getElementById("p51");
p51.style.backgroundColor = "rgb(" + Math.round(comp_gap(red, red_comp, 0.1)) + "," + Math.round(comp_gap(green, green_comp, 0.1)) + "," + Math.round(comp_gap(blue, blue_comp, 0.1)) + ")";

var p52 = document.getElementById("p52");
p52.style.backgroundColor = "rgb(" + Math.round(comp_gap(red, red_comp, 0.2)) + "," + Math.round(comp_gap(green, green_comp, 0.2)) + "," + Math.round(comp_gap(blue, blue_comp, 0.2)) + ")";

var p53 = document.getElementById("p53");
p53.style.backgroundColor = "rgb(" + Math.round(comp_gap(red, red_comp, 0.3)) + "," + Math.round(comp_gap(green, green_comp, 0.3)) + "," + Math.round(comp_gap(blue, blue_comp, 0.3)) + ")";

var p54 = document.getElementById("p54");
p54.style.backgroundColor = "rgb(" + Math.round(comp_gap(red, red_comp, 0.4)) + "," + Math.round(comp_gap(green, green_comp, 0.4)) + "," + Math.round(comp_gap(blue, blue_comp, 0.4)) + ")";

var p55 = document.getElementById("p55");
p55.style.backgroundColor = "rgb(" + Math.round(comp_gap(red, red_comp, 0.5)) + "," + Math.round(comp_gap(green, green_comp, 0.5)) + "," + Math.round(comp_gap(blue, blue_comp, 0.5)) + ")";

var p56 = document.getElementById("p56");
p56.style.backgroundColor = "rgb(" + Math.round(comp_gap(red, red_comp, 0.6)) + "," + Math.round(comp_gap(green, green_comp, 0.6)) + "," + Math.round(comp_gap(blue, blue_comp, 0.6)) + ")";

var p57 = document.getElementById("p57");
p57.style.backgroundColor = "rgb(" + Math.round(comp_gap(red, red_comp, 0.7)) + "," + Math.round(comp_gap(green, green_comp, 0.7)) + "," + Math.round(comp_gap(blue, blue_comp, 0.7)) + ")";

var p58 = document.getElementById("p58");
p58.style.backgroundColor = "rgb(" + Math.round(comp_gap(red, red_comp, 0.8)) + "," + Math.round(comp_gap(green, green_comp, 0.8)) + "," + Math.round(comp_gap(blue, blue_comp, 0.8)) + ")";

var p59 = document.getElementById("p59");
p59.style.backgroundColor = "rgb(" + Math.round(comp_gap(red, red_comp, 0.9)) + "," + Math.round(comp_gap(green, green_comp, 0.9)) + "," + Math.round(comp_gap(blue, blue_comp, 0.9)) + ")";

var p60 = document.getElementById("p60");
p60.style.backgroundColor = "rgb(" + Math.round(comp_gap(red, red_comp, 1.0)) + "," + Math.round(comp_gap(green, green_comp, 1.0)) + "," + Math.round(comp_gap(blue, blue_comp, 1.0)) + ")";

var p61 = document.getElementById("p61");
p61.style.backgroundColor = "hsl(" + hue + ", " + (saturation+(100-saturation)*0.1) + "%, "+ lightness + "%)";

var p62 = document.getElementById("p62");
p62.style.backgroundColor = "hsl(" + hue + ", " + (saturation+(100-saturation)*0.2) + "%, "+ lightness + "%)";

var p63 = document.getElementById("p63");
p63.style.backgroundColor = "hsl(" + hue + ", " + (saturation+(100-saturation)*0.3) + "%, "+ lightness + "%)";

var p64 = document.getElementById("p64");
p64.style.backgroundColor = "hsl(" + hue + ", " + (saturation+(100-saturation)*0.4) + "%, "+ lightness + "%)";

var p65 = document.getElementById("p65");
p65.style.backgroundColor = "hsl(" + hue + ", " + (saturation+(100-saturation)*0.5) + "%, "+ lightness + "%)";

var p66 = document.getElementById("p66");
p66.style.backgroundColor = "hsl(" + hue + ", " + (saturation+(100-saturation)*0.6) + "%, "+ lightness + "%)";

var p67 = document.getElementById("p67");
p67.style.backgroundColor = "hsl(" + hue + ", " + (saturation+(100-saturation)*0.7) + "%, "+ lightness + "%)";

var p68 = document.getElementById("p68");
p68.style.backgroundColor = "hsl(" + hue + ", " + (saturation+(100-saturation)*0.8) + "%, "+ lightness + "%)";

var p69 = document.getElementById("p69");
p69.style.backgroundColor = "hsl(" + hue + ", " + (saturation+(100-saturation)*0.9) + "%, "+ lightness + "%)";

var p70 = document.getElementById("p70");
p70.style.backgroundColor = "hsl(" + hue + ", " + (saturation+(100-saturation)) + "%, "+ lightness + "%)";

/*var p71 = document.getElementById("p71");
p71.style.backgroundColor = "hsl(" + hue + ", " + saturation + "%, " + (lightness+(100-lightness)*0) + "%)";

var p72 = document.getElementById("p72");
p72.style.backgroundColor = "hsl(" + hue + ", " + saturation + "%, " + (lightness+(100-lightness)*0.1) + "%)";

var p73 = document.getElementById("p73");
p73.style.backgroundColor = "hsl(" + hue + ", " + saturation + "%, " + (lightness+(100-lightness)*0.2) + "%)";

var p74 = document.getElementById("p74");
p74.style.backgroundColor = "hsl(" + hue + ", " + saturation + "%, " + (lightness+(100-lightness)*0.3) + "%)";

var p75 = document.getElementById("p75");
p75.style.backgroundColor = "hsl(" + hue + ", " + saturation + "%, " + (lightness+(100-lightness)*0.4) + "%)";

var p76 = document.getElementById("p76");
p76.style.backgroundColor = "hsl(" + hue + ", " + saturation + "%, " + (lightness+(100-lightness)*0.5) + "%)";

var p77 = document.getElementById("p77");
p77.style.backgroundColor = "hsl(" + hue + ", " + saturation + "%, " + (lightness+(100-lightness)*0.6) + "%)";

var p78 = document.getElementById("p78");
p78.style.backgroundColor = "hsl(" + hue + ", " + saturation + "%, " + (lightness+(100-lightness)*0.7) + "%)";

var p79 = document.getElementById("p79");
p79.style.backgroundColor = "hsl(" + hue + ", " + saturation + "%, " + (lightness+(100-lightness)*0.8) + "%)";

var p80 = document.getElementById("p80");
p80.style.backgroundColor = "hsl(" + hue + ", " + saturation + "%, " + (lightness+(100-lightness)*0.9) + "%)";
*/

//draw_colour_gradient();

}

}

function lock_palette(){
    
    console.log('running freeze_palette');
    
    var freeze_span = document.getElementById('freeze_palette');
 //   var palette_wrapper = document.getElementById('palette_wrapper');

    if (palette_frozen == false) {
        palette_frozen = true;
    //    palette_wrapper.style.backgroundColor = '#ddd';
        $('.palette').css('border', '1px solid black');
        $('#freeze_palette').attr('src', '/static/lock_unlocked.png');
        
    } 
    else {
        palette_frozen = false;
 //       palette_wrapper.style.backgroundColor = 'white';
        $('.palette').css('border', '1px solid grey');
        $('#freeze_palette').attr('src', '/static/lock.png');
        
    }
        
}

function send_request(){
    var request = new XMLHttpRequest();
    request.open("POST", "../receive_ajax/");
    request.setRequestHeader("Content-Type", "text/html");
  //  var canvas_data = canvas.toDataURL("image/png");
    request.send("hello");
}

function string_to_form(){
    var canvas_data = canvas.toDataURL("image/png");
    var image_string = document.getElementById('image_string');
    image_string.setAttribute("value", canvas_data);
 //   send_request()
}

  /*  
function draw_colour_gradient(){

    var gradient_canvas = document.getElementById("gradient_canvas");
    var context = gradient_canvas.getContext("2d");
    
    var image_data = context.createImageData(200, 200);
    var total_data = image_data.height * image_data.width * 4;
    
    var cp_saturation = 0;
    var cp_value = 1;
    
    for (i = 0; i < total_data; i+=4) {
    
        if (cp_saturation > 1) {
        
            cp_saturation = 0;
        
            };
    
        calculateRGB(cp_hue, cp_saturation, cp_value);
        
        image_data.data[i] = cp_red;
        image_data.data[i+1] = cp_green;
        image_data.data[i+2] = cp_blue;  
        image_data.data[i+3] = 255;
   
        cp_saturation+=0.005;
   
        if (cp_saturation > 1) {
       
            cp_value -= 0.005;
       
        }
   
   }
     
    context.putImageData(image_data, 0, 0)    

}


function get_colour_picker_colour(e){
    
    var gradient_canvas = document.getElementById("gradient_canvas");
    var selected_colour = document.getElementById("selected_colour_box");
    var positionX = e.pageX - gradient_canvas.offsetLeft;
    var positionY = e.pageY - gradient_canvas.offsetTop;
    var position = ((positionY * gradient_canvas.width) + positionX) * 4;
    var context = gradient_canvas.getContext("2d");
    var image_data = context.getImageData(0, 0, 200, 200);
    
    var red = image_data.data[position];
    var green = image_data.data[position+1];
    var blue = image_data.data[position+2];
        
    targetRed = red;
    targetGreen = green;
    targetBlue = blue;
    
    console.log("e.pageX is: " + e.pageX);
    console.log("gradient_canvas.offsetLeft is: " + gradient_canvas.offsetLeft);
    console.log("gradient_canvas.offsetTop is: " + gradient_canvas.offsetTop);
    console.log("gradient_canvas.offsetParent is: " + gradient_canvas.offsetParent.id);
    console.log("Position X is: " + positionX);
    console.log("Position Y is: " + positionY);
    console.log("pixel position is: " + position);
    
    selected_colour.style.backgroundColor = "rgb(" + red + "," + green + "," + blue + ")";
    
    change_palette();
    
}

*/

function calculateRGB(hue, saturation, value)
    {
      cp_red = value;
      cp_green = value;
      cp_blue = value;
     
      if(value == 0 || saturation == 0)
        return;
     
      var tHue = (hue / 60);
      var i = Math.floor(tHue);
      var f = tHue - i;
      var p = value * (1 - saturation);
      var q = value * (1 - saturation * f);
      var t = value * (1 - saturation * (1 - f));
      switch(i)
      {
        case 0:
          cp_red = value; cp_green = t; cp_blue = p;
          break;
        case 1:
          cp_red = q; cp_green = value; cp_blue = p;
          break;
        case 2:
          cp_red = p; cp_green = value; cp_blue = t;
          break;
        case 3:
          cp_red = p; cp_green = q; cp_blue = value;
          break;
        case 4:
          cp_red = t; cp_green = p; cp_blue = value;
          break;
        default:
          cp_red = value; cp_green = p; cp_blue = q;
          break;
      }
    
    cp_red = Math.round(cp_red*255);
    cp_green = Math.round(cp_green*255);
    cp_blue = Math.round(cp_blue*255);
    
    }

var turn_blackwhite = function() {

    var canvas = document.getElementById("Canvas");  
    var context = canvas.getContext("2d");  
    var imageData = context.getImageData(0, 0, 600, 600);  
    var pixels = imageData.data;  

    for (var i = 0, n = pixels.length; i < n; i += 4) {  
    
        if (pixels[i] <= 120 || pixels[i+1] <= 120 || pixels[i+2] <=120) {
            pixels[i] = 0;
            pixels[i+1] = 0;
            pixels[i+2] = 0;
        } else {
            pixels[i] = 255;
            pixels[i+1] = 255;
            pixels[i+2] = 255;
        }

    }
    context.putImageData(imageData, 0, 0);
}


