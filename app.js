const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const employeeSummary = [];

const validateId = async (data) => {
    if (employeeSummary.includes(data) === true) {
        return 'Please enter a unique ID number';
    }
    return true;
};


const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "confirm",
        message: "Add another employee?",
        name: "addEmp",
      },
    ])
    .then(({ addEmp }) => {
      if (addEmp) {
        createEmployee();
      } else {
        const output = render(employeeSummary);
        fs.writeFile(outputPath, output, (error) => {
          if (error) {
            console.log(error);
          }
        })
      }
    })
};


const createEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What\'s the employee\'s name?",
        name: "name",
        validate: val => (val.length < 3) ? "Name must be at least 2 or more characters" : true,

      },
      {
        type: "input",
        message: "What\'s the employee\'s ID?",
        name: "id",
        validate: val => (isNaN(parseInt(val))) ? "Must be a number":true,
      },
      {
        type: "input",
        message: "What\'s the employee\'s email?",
        name: "email",
        validate: function (answer) {
          if (answer.includes(" ")) {
            return "Please provide an email.";
          } else {
            return true;
          }
        },
      },
      {
        type: "list",
        message: "What\'s the employee\'s role?",
        name: "role",
        choices: [
          { name: "Manager", value: createManager },
          { name: "Engineer", value: createEngineer },
          { name: "Intern", value: createIntern },
        ],
      },
    ])
    .then(({ name, id, email, role }) => {
      role(name, id, email);
    })
};


const createManager = (name, id, email) =>
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the manager\'s office number?",
        name: "officeNumber",
        validate: val => (isNaN(parseInt(val))) ? "Must be a number":true,
      },
    ])
    .then(({ officeNumber }) => {
      const manager = new Manager(name, id, email, officeNumber);
      employeeSummary.push(manager);
  
      addEmployee();
    });


const createEngineer = (name, id, email) =>
  inquirer
    .prompt([
      {
        type: "input",
        message: "What\'s their GitHub username?",
        name: "gitHub",
        validate: function (answer) {
          if (answer.includes(" ")) {
            return "Please provide a valid username.";
          } else {
            return true;
          }
        },
      },
    ])
    .then(({ gitHub }) => {
      const engineer = new Engineer(name, id, email, gitHub);
      employeeSummary.push(engineer);
      
      addEmployee();
    });


const createIntern = (name, id, email) =>
  inquirer
    .prompt([
      {
        type: "input",
        message: " What\'s the name of the intern?",
        name: "school",
        validate: val => (val.length < 3) ? "Please enter full university name" : true,
      },
    ])
    .then(({ school }) => {
      const intern = new Intern(name, id, email, school);
      employeeSummary.push(intern);
      addEmployee();
    });


createEmployee();