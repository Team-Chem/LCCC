# Overview
The LCCC (Liquid Chromatography at the Critical Condition, or LC3x for short) web project was developed by the Chemistry department at the University of Memphis. This project involves a cloud hosted database of research experiments from the use of LCCC techniques to analyze complex mixtures and provide detailed information about their components. This doucment provides instructions on how to install and use the necessary software to run the web application on your local machine or hosting on a web server.

# Getting Started

## Prerequisites
1. Node.js. [Download](https://nodejs.org/en/download) (LTS recommended)
2. npm: Type ```npm install -g @angular/cli@15.1.6``` inside the terminal to install Angular globally (-g), specicially version 15.1.6
3. Clone Repository: Clone the source code by either directly downloading the files, or via Git CLI ```git clone git@github.com:Team-Chem/LCCC.git```
4. Firebase: Requirements firestore folder in this path `node_modules/@angular/fire/compat/firestore` with this folder [here](https://github.com/Team-Chem/LCCC/tree/main/Firestore%20Dependencies%20Download)
5. Start Server: In your terminal, type ```ng serve``` which will start the application, then you can visit the application in the browser.
