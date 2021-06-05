# quoality
quoality
Architecture diagram: done
DB design: done
APIs:
Hotel CRUD(Single and Hotel Chain): done
Services CRUD: done
Add guest CRUD: done
List of the hotels: done
List of chains: GOOD TO done
List of all the services: done
Count of all the guests in the system: no
It should be easy to add new services. - Microservices are used


How long did you spend on the coding test?
6-8 hours 
What would you add to your solution if you had more time? If you didn't spend much time on the coding test then use this as an opportunity to explain what you would add.
I would have added another microservice for guests crud instead of doing them in hotels microservice

What was the most useful feature that was added to the latest version of your chosen language/framework? Please include a snippet of code that shows how you've used it.
Diagnostic in nodejs
node --report-uncaught-exception --report-on-signal \
--report-on-fatalerror app.js
This will give report in json format about exceptions and error during runtime

How would you track down a performance issue in production? Have you ever had to do this?
We would check the logs and try to replicate the issue in development environment


STEPS TO RUN CODE
in services folder
1] npm i to install dependencies
2] nodemon server.js

in server folder
1] npm i to install dependencies
2] nodemon server.js

requirement
mongodb latest version in localhost:27017
