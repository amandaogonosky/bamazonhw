
let shoppinCart = 0;
const sql = require("mysql");
const inquirer = require("inquirer");
const connection = sql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
});
connection.connect(function(err) {
    if (err) throw err;
    start();
    // connection.end(); 
  });
    function start() {
        inquirer
          .prompt({
            name: "cosmicBuys",
            type: "rawlist",
            message: "Would you like to [BUY] anything or [EXIT] ?",
            choices: ["BUY", "EXIT"]
          })
          .then(function(answer) {
            if (answer.cosmicBuys.toUpperCase() === "BUY") {
              buyStuff();
            }
            else {
              
            }
          });
      }
    
      function buyStuff() {
        connection.query("SELECT * FROM products", function(err, results) {
          if (err) throw err;
          inquirer
            .prompt([
              {
                name: "choice",
                type: "rawlist",
                choices: function() {
                  var choiceArray = [];
                  for (var i = 0; i < results.length; i++) {
                    choiceArray.push(results[i].product_name);
                  }
                  return choiceArray;
                },
                message: "What item would you like to buy?"
              },
              {
                name: "quantity",
                type: "input",
                message: "How many would you like to buy?"
              }
            ])
            .then(function(answer) {
              var chosenItem;
              for (var i = 0; i < results.length; i++) {
                if (results[i].product_name === answer.choice) {
                  chosenItem = results[i];
                 
                }
              }
              if (chosenItem.stock_quantity > answer.quantity){
    
            //   console.log("all out,sorry");    
                connection.query(
                  "UPDATE products SET ? WHERE ?",
                  [
                    {
                      stock_quantity: (chosenItem.stock_quantity - answer.quantity)
                    },
                    {
                      item_id: chosenItem.item_id
                    },
                    
                  ],
                  function(error) {
                    if (error) throw err;
                    console.log("thank you");
                    start();
                  }
                );
                shoppinCart=(shoppinCart + (chosenItem.price * answer.quantity));
                console.log(shoppinCart);
                // connection.end(); 
            } else{
                console.log("sorry, all out")
                    start();
            }

        });
      });
    }    

