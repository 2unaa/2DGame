var current_state;
var game_data;
var invalidTransition = false; //boolean for invalid paths
var itemsCollected = []; //an array for the items to check if it is already collected

setTimeout(function(){
    $('#splash').hide();
    $('#main').show();
    canvas.style.display = "display: block; margin: 0 auto;" //makes canvas in the middle
    }, 4500); //4500

var itemsList = document.getElementById("itemList"); //so i can print out how many items in html

var items = 0; //for the json

itemsList.innerHTML = items; //connects them

const canvas = document.querySelector("canvas");

resize();
window.addEventListener('resize', resize);

$.getJSON( "game.json", function( data ) {
        game_data = data;
        current_state = data['start_state'];
        setBackgroundImage();
        load_imgs();
});

function resize(){

    canvas.width = window.innerWidth - 83;
    canvas.height = window.innerHeight - 125;
    try{
    draw(game_data['states'][current_state]['bk_img_loaded']);
    }catch{}
  
  }

function setBackgroundImage(){
    if (game_data && game_data['states'][current_state] && game_data['states'][current_state]['bg_img']) {
        var backgroundImage = game_data['states'][current_state]['bg_img'];
        document.body.style.backgroundImage = `url(${backgroundImage})`;
    }
}

function all_loaded(){
    draw(game_data['states']['0,0a']['bk_img_loaded']); 
    console.log(current_state);
    
}

function load_imgs(){
    for (var key in game_data['states']){
        if(game_data['states'][key]['bk_img'] != null){
            console.log( key, game_data['states'][key]['bk_img']);
            game_data['states'][key]['bk_img_loaded'] = new Image();
            game_data['states'][key]['bk_img_loaded'].onload = function(){ //gets the first image
                all_loaded(); //calls after the image is loaded
            };

        game_data['states'][key]['bk_img_loaded'].src = game_data['states'][key]['bk_img'];
    }
}
}

const up_arrow = 38;
const down_arrow = 40;
const left_arrow = 37;
const right_arrow = 39;

var cur_pos_x = 0;
var cur_pos_y = 0;

document.body.onkeydown = function(e){
    if(e.keyCode == up_arrow){
        cur_pos_x = cur_pos_x +1;
    }
   //alert(String.fromCharCode(e.keyCode)+" --> "+e.keyCode);
    key_input(e.keyCode)

};

function key_input(what_key) {
    for (var i = 0; i < game_data['states'][current_state]['next_state'].length; i++) {
        if (what_key == game_data['states'][current_state]['next_state'][i]['key_input']) {
            if (game_data['states'][current_state]['next_state'][i].invalid) { //if the next state has an invalid
                invalidTransition = true; //set to true 
            }
            next_state(game_data['states'][current_state]['next_state'][i]['state_name']) //move onto the next state
            break;
        }
    }
}

function next_state( state) {
    console.log("Current State = " + current_state + " --> New State= " + state) 
    current_state = state
    console.log("Updated Current State = " + current_state); 

    draw(game_data['states'][current_state]['bk_img_loaded']);

    if (invalidTransition) { //if there is an invalid transition
        drawText(); //draw invalid text
        setTimeout(function () {
            draw(game_data['states'][current_state]['bk_img_loaded']); 
            invalidTransition = false; //reset the bool
        }, 600); //will delete after
    }
        if (game_data['states'][current_state]['items'] != null &&  !itemsCollected[current_state]) { //if there is an item and if the item wasnt already collected
            items += game_data['states'][current_state]['items']; //add to it for the counter
            itemsList.innerHTML = items; //print it in html
            itemsCollected[current_state] = true; //mark the items as collected in this state
        }

        if (items == 6) { //checks if there has been 6 items yet
            document.getElementById("items").classList.add('green-items'); //changes text to green
        }
    }

function draw(img) {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

function draw_src(src, x, y, w, h) {
  var ctx = canvas.getContext('2d');
  var img = new Image();
  img.onload = function() {
    ctx.drawImage(img, x, y, w, h);
  };
  img.src = src;
}

function drawText() {
    var ctx = canvas.getContext('2d');
    ctx.font = "bolder 50px Anton";

    var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "#E51717");
    gradient.addColorStop(1, "#FFFFFF");

    ctx.fillStyle = gradient;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 8;
    ctx.textAlign = "center";

    ctx.strokeText("Invalid Path", canvas.width / 2, canvas.height / 2);
    ctx.fillText("Invalid Path", canvas.width / 2, canvas.height / 2);
  }