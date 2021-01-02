<img src="https://i.imgur.com/qSi9W5J.png" title="source: imgur.com" />

<p align="center">
  <img src="https://img.shields.io/github/v/release/paolotiu17/recome" title="source: imgur.com" />
  <a href="https://codeclimate.com/github/paolotiu17/recome/maintainability"><img src="https://api.codeclimate.com/v1/badges/df29e23aa3d74606e675/maintainability" /></a>
  <a href="https://recome.site">
 <img alt="Website" src="https://img.shields.io/website?url=https%3A%2F%2Frecome.site">
  </a>
</p>




Get recommendations exactly the way you want them. With multiple metrics to adjust you can find new songs recommended for you by you.

Aside from recommendations there are other cool things to see. Recome is able to generate photos of your top tracks and artists from various time ranges. Recome also makes an analysis based of the tracks you saved and visualizes them into charts and graphs.

Recome is built with React Typescript, NodeJS, and is hosted on Netlify with Netlify Lambda functions.

### Installation



```
$ git clone https://github.com/paolotiu17/recome.git
$ cd app
$ yarn install
$ cd ../server
$ yarn install
```

Recome was first built with a NodeJS server, but eventually ported over to lambda functions. The `server` folder works exactly the same way as the `netlify_functions` folder. 



#### Creating a spotify app
Recome needs Spotify authentication to function. 
<ol>
    <li>
    Login to your <a href="https://developer.spotify.com/dashboard/applications"> Spotify Dashboard </a> and click <strong>  Create an App </strong>
    </li>
    <li>
        Give your app a name and description, accept the terms, and click
        <strong> Create </strong>
    </li>
    <li>
    The app view will open. Click on <strong>  Edit Settings </strong> and add <code>http://localhost:8888/.netlify/functions/callback</code> or <code>http://localhost:8888/callback</code> to the Redirect URIs field depending on which kind of server you choose
    </li>
</ol>
More detailed instructions can be found on the <a href="https://developer.spotify.com/"> Spotify Developers </a> page


### Setup

This section will be divided into 2 paths. The first is if you'll be using netlify/lambda functions. The second is for a seperate NodeJS server.

#### Path #1: Netlify Functions Integration 
##### Configure your user variables

In `/app` create a `.env` file and replace your credentials with the template below.

```
REACT_APP_LOGIN_URL=http://localhost:8888/.netlify/functions/login
SPOTIFY_CLIENT_ID=<YOUR_CLIENT_ID_HERE>
SPOTIFY_CLIENT_SECRET=<YOUR_CLIENT_SECRET_HERE>
APP_URL=http://localhost:8888/landing
REDIRECT_URI=http://localhost:8888/.netlify/functions/callback
```

##### Running the website

```
$ cd app
$ netlify dev
// Website is live on https://localhost:8888
```


&nbsp;
#### Path #2: Seperate NodeJS server
##### Configure your user variables
In the `/app` folder create a `.env` file then copy and paste the line below.
```
REACT_APP_LOGIN_URL=http://localhost:8888/login
```

In the `/server` folder create a `.env` file and replace your credentials with the template below.
```
SPOTIFY_CLIENT_ID=<YOUR_CLIENT_ID_HERE>
SPOTIFY_CLIENT_SECRET=<YOUR_CLIENT_SECRET_HERE>
REDIRECT_URI=http://localhost:8888/callback
APP_URL=http://localhost:3000/landing
```

##### Running the website
```
$ cd app
$ yarn start
// Website is live on https://localhost:3000

$ cd ../server
$ yarn dev
// Server is now live on https://localhost:8888 
```





