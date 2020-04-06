# Designveteranerna

### Install and usage
To get the project to work, just clone this repo, move yourself to the folder inside a terminal or cmd and type "npm install". To run the server type "node app.js". The server is then exectued on port 3000 on your computer. Go to "http://localhost:3000/" in a browser to see the website. 
If a user wants to connect they will need to type the ip-adress of the computer that the server is being exectued on and the port 3000 e.g "ip-adress:port". If the host's ip-adress is 999.999 then the users simply need to visit "999.999:3000" and log in as a participant

### Log in 
Users logs in by clicking at the link "Log in as participant" while the manager clicks on the link "Log in as manager".

### Replace dummy participants
To replace the precoded users, it is required to manually go inside manager_start.html and remove the desired dummy users. Be sure to remove both the id within the 'td' element and the text content within the element when doing this.
