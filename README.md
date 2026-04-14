Video Hosting / Streaming Site 




A platform for filmakers to showcase their movies 


Tools use to make this _  PER STACK
Frontend - HTML, CSS, Javascript, React, 
Backend - Node, Express 
Database - Postgres, SQL  
Implemented CRUD operations for PostgresSQL database interactions. 
Developed All the APIs for transfer of Data of users and movies. 

Featuers added 
- fix worker/index.js - now app can connect locally and online with frontend and backend 
- Cloudflare Stream and storage delete works. when deleting account, everything deletes on cloudflare stream and R2 storage space. 
- When deleting a movie, it will also delete on stream and r2 
- Improved form validation, erros will now show if forms are not filled out. 


Features That need to be added
- re-upload profilepic, 
- Add Bios for users 
- Update form to add honeypot field, Bot prevention 
- Add a uploading Bar 
- Add Features for users to put up shows
- Create a schdule premiere - where user can upload but then schedule to release later. 
- Improve form validation 
    -Add a confirm password field 
    -**Resetting Password**
- Create and intergrate Search bar functionalities  
- **Intergrating an encoder to encode footage down to h264**
- Intergrating an Encoder to encode footage - understanding of file type, file wrapper, encoders
- Intergrating mircoservices for trancations. 

To use this project. 

Project Layout 
This project has 
A user Sign up form page 
A user Login form page 
A user Dashboard to show case everything a user's library of movies
A page for user to upload their movie, an upload form page  
A profile page of other users....

Step 1 - fork the repo onto your computer 

Step 2 - ...