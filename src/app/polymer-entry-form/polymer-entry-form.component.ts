import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PolymerEntry } from './polymer-entry-form.module';
import { Injectable } from '@angular/core'; // Library for injection.
import { HttpClient } from '@angular/common/http'; //Library for http requests
import { addDoc, collection } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { AuthService } from '../services/auth.service'; // Probably need this to get the user id.



const firebaseConfig = {
  apiKey: "AIzaSyB7ZIv9yI955npmzc5MSarDB4OJ75aM5p8",
  authDomain: "lccc-951e9.firebaseapp.com",
  databaseURL: "https://lccc-951e9-default-rtdb.firebaseio.com",
  projectId: "lccc-951e9",
  storageBucket: "lccc-951e9.appspot.com",
  messagingSenderId: "490603146752",
  appId: "1:490603146752:web:9667961e622f67770172e5",
  measurementId: "G-TEPQ8F3KYQ"
};


const app = initializeApp(firebaseConfig);
//const app = provideFirebaseApp;

console.log(app);
const db = getFirestore(app);


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
  temperature: number;
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
  constructor(private http: HttpClient, private formBuilder: FormBuilder){
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
    this.temperature = 0;
    this.pressure = 0;
    this.flowRate = 0;
    this.injVolume = 0;
    this.detectors = [];
    this.DOI = "";
    //This next part is just putting in a default PolymerEntry ojbect that is just filled with the empty values.
    //TODO I probably need to delete this class because it is not really necessary.
    this.entries = [
      new PolymerEntry(this.polymerName, this.molarMassRange, this.solvent, this.diameter,
      this.poreSize, this.columnLength, this.columnName, this.temperature, this.pressure, this.flowRate,
      this.injVolume, this.detectors, this.DOI)
    ];
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
    /*
      This is creating an entry form with a form group with group controls so, that I can control the validations for user input.
      You can directly get the values from the entry form and avoid having to use two way binding with this. If you attempt to use
      two way binding it will cause some conflicst so just make sure to just use this
    */
    this.entryForm = new FormGroup({
      polymerName: new FormControl(""),
      molarHigh: new FormControl(NaN),
      molarLow: new FormControl(NaN),
      solventList: new FormControl(""),
      solventType: new FormControl(""),
      poreSize: new FormControl(NaN),
      columnLength: new FormControl(NaN),
      columnName: new FormControl(""),
      temperature: new FormControl(NaN),
      pressure: new FormControl(NaN),
      particle: new FormControl(NaN),
      flowRate: new FormControl(NaN),
      injVolume: new FormControl(NaN),
      detectors: new FormControl(""),
      DOI: new FormControl("")
    })
  }

  /*
    When the user submits I will take all of the values they put into the input fields and then create a new
    PolymerEntry object and push it into my list. I will then also just return the new list to the realtime
    db so that the db is updated with the new current entries.
  */

  onSubmit() {

    //These tuples need to have their individual values updated accordingly.
    this.molarMassRange = [this.entryForm.get('molarHigh')?.value || NaN, this.entryForm.get('molarLow')?.value || NaN];
    this.solvent = [this.entryForm.get('solventList')?.value || "", this.entryForm.get('solventType')?.value || ""];

    const documentData = { //this is just for showing the values inside of the console log for testing
      PolymerName: this.entryForm.get('polymerName')?.value || "",
      MolarMassRange: this.molarMassRange,
      Solvent: this.solvent,
      Diameter: this.entryForm.get('particle')?.value || NaN,
      PoreSize: this.entryForm.get('poreSize')?.value || NaN,
      ColumnLength: this.entryForm.get('columnLength')?.value || NaN,
      ColumnName: this.entryForm.get('columnName')?.value || "",
      Temperature: this.entryForm.get('temperature')?.value || NaN,
      Pressure: this.entryForm.get('pressure')?.value || NaN,
      FlowRate: this.entryForm.get('flowRate')?.value || NaN,
      InjectionVolume: this.entryForm.get('injVolume')?.value || NaN,
      Detectors: this.entryForm.get('detectors')?.value || "",
      DOI: this.entryForm.get('DOI')?.value || ""
    };

    addDoc(collection(db, "PolymerData"), { //This adss a randomized document name and stores in the polymer information.
      PolymerName: this.entryForm.get('polymerName')?.value || "",
      MolarMassRange: this.molarMassRange,
      Solvent: this.solvent,
      Diameter: this.entryForm.get('particle')?.value || NaN,
      PoreSize: this.entryForm.get('poreSize')?.value || NaN,
      ColumnLength: this.entryForm.get('columnLength')?.value || NaN,
      ColumnName: this.entryForm.get('columnName')?.value || "",
      Temperature: this.entryForm.get('temperature')?.value || NaN,
      Pressure: this.entryForm.get('pressure')?.value || NaN,
      FlowRate: this.entryForm.get('flowRate')?.value || NaN,
      InjectionVolume: this.entryForm.get('injVolume')?.value || NaN,
      Detectors: this.entryForm.get('detectors')?.value || "",
      DOI: this.entryForm.get('DOI')?.value || ""

    });

    console.log("Document data:", documentData); //displaying the information which should show in the console log because it is also located in local storage.

  }
}
