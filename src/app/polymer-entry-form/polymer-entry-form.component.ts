import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-polymer-entry-form',
  templateUrl: './polymer-entry-form.component.html',
  styleUrls: ['./polymer-entry-form.component.css']
})
export class PolymerEntryFormComponent implements OnInit {
  fields = [
    { name: 'polymerName', label: 'Polymer Name' },
    { name: 'molarMassRangeLow', label: 'Molar Mass Range Low' },
    { name: 'molarMassRangeHigh', label: 'Molar Mass Range High' },
    { name: 'kdCriticalHigh', label: 'Kd Critical High' },
    { name: 'kdCriticalLow', label: 'Kd Critical Low' },
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

  onSubmit() {
    console.log(this.entryForm.value);
  }
}
