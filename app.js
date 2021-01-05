const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./lib/htmlRenderer");


const employeeList = [];

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
const questions = [
    {
        type: "input",
        name: "name",
        message: "Please enter employee name:"
    },
    {
        type: "input",
        name: "id",
        message: "Please enter employee ID number:"
    },
    {
        type: "input",
        name: "email",
        message: "Please enter employee e-mail address:"
    },
    {
        type: "list",
        name: "role",
        message: "What is the employee's role in the team?",
        choices: [{
            name: "Manager"
        },
        {
            name: "Engineer"
        },
        {
            name: "Intern"
        }]
    },
    {
        type: "input",
        name: "officeNumber",
        message: "Please enter manager's office number:",
        when: function(answers){
            return answers.role === "Manager";
        }
    },
    {
        type: "input",
        name: "github",
        message: "Please enter engineer's github username:",
        when: function(answers){
            return answers.role === "Engineer";
        }
    },
    {
        type: "input",
        name: "school",
        message: "What is the name of the school you're currently attending?",
        when: function(answers){
            return answers.role === "Intern";
        }
    }
];
function promptUser() {

   inquirer.prompt(questions).then(function(response) {
       if (response.role === "Manager") {
           const newManager = new Manager(response.name, response.id, response.email, response.officeNumber);
           employeeList.push(newManager);
       }
       else if (response.role === "Engineer") {
           const newEngineer = new Engineer(response.name, response.id, response.email, response.github);
           employeeList.push(newEngineer);
       }
       else if (response.role === "Intern") {
           const newIntern = new Intern(response.name, response.id, response.email, response.school);
           employeeList.push(newIntern);
       }
       newEmployee();
   });
};

function newEmployee() {
    inquirer.prompt([
        {
            type:"confirm",
            name:"newEmployee",
            message:"Would you like to enter another employee?",
            default:true
        }
    ]).then(function(answers) {
        if (answers.newEmployee) {
            promptUser();
        }
        else {
            const html = render(employeeList);
            fs.writeFile(outputPath, html, function(err) {
                if (err) throw err;
            })
        }
    })
}

promptUser();