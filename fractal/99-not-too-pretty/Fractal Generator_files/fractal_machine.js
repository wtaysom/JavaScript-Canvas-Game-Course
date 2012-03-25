W = 720; 
H = 490;
debug = false;
small_iteration = 5;
iterations = 6;
list_of_points = [new Point(330,300), new Point(430,300)];
color = 123456;

function init(){

    if (typeof document.onselectstart!="undefined") {
        document.onselectstart=new Function ("return false");
    }
    else{
        document.onmousedown=new Function ("return false");
        document.onmouseup=new Function ("return true");
    }
    
    main_canvas = document.getElementById("imageView");
    mcontext = main_canvas.getContext('2d');
    var container = main_canvas.parentNode;
    canvas = document.createElement('canvas');
    canvas.id="imageTemp";
    canvas.width=W;
    canvas.height=H;
    container.appendChild(canvas);
    context = canvas.getContext("2d"); 

    $('#debug1').attr('checked', false);

    $("#clear1").bind('click', function(){
            clear();
    });
    
    $("#imageTemp").dblclick(function (){
    	    if (list_of_points.length < 3)
            	add_point();
    });

   
	$(function() {
		$("#slider-range-max").slider({
			range: "max",
			min: 1,
			max: 10,
			value: 6
,
			slide: function(event, ui) {
				$("#amount").val(ui.value);
                iterations = parseInt(ui.value);                

                clear_context_and_draw_fractal();
			}
		});
		$("#amount").val($("#slider-range-max").slider("value"));
	});

    $("#debug1").change(function(){
            if ($("#debug1").attr("checked")){
                debug = true;

                clear_context_and_draw_fractal();
            } 
            else{
                debug = false;
                
                clear_context_and_draw_fractal();
            }
        });

    update_points();
        
    draw_fractal();
    
};

function draw_fractal(){
    draw_AB();
    fractal([380,350],[380,460], iterations);
};

function draw_AB(){
    draw_line([380,350],[380,460]);    
};

function fractal(B,A, depth){
    color = 123456;
    if (depth <= 0)
        return null;
    
    var list = [];
    for (var i=0;i<list_of_points.length;i++){
        var point = list_of_points[i];
        var C = [point.x, point.y];

        var X = add(multiply(divide(minus(B,A),length(B,A)),
                             multiply_vector(minus(C,A), divide(minus(B,A), length(B,A)))),A);
       
        var mba = minus(B,A);
        var len = length(A,B);
        var prep = divide(mba, len);

        var u = multiply_vector(prep, minus(X,A))/len - 1;
        var pr = [-prep[1], prep[0]];           
        var v = multiply_vector(minus(C,X), pr)/len;

        if (debug)
            draw_pt(X);

        list.push([u,v]);
     
    };

    do_(B,A, list,depth);
    
};

function do_(B,A,list,depth){
    color += 1000;
    if (depth <= 0)
        return null;

    var point_list = [];
    for (var i=0;i<list.length;i++){
        var u = list[i][0];
        var v = list[i][1];
        var X = add(A, multiply(minus(B,A), 1 + u));     
        
        var prep = minus(A,B);
        var pr = [prep[1], -prep[0]];
        var C = add(X, multiply(pr, v));
        
        if (debug){
            draw_pt(X);
            draw_pt(C);
        };

        point_list.push(C);

        draw_line(B,C);

    };

    for (var j=0;j<point_list.length;j++){
        do_(point_list[j],B,list, depth-1);

    };

};

function multiply_vector(a, b){
    return a[0]*b[0] + a[1]*b[1];
};

function multiply(v, num){
    return [v[0]*num, v[1]*num];
};

function divide(v, num){
    return [v[0]/num, v[1]/num];
};
 
function add(a, b){
    return [a[0]+b[0], a[1]+b[1]];
};

function minus(a, b){
    return [a[0]-b[0], a[1]-b[1]];
};

function length(a, b){
    return Math.sqrt(Math.pow(a[0] - b[0],2) + 
                     Math.pow(a[1] - b[1],2));
};


function draw_line(a, b){
    context.beginPath();
    context.strokeStyle = "#" + String(color);
    context.moveTo(a[0], a[1]);
    context.lineTo(b[0], b[1]);
    context.stroke();
    context.closePath();


};

function draw_pt(a){
    context.beginPath();
    context.fillStyle = "red";
    context.arc(a[0],a[1],3,0,Math.PI*2,true);
    context.fill();
    context.closePath();
    
};

function Point(x,y){
    this.x = x;
    this.y = y;
    this.off_color = "grey";
    this.on_color = "black";
    this.small_radius = 4;
    this.big_radius = 6;
    this.glow = false;
    this.follow = false;
    this.get_color = function get_color(){
        return this.on_color;
    };
    this.get_radius = function get_radius(){
        if (this.glow == true){
            var size= 80/length([pos_x, pos_y], [this.x,this.y]);
            if (size < 8){ return size } else { return 8; };
        }
        else { return this.small_radius; }
    };
    this.draw = function draw(){
        mcontext.beginPath();
        mcontext.fillStyle = this.get_color();
        mcontext.arc(this.x, this.y, this.get_radius(), 0, Math.PI*2, true);
        mcontext.fill();
        mcontext.closePath();
    };
};

function update_points(){
    clear_mcontext();
    for (var i=0; i< list_of_points.length; i++){
        list_of_points[i].draw();
    };
};

function get_mouse_position(e){
    
    if (e.offsetX) {
        pos_x = e.offsetX;
        pos_y = e.offsetY;
    }
    else if(e.layerX) {
        pos_x = e.layerX;
        pos_y = e.layerY;
    }

    return [pos_x, pos_y];
}

function mouse_move(e){

    mouse_pos = get_mouse_position(e);
    if (!($(e.target).is('canvas')))
        out();
           
           //  if (mouse_pos[0] > W)
           //out();
    
    for (var i=0;i< list_of_points.length;i++){
        var point = list_of_points[i];
        var point_pos = [point.x, point.y];
        
        var distance = length(mouse_pos, point_pos);
        var point_radius = point.small_radius;
        if (point.follow == true){
         
            point.x = mouse_pos[0];
            point.y = mouse_pos[1];

            context.clearRect(0,0,W,H);
            fractal([380,350],[380,460],get_small_iterations());
            draw_line([380,350],[380,460]);

            update_points();
        }
        else {
            if (distance < point_radius + 15){
                point.glow = true;
                  
                update_points();
                
            }
            else{
                if (point.glow == true){
                    point.glow = false;
                    update_points();
                }
            }
        }
    };
};

function mouse_down(e){
    
    var down_pos = get_mouse_position(e);
    
    for (var i=0;i< list_of_points.length;i++){
        var point = list_of_points[i];
        if (point.glow == true){
            point.follow = true;
            break;
        }
    }
};

function mouse_up(e){
    
    for (var i=0;i< list_of_points.length;i++){
        var point = list_of_points[i];
        if (point.follow == true){
            point.follow = false;
           
            
            clear_context_and_draw_fractal();
        }
    }
};

function out(){
    for (var i=0;i<list_of_points.length;i++){
        if (list_of_points[i].follow == true){
            list_of_points[i].follow = false;
            
        }
    }
};

function keydown(event){
    var code = (event.keyCode ? event.keyCode : event.which);
    if (code == '8'){
        for (var i=0;i< list_of_points.length; i++){
            var point = list_of_points[i];
            if (point.glow == true){
                list_of_points = $.grep(list_of_points, function(value) {
                        return value != point;
                    })
                    context.clearRect(0,0,W,H);
                fractal([380,350],[380,460],get_small_iterations());
                draw_line([380,350],[380,460]);
                
                update_points();	
            };
        };
    };
};

function add_point(){
    list_of_points.push(new Point(mouse_pos[0], mouse_pos[1]));
    
    clear_context_and_draw_fractal();
    update_points();
};

function get_small_iterations(){
    if (iterations > 5){return small_iteration} else {return iterations};
};

function clear(){
    
    list_of_points = [];
    context.beginPath();
    context.clearRect(0,0,W,H);
    draw_AB();
    context.closePath();

    clear_mcontext();
};

function clear_mcontext(){
    mcontext.beginPath();
    mcontext.clearRect(0,0,W,H);
    mcontext.closePath();
};

function clear_context_and_draw_fractal(){
    context.beginPath();
    context.clearRect(0,0,W,H);
    draw_fractal();
    context.closePath();
};
