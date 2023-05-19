import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PolymerEntry } from './polymer-entry-form.module';
import { Injectable } from '@angular/core'; // Library for injection.
import { HttpClient } from '@angular/common/http'; //Library for http requests

@Injectable({providedIn: 'root'}) //This allows for me to inject code through Http requests.
@Component({
  selector: 'app-polymer-entry-form',
  templateUrl: './polymer-entry-form.component.html',
  styleUrls: ['./polymer-entry-form.component.css']
})
export class PolymerEntryFormComponent implements OnInit {
  polymerName: string;

  molarHigh: number;
  molarLow: number;
  molarMassRange: [number, number]; //This syntax is for a tuple.

  solventList: string;
  solventType: string;
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

  /*
    This creates a list of type PolymerEntry list and it will be used to continuously push new entries into the db
    and then update the db using the firestore realtime db.
  */
  entries: PolymerEntry[];

  //Need the constructor to initialize the http variable.
  constructor(private http: HttpClient){
    this.polymerName = "";

    this.molarHigh = 0;
    this.molarLow = 0;
    this.molarMassRange = [this.molarHigh, this.molarLow];

    this.solventList = "";
    this.solventType = "";
    this.solvent = [this.solventList, this.solventType];

    this.diameter = 0;
    this.poreSize = 0;
    this.columnLength = 0;
    this.columnName = "";
    this.temp = 0;
    this.pressure = 0;
    this.flowRate = 0;
    this.injVolume = 0;
    this.detectors = [];
    this.DOI = "";
    //This next part is just putting in a default PolymerEntry ojbect that is just filled with the empty values.
    this.entries = [new PolymerEntry(this.polymerName, this.molarMassRange, this.solvent, this.diameter,
      this.poreSize, this.columnLength, this.columnName, this.temp, this.pressure, this.flowRate,
      this.injVolume, this.detectors, this.DOI)];
  }

  fields = [
    { name: 'polymerName', label: 'Polymer Name' },
    { name: 'molarMassLow', label: 'Molar Mass Range Low' },
    { name: 'molarMassHigh', label: 'Molar Mass Range High' },
    //{ name: 'kdCriticalHigh', label: 'Kd Critical High' },
    //{ name: 'kdCriticalLow', label: 'Kd Critical Low' },
    { name: 'solvent', label: 'Solvent' },
    { name: 'composition', label: 'Composition' },
    { name: 'particleDiameter', label: 'Particle Diameter' },
    { name: 'poreSizes', label: 'Pore Sizes' },
    { name: 'columnLength', label: 'Column Length' },
    { name: 'columnName', label: 'Column Name' },
    { name: 'temperature', label: 'Temperature' },
    { name: 'pressure', label: 'Pressure' },
    { name: 'flowRate', label: 'Flow Rate' },
    { name: 'injectionVolume', label: 'Injection Volume' },
    { name: 'detectors', label: 'Detectors' },
    { name: 'doiNumber', label: 'DOI Number' },
  ];

  entryForm!: FormGroup;

  ngOnInit() {
    this.entryForm = new FormGroup({
      'polymerData': new FormGroup({
        'polymerName': new FormControl(null, Validators.required),
        'molarMassRange': new FormControl(null, Validators.required),
        'kdCritical': new FormControl(null, Validators.required),
      }),
      'mobilePhaseData': new FormControl(null, Validators.required),
      'composition': new FormControl(null, Validators.required),
      'stationaryPhaseData': new FormGroup({
        'particleDiameter': new FormControl(null, Validators.required),
        'poreSizes': new FormControl(null, Validators.required),
      }),
      'columnLength': new FormControl(null, Validators.required),
      'columnName': new FormControl(null, Validators.required),
      'chromatographyConditions': new FormGroup({
        'temperature': new FormControl(null, Validators.required),
        'pressure': new FormControl(null, Validators.required),
        'flowRate': new FormControl(null, Validators.required),
        'injectionVolume': new FormControl(null, Validators.required),
        'detectors': new FormControl(null, Validators.required),
      }),
      'references': new FormGroup({
        'doiNumber': new FormControl(null, Validators.required),
      })
    });
  }

  /*
    When the user submits I will take all of the values they put into the input fields and then create a new
    PolymerEntry object and push it into my list. I will then also just return the new list to the realtime
    db so that the db is updated with the new current entries.
  */

  onSubmit() {

    //These tuples need to have their individual values updated accordingly.
    this.molarMassRange = [this.molarHigh, this.molarLow];
    this.solvent = [this.solventList, this.solventType];

    this.entries.push(new PolymerEntry(this.polymerName, this.molarMassRange, this.solvent, this.diameter,
      this.poreSize, this.columnLength, this.columnName, this.temp, this.pressure, this.flowRate,
      this.injVolume, this.detectors, this.DOI))
      //You use put instead of push to auto loop through a list. You can use push for a single value.
    return this.http.put("https://lccc-951e9-default-rtdb.firebaseio.com/entries.json", this.entries
    ).subscribe(response => {
      console.log(response);
    });
  }
}
