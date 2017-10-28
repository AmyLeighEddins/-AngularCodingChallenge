# ShiptCodingChallenge
My submission for the Shipt coding challenge.

Website hosted on Heroku: https://shipt-coding-challenge.herokuapp.com/
Repo on Github: https://github.com/AmyLeighEddins/ShiptCodingChallenge

I chose to use AngularJS for my project because that is what I used while on the Mobile development team at Command Alkon. Before that, I had no web development experience. I was on the team for less than 2 years, sometimes working with a team that did not use Angular. I chose to host it with Heroku because that is what I am using with my own website amyeddins.com. I used Git on the command line to make my commits. 

To run app:

    - $ npm install
    - $ npm start

To run tests:

    - $npm install
    - $npm test

Github API bug:

    Github is returning the wrong total number of followers SOMETIMES. 

    If you go to my Github followers: https://github.com/AmyLeighEddins?tab=followers

    It says I have 3 and it lists the 3 followers. Same for the api:

    https://api.github.com/users/amyleigheddins -followers total of 3
    https://api.github.com/users/AmyLeighEddins/followers -array of 3


    But if you go to my friend's Github followers: https://github.com/manufacturedba?tab=followers

    It says he has 16 followers, but if you count them it lists 17 followers. Same for the api:

    https://api.github.com/users/manufacturedba -followers total of 16
    https://api.github.com/users/manufacturedba/followers -array of 17