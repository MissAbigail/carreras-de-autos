class Game {
  constructor(){
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
  }

  getState(){
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  update(state){
    database.ref('/').update({
      gameState: state
    });
  }

  async start(){
    if(gameState === 0){
      player = new Player();
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }

    car1 = createSprite(100,200);
    car1.addImage("car1",car1_img);
    car1.scale = 0.07;

    car2 = createSprite(300,200);
    car2.addImage("car2",car2_img);
    car2.scale = 0.07;
    //car3 = createSprite(500,200);
    //car3.addImage("car3",car3_img);
    //car4 = createSprite(700,200);
    //car4.addImage("car4",car4_img);
    cars = [car1, car2];
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    //C39
    this.resetTitle.html("Reiniciar juego");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);
  }

  play(){
    form.hide();
    this.handleElements();
    this.handleResetButton();

    Player.getPlayerInfo();
    player.getCarsAtEnd();
     
    if(allPlayers !== undefined){
      //background(rgb(198,135,103));
      image(track, 0,-displayHeight*4,displayWidth, displayHeight*5);
      
      //var display_position = 100;
      
      //index of the array
      var index = 0;

      //x and y position of the cars
      var x = 435;
      var y;

      for(var plr in allPlayers){
        //add 1 to the index for every loop
        index = index + 1 ;

        //position the cars a little away from each other in x direction
        x = x + 210;
        //use data form the database to display the cars in y direction
        //var x = allPlayers[plr].positionX;
        //var y = height - allPlayers[plr].positionY;

        y = displayHeight - allPlayers[plr].distance;
        cars[index-1].x = x;
        cars[index-1].y = y;
       // console.log(index, player.index)

       
        if (index === player.index){
          stroke(10);
          fill("red");
          ellipse(x,y,60,60);
          cars[index - 1].shapeColor = "red";
          camera.position.x = displayWidth/2;
          camera.position.y = cars[index-1].y;
        }
       
        //textSize(15);
        //text(allPlayers[plr].name + ": " + allPlayers[plr].distance, 120,display_position)
      }

    }

    if(keyIsDown(UP_ARROW) && player.index !== null){
      player.distance +=10
      player.update();
    }

    if(player.distance > 4200){
      gameState = 2;
      player.rank +=1
      Player.updateCarsAtEnd(player.rank)
      
    }
   
    drawSprites();
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
        CarsAtEnd: 0
      });
      window.location.reload();
    });
  }

  end(){
    console.log("Game Ended");
    console.log(player.rank);
  }
}
