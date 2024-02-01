// Proxy means the the class is proxied.


abstract class Actor {
  id
  stateCopy: any
  stateChangeSubscriptions?: Map<any, any>

  constructor...
}

// Proxied
class ActorLevel1 extends Actor {
  #fieldLevel1: ActorLevel2[]

  constructor(){
    ...
  }

  get fieldLevel1(): ActorLevel2[] {
    return this.#fieldLevel1;
  }
}

// Proxied
class ActorLevel2 extends Actor {
  #fieldLevel2: ActorLevel3[]

  constructor(){
    ...
  }

  get fieldLevel2(): ActorLevel3[] {
    return this.#fieldLevel2;
  }
}

class ActorLevel3 extends Actor {
  #fieldLevel3: ActorLevel4

  constructor(){
    ...
  }

  get fieldLevel3(): ActorLevel4 {
    return this.#fieldLevel3;
  }
}

// Proxied
class ActorLevel4 extends Actor {
  #fieldLevel4: string

  constructor(){
    ...
  }

  get fieldLevel4(): string {
    return this.#fieldLevel4;
  }
}

