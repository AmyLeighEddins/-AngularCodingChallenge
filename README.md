# AngularCodingChallenge

Website hosted on Heroku: https://shipt-coding-challenge.herokuapp.com/
Repo on Github: https://github.com/AmyLeighEddins/ShiptCodingChallenge
LinkedIn: https://www.linkedin.com/in/amy-eddins/ 

My single page website allows users to enter in a Github username and see the username's follower count and the first 30 followers. There is a "Load More" button at the bottom to load the next 30, and it will continue to appear until there are no more to show. It asks for a valid username if the field is blank or an invalid username is entered. If the username has no followers it tells the user. If you click on a follower's icon you can go to their Github profile. If you click on a follower's name it will search for their followers.

I chose to use AngularJS for my project because that is what I am most familiar with since I used it while on the Mobile development team at Command Alkon. Before that, I had no web development experience. Also, Angular is great for simple websites. I was on the team for less than 2 years, half the time working with a team that did not use Angular. I chose to host it with Heroku because that is what I am using with my own website amyeddins.com. I used Git on the command line to make my commits. I chose to do unit testing after first thinking about e2e testing since I have experience with protractor and selenium, but decided unit testing with Karma and Jasmine would be better. I had to learn how to mock api calls and services to complete the unit tests. This is a part I had trouble with since I don't have experience with Angular unit testing. 

Added functionality:

    -If you click on a follower's icon you can go to their Github profile.
    -If you click on a follower's name it will search for their followers.
    -Shows the count of the user's followers.

To run app:

    - $ npm install
    - $ npm start

To run tests:

    - $ npm install
    - $ npm test


Github API bug:

Github is returning the wrong total number of followers SOMETIMES. I emailed support@github.com about this issue, and the issue was sent to the engineering team, so it might be fixed by the time you see this. 

If you go to my Github followers: https://github.com/AmyLeighEddins?tab=followers

It says I have 3 and it lists the 3 followers. Same for the api:

https://api.github.com/users/amyleigheddins -followers total of 3
https://api.github.com/users/AmyLeighEddins/followers -array of 3


But if you go to my friend's Github followers: https://github.com/manufacturedba?tab=followers

It says he has 16 followers, but if you count them it lists 17 followers. Same for the api:

https://api.github.com/users/manufacturedba -followers total of 16
https://api.github.com/users/manufacturedba/followers -array of 17
