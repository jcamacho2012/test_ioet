# test_ioet
Test Ioet

Overview of Solution
I created a node.js aplication, which read every line of a text file. All data is in format string, so i had to use the function split to separate the values in a array object.
Also I had two problems, the first was the range of hours worked in the table because the last row finished at 00:00, so i had to change the value to 24:00. The second was the object Date, when i was working with the local time, i was getting the hours plus 5 hours, so i defined a constant called gmt and then adds it to local hour.

Architecture:
the Project contains the following:
*utils --folder

*utils/const.js
This file contains the structure of hours worked per day.

*utils/index.js
The file contains the auxiliars functions that i had to used, trying to separate the code in small blocks

*file_to_read.txt
The file contains the information to read (hours worked per employees)

*index.js
The main file with excecute the program.

Requirements:
Node v11.15

Run application:
*git clone git@github.com:jcamacho2012/test_ioet.git
*In folder of project, open a terminal and execute: node index.js
