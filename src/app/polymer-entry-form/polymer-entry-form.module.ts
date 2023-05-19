export class PolymerEntry{ //This class is to define what a PolymerEntry object is allowed to be.
  polymerName: string;
  molarMassRange: [number, number]; //This syntax is for a tuple.
  solvent: [string, string];
  diameter: number;
  poreSize: number;
  columnLength: number;
  columnName: string;
  temp: number;
  pressure: number;
  flowRate: number;
  injVolume: number;
  detectors: string[];
  DOI: string;

  constructor(polymerName: string, molarMassRange: [number, number], solvent: [string, string],
    diameter: number, poreSize: number, columnLength: number, columnName: string, temp: number,
    pressure: number, flowRate: number, injVolume: number, detectors: string[], DOI: string){
      //Just setting all of the defaults to be empty.
      this.polymerName = polymerName;
      this.molarMassRange = molarMassRange;
      this.solvent = solvent;
      this.diameter = diameter;
      this.poreSize = poreSize;
      this.columnLength = columnLength;
      this.columnName = columnName;
      this.temp = temp;
      this.pressure = pressure;
      this.flowRate = flowRate;
      this.injVolume = injVolume;
      this.detectors = detectors;
      this.DOI = DOI;
  }
}
