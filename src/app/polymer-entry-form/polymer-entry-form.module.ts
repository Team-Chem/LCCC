export class PolymerEntry{ //This class is to define what a PolymerEntry object is allowed to be.
  polymerName: string;
  molarMassRange: [number, number]; //This syntax is for a tuple.
  solvents: [string, string];
  diameter: number;
  poreSize: number;
  columnLength: number;
  columnName: string;
  temperature: number;
  pressure: number;
  flowRate: number;
  injectionVolume: number;
  detectors: string[];
  DOI: string;

  constructor(polymerName: string, molarMassRange: [number, number], solvents: [string, string],
    diameter: number, poreSize: number, columnLength: number, columnName: string, temperature: number,
    pressure: number, flowRate: number, injectionVolume: number, detectors: string[], DOI: string){
      //Just setting all of the defaults to be empty.
      this.polymerName = polymerName;
      this.molarMassRange = molarMassRange;
      this.solvents = solvents;
      this.diameter = diameter;
      this.poreSize = poreSize;
      this.columnLength = columnLength;
      this.columnName = columnName;
      this.temperature = temperature;
      this.pressure = pressure;
      this.flowRate = flowRate;
      this.injectionVolume = injectionVolume;
      this.detectors = detectors;
      this.DOI = DOI;
  }
}
