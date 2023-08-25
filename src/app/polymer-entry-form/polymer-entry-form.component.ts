import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../../environments/firebase";
import { AuthService } from "../services/auth.service";
import { user } from "@angular/fire/auth";
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-polymer-entry-form',
  templateUrl: './polymer-entry-form.component.html',
  styleUrls: ['./polymer-entry-form.component.css']
})

export class PolymerEntryFormComponent implements OnInit {
  polymerName: string;
  molarHigh: number;
  molarLow: number;
  molarMassRange: [number, number]; // This syntax is for a tuple.
  solvents: string;
  solventType: string;
  solvent: [string, string];
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

  // Need the constructor to initialize the http variable.
  constructor(
    // Inject
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
  constructor(private http: HttpClient, private formBuilder: FormBuilder, private afAuth: AngularFireAuth) {
    this.polymerName = "";
    this.molarHigh = 0;
    this.molarLow = 0;
    this.molarMassRange = [this.molarHigh, this.molarLow];
    this.solvents = "";
    this.solventType = "";
    this.solvent = [this.solvents, this.solventType];
    this.diameter = 0;
    this.poreSize = 0;
    this.columnLength = 0;
    this.columnName = "";
    this.temperature = 0;
    this.pressure = 0;
    this.flowRate = 0;
    this.injectionVolume = 0;
    this.detectors = [];
    this.DOI = "";

    this.compositionValidator = this.compositionValidator.bind(this);
  }

  /*
    This is creating an entry form with a form group with group controls so, that I can control the validations for user input.
    You can directly get the values from the entry form and avoid having to use two-way binding with this. If you attempt to use
    two-way binding it will cause some conflict so just make sure to just use this
  */
  entryForm!: FormGroup;
  // Hold the user's UID
  currentUserId: string | null = null;
  // Flash the user about issues
  errorMessage: string = '';

  ngOnInit() {
    // Check if a user is authenticated
    if (!this.currentUserId) {
      console.error("User is not authenticated");
      return;
    }
    this.entryForm = new FormGroup({
      polymerName: new FormControl("", Validators.required),
      molarLow: new FormControl("", Validators.required),
      molarHigh: new FormControl("", Validators.required),
      solvents: new FormControl("", Validators.required), // TODO  test this
      solventType: new FormControl("", Validators.required), // TODO test this
      composition: new FormControl(""),
      poreSize: new FormControl("", Validators.required),
      columnLength: new FormControl("", Validators.required),
      columnName: new FormControl("", Validators.required),
      temperature: new FormControl("", Validators.required),
      pressure: new FormControl("", Validators.required),
      particle: new FormControl("", Validators.required),
      flowRate: new FormControl("", Validators.required),
      injectionVolume: new FormControl("", Validators.required),
      detectors: new FormControl(""), //TODO  test this
      DOI: new FormControl(""),
    }, {validators: this.compositionValidator});

    // Subscribe to the userId$ observable.
    // This is used to associate the user submitting form.
    this.authService.userId$.subscribe(userId => {
      this.currentUserId = userId;
    })
    }, { validators: this.compositionValidator });

    this.getCurrentUserUID(); // Calling function to Grab the UID of the current signed in user
  }

  // Custom validator at form level
  compositionValidator(form: AbstractControl) {
    if (!(form instanceof FormGroup)) {
      return null;
    }

    const solvents = form.get('solvents')?.value.split(',').map((s: string) => s.trim());
    const composition = form.get('composition')?.value;
    if (solvents && solvents.length > 1 && (!composition || composition === '')) {
      return { 'compositionRequired': true }; // error if multiple solvents but no composition
    }
    return null;
  }

  get showComposition(): boolean {
    const solvents = this.entryForm.get('solvents')?.value.split(',');
    return solvents && solvents.length > 1;
  }

  async onSubmit() {
    // Check if the user is authenticated
    if (!this.currentUserId) {
      console.error("User is not authenticated");
      // Optionally: Display an error message to the user
      this.errorMessage = "You must be logged in to submit the form";
      return;
    }

    // Check if the form is valid
    if (this.entryForm.invalid) {
      console.error("Form is not valid");
      // Optionally: Display an error message to the user
      this.errorMessage = "Please fill all required fields correctly";
      return;
    }
    // These tuples need to have their individual values updated accordingly.
    const detectorsList = this.entryForm.get('detectors')?.value.split(',').map((d: string) => d.trim());
    const solventsList = this.entryForm.get('solvents')?.value.split(',').map((s: string) => s.trim());

    // Document to send to firebase.
    const documentData = {
      Polymer: this.entryForm.get('polymerName')?.value || "",
      MolarMassRange: [this.entryForm.get('molarLow')?.value || NaN, this.entryForm.get('molarHigh')?.value || NaN],
      Solvent: solventsList,
      Composition: this.entryForm.get('composition')?.value || "",
      Diameter: this.entryForm.get('particle')?.value || NaN,
      PoreSize: this.entryForm.get('poreSize')?.value || NaN,
      ColumnLength: this.entryForm.get('columnLength')?.value || NaN,
      ColumnName: this.entryForm.get('columnName')?.value || "",
      Temperature: this.entryForm.get('temperature')?.value || NaN,
      Pressure: this.entryForm.get('pressure')?.value || NaN,
      FlowRate: this.entryForm.get('flowRate')?.value || NaN,
      InjectionVolume: this.entryForm.get('injectionVolume')?.value || NaN,
      Detectors: detectorsList,
      DOI: this.entryForm.get('DOI')?.value || "",

      // Submit user ID with their form data submitted to database.
      userId: this.currentUserId,
      uid: this.userId

    };

    try {
      await addDoc(collection(db, "PolymerData"), documentData);
      console.log("Document successfully written!");
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  // Get the UID of the current user who is signed in. Needed to make this to only show results that each individual has created for their own account.
  userId: string = '';
  getCurrentUserUID(): void {
    this.afAuth.user.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        console.log('Current user UID:', this.userId);
      } else {
        // User is not signed in
        console.log('No user is currently signed in');
      }
    });
  }
}
