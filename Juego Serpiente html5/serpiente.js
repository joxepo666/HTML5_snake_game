$(document).ready(function(){
	//Canvas
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
    var player = "";
	var interval;
	
	//Guardamos en una variable el ancho de la celda, para un control más simple
	var cw = 10; // ancho de la celda
	var d; // dirección
	var food; // posicion de la comida
	var score; // puntos
	
	//Creamos la serpiente
	var snake_array; //será un array de celdas
	
	function init()
	{
		d = "right"; //direccion por defecto
		create_snake();
		create_food(); //creamos la comida
		//finalmente, mostramos la puntuación
		score = 0;
		
		//Movemos la serpiente con un timer que la redibuja en pantalla
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, interval);
	}
    jPrompt('Introduce tu nombre','Tu nombre', 'BIENVENIDO', function(r) {
        //console.log(r);
        player = r;
		jPrompt('Selecciona dificultad','1:Fácil, 2:Medio, 3:Dificil', 'Hola '+player, function(inter) {
			if(inter=="1"){
				interval = 100;
			}else if(inter=="2"){
				interval = 50;
			}else{
				interval = 25
			}
			init();
		});
        //init();
    });
	
	function create_snake()
	{
		var length = 5; //Longitud inical de la serpiente
		snake_array = [];
		for(var i = length-1; i>=0; i--)
		{
			//Creamos la serpiente de forma horizontal empezando arriba/izq
			snake_array.push({x: i, y:0});
		}
	}
	
	
	function create_food()
	{
		food = {
			x: Math.round(Math.random()*(w-cw)/cw), 
			y: Math.round(Math.random()*(h-cw)/cw), 
		};
		//Creamos una celda de forma laeatoria con x/y entre 0 y 44
		//Porque hay 45(450/10) posiciones posibles entre filas y columnas 
	}
	
	//Función que pinta la serpiente
	function paint()
	{
		//Pintamos el canvas
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);
		
		//EL movimiento de la serpeinte
		//Quitamos la ultima celda y la ponemos en la cabeza
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;
		//Posición de la cabeza.
		//Lo incrementamos para obtener la nueva posicion de la cabeza
		if(d == "right") nx++;
		else if(d == "left") nx--;
		else if(d == "up") ny--;
		else if(d == "down") ny++;
		
		//Si la serpiente golpea el borde o choca con su propio cuerpo reiniciamos el juego
		if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array))
		{
			//reiniciar
			clearInterval(game_loop);
            jConfirm(player +': tu puntuación es de '+score+' puntos', 'GAME OVER', function(r) {
                //console.log(r);
                if(r){
                    jPrompt('Selecciona dificultad','1:Fácil, 2:Medio, 3:Dificil', 'Hola '+player, function(inter) {
						if(inter=="1"){
							interval = 100;
						}else if(inter=="2"){
							interval = 50;
						}else{
							interval = 25
						}
						init();
					});
			        return;
                }else{
                    window.top.close();
                }
                
            });
			
		}
		
		//Comer
		
		//Si la cabeza de la serpiente coincide con la celda de la comida
		//añadimos una nueva celda y sumamos un punto
		if(nx == food.x && ny == food.y)
		{
			//Cada vez que cogemos comida, aumentamos un poquito la velocidad
			clearInterval(game_loop);
			interval = interval - 1;
			game_loop = setInterval(paint, interval);
			var tail = {x: nx, y: ny};
			score++;
			create_food();
		}
		else
		{
			var tail = snake_array.pop(); 
			tail.x = nx; tail.y = ny;
		}
		
		snake_array.unshift(tail); //coloca la cola en la cabeza
		
		for(var i = 0; i < snake_array.length; i++)
		{
			var c = snake_array[i];
			//Pintamos celdas
			paint_snake(c.x, c.y);
		}
		
		//pintamos la comida
		paint_food(food.x, food.y);
		//pintamos la puntuación
		var score_text = player+": " + score;
		ctx.fillText(score_text, 5, h-5);
	}
	
	//Funciónpara pintar la serpiente
	function paint_snake(x, y)
	{
		ctx.fillStyle = "green";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}
	
	//Funciónpara pintar la comida
	function paint_food(x, y)
	{
		ctx.fillStyle = "red";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}
	
	//Función para detectar colisión
	function check_collision(x, y, array)
	{
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}
	
	//Añadimos los controles de teclado
	$(document).keydown(function(e){
		var key = e.which;
		if(key == "37" && d != "right") d = "left";
		else if(key == "38" && d != "down") d = "up";
		else if(key == "39" && d != "left") d = "right";
		else if(key == "40" && d != "up") d = "down";
	});
	
	
	
})