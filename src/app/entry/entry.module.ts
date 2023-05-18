export class Entry{
  name: string;
  description: string;


  constructor(name: string, description: string){
    this.name = name;
    this.description = description;
  }

  getEntryName() {
    return this.name;
  }

  getEntryDescription(){
    return this.description;
  }
}
