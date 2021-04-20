namespace Malefiz {
  export enum COLOR {
    RED = "R",
    GREEN = "G",
    BLUE = "B",
    YELLOW = "Y"
  }  
  export enum STAGE {
    ROLL,
    PICK_TOKEN,
    MOVE_TOKEN,
    SET_BARRIER
  }

  export enum TYPE {
    PLAYER_RED,
    PLAYER_GREEN,
    PLAYER_YELLOW,
    PLAYER_BLUE,
    BARRIER,
    WIN
  }

  export enum INSTRUCTION {
    NEXT_TURN, 
    PICK_TOKEN,
    MOVE_BARRIER,
    FINISH_GAME
  }

}
