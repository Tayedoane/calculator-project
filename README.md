# Post Project Review
The goal of this project was to be able to combine the html, css, and Javascript i had learned into a short project, that can be useful. I had decided on a google-like calculator, where you can both type and press buttons to create math expressions.

The main idea behind this calculator is that it converts a string into an array, seperating by diffrent operations and numbers. The string "3 + 2 * 4" => [3, Operations.ADD, 3, Operations.MUL, 4]. Then once converted into an array, the array searches every operation and find the highest priority. Once the highest priortity is found, it uses the operation's calculate method in order to preform an operation on surranding numbers. Diffrent types of operations have diffrent inputs, some preform on a single left number (!, $), some are functions, (root(), dist(), etc.). All of them however take the numbers around them in the array to perform an innate calculation, and mutates the array itself to only have the result. Using the example from before, the list would find Operations.MUL to have the highest priority, and use it's calculate method on it's surronding numbers 3, and 4, which converts the array to => [3, Operations.ADD, 12]. This process repeats untill one number remains. So array finally becomes [15] and is returned.

In terms of the final results of the project it supports 3 major operation types(unary, function, and center). It can also support grouping symbols. The initial goal has also been reached, having both interface for typing on a keyboard, along with 35 usable buttons to operate the calculator.

The largest struggles I personally had with this project was parsing through user input. I chose to mainly use regex expressions in order to do this. I felt regex expressions were complicated and hard to use, but ultimately found them very useful for this task. In the future, I will work to understanding them better in order to use more efficently.

I also struggled with seperating javascript files, I orginally wanted to have multipe diffrent javascript files for diffrent objects, with one main file to be linked with the html, but ultimated opted for keeping all in one file. I still don't think this choice was optimal, but for a smaller project, I believe it is substainable. For larger projects, however, I will have to use proper file seperation

A major personal goal I had for the project was that I wanted the operations to be easy to add onto. If you wanted another operation, all you would have to do is declare it's type, and the operation itself. Because of this I used OOP design in order to acomplish this. This design idea proved useful in a very specific case invovling large numbers. In Javascript, exremely large or small numbers are converted into scientific notation, which early on screwed with results, as the regex expression I made was not built to handle it. I found the easiest solution was to simply use the design pattern I made, and make two new operations for e+ and e-. This worked, and it felt very cool knowing the past me purposely paved an easier path for the current one.

If I were to continue this project in the future, one feature I would like to add would be user made operations, where a user could set a key symbol (like an emoji or greek symbol) that represent an operation. 

Overall I am very happy with the results! I honestly don't think this is the most unique project, but I feel very happy to have actually created something. I feel for a lot of parts of programming I learned in school were extremely fundemental. These fundemental values are extremely important to know, but it makes it hard to immediatly create something. I have tried in the past to create something useable, but ultimately wound up in situations where I felt I was constantly having to look things up without actually learning. I am not the most familar with the tools I used for this project, but I feel they were perfect for my goal of building something on the front end, that could be reasonably used. I believe the best way to learn is to do, and this project is the result of that!






