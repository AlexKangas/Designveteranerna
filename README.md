# Designveteranerna

### Install and usage
To get the project to work, just clone this repo, move yourself to the folder inside a terminal or cmd and type "npm install". To run the server type "node app.js". The server is then exectued on port 3000 on your computer. Go to "http://localhost:3000/" in a browser to see the website. 
If a user wants to connect they will need to type the ip-adress of the computer that the server is being held on and the port 3000 e.g "ip-adress:port".
Example: If the host's ip-adress is 999.999 then the users simply need to visit "999.999:3000" and log in as a participant

### Logging in 
Users logs in by clicking at the link "Log in as participant" while the manager clicks on the link "Log in as manager". The manager view isn't password protected yet.

### Replace dummy participants
To replace the precoded users it is required to manually go inside the manager_start.html - file and remove the desired dummy users. When doing this make sure to remove both the id within the 'td' element and the text content between the 'td' tag and '/td' tag when doing this.

If it is desired to add a dummy user then it is required to manually open the 'manager_start.html' - file and add desired usernames between the 'td' tag and the '/td' tag, remember to write in the name inside the id of the 'td' element.
