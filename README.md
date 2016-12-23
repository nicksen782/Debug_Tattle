# Debug & Tattle

PHP Debug Tattle. Using this in your code will allow you to store a message with values.
For example, you have an SQL result query and you want to analyse the results or an error message or the prepare status.
Normally you would need to echo this to the screen (which clutters up the page) or use trigger_error.
This method writes a value to an Sqlite database which you can view later with a web viewer. Requires PDO and the Sqlite drivers installed in your PHP install.
Has been tested with Linux/Apache and Windows/IIS.

This uses Emscripten and an Uzebox emulator (Cuzebox) to play Uzebox games online. This program keeps a database of Uzebox roms and can easily switch between games.


You will need PHP, Linux (Ubuntu/CentOS has worked), and Sqlite drivers. You can install the drivers with this command:
sudo apt-get install php5-sqlite
