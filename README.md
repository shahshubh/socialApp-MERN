 
 <div align="center">

 # socialApp
[![](https://img.shields.io/badge/Made_with-Nodejs-red?style=for-the-badge&logo=node.js)](https://nodejs.org/en/)
 [![](https://img.shields.io/badge/Made_with-ReactJS-blue?style=for-the-badge&logo=react)](https://reactjs.org/docs/getting-started.html)
[![](https://img.shields.io/badge/Database-MongoDB-red?style=for-the-badge&logo=mongodb)](mongodb.com "MongoDB")
[![](https://img.shields.io/badge/IDE-Visual_Studio_Code-red?style=for-the-badge&logo=visual-studio-code)](https://code.visualstudio.com/  "Visual Studio Code")
[![](https://img.shields.io/badge/Deployed_on-Netlify-red?style=for-the-badge&logo=netlify)](https://www.netlify.com/  "Netlify")
</div>

A Social Networking web app similar to Instagram.

## Deployed website

[]()

## Demo 

<div align="center">

<h4 align="center">Home Page</h4>
<img src="./demo/home.png" width=900px/>
<br>
<h4 align="center">Comments</h4>
<img src="./demo/comments.png" width=900px/>
<br>
<h4 align="center">Profile Page</h4>
<img src="./demo/profile.png" width=900px/>
<br>
<h4 align="center">Confirm</h4>
<img src="./demo/confirm.png" width=900px/>
<br>
<h4 align="center">Chat</h4>

![demovideo](./demo/chat.gif)
<br>
<h4 align="center">Reset Password</h4>
<img src="./demo/resetpassword.png" width=900px/>
<br>


</div>

### To run the project locally

* clone this Repository by `git clone https://github.com/shahshubh/socialApp-MERN.git`.
* Inside /server directory create a .env file and add these
    - `MONGO_URI=mongodb+srv://socialapp:socialapp@cluster0-o6fur.mongodb.net/test?retryWrites=true&w=majority`
    - `PORT=8080`
    - `JWT_SECRET=any-random-string-of-any-length`
    - `CLIENT_URL=http://localhost:3000`
* Inside /client directory create a .env file and add
    - `REACT_APP_API_URL=http://localhost:8080`
* Change the directory to /server in the terminal and run:
    - `npm install`
    - `node app.js`
* Change the directory to /client in the terminal and run:
    - `npm install`
    - `npm start`
* Open your browser and enter url `localhost:3000`

## Tech Stack of this Project

* Frontend: Reactjs, Bootstrap Material
* Backend: Nodejs
* Framework: Expressjs
* Database: MongoDB