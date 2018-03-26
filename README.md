# hexo-comments

## Introduction
This is an open-sourse extension for [hexo bloging framework](https://hexo.io/), which allows readers to add comments to the blog posts.<br>

Since hexo is mostly used by designers and developers, the extension was designed to allow the user to change everything he wants, without breaking the project.<br>
On the other hand, the basic functionality is easy to setup and use with just a few steps.

## Step-by-step
In the next section there is a guide on the project setup as well as a quick description of the project configuration. But some other topics like <b>facebook</b> or <b>google</b> authentication are not explained in detail. Since both facebook and google apis change very frequently, it is sometimes difficult to find up to date info on setting them up. Here are some links to step-by step guides on those particular topics:<br>
[Setting up hexo blog with comments](http://andreisbitnev.com/2018/03/25/hexo-comments/)<br>
[Creating Google Sign-In project](http://andreisbitnev.com/2018/03/23/Google-Sign-In-project/)<br>
[Creating Facebook Sign-in app](http://andreisbitnev.com/2018/03/23/facebook-authentication-app/)<br>

## Setup

Go to your hexo blog root folder and clone the [hexo-comments](https://github.com/andreisbitnev/hexo-comments) into it.
```bash
git clone https://github.com/andreisbitnev/hexo-comments.git comments
```
Open the post layout file in the text editor and insert the followind lines, where you want the comments to appear.
```html
<div id="cmt-comment-area"></div>
<script src="/assets/cmtModule.js" data-cmt-id="cmt-comment-area"></script>
```
>Tip: in the default "landscape" template, the layout file location is ~/themes/landscape/layout/_partial/article.ejs

Genrate the static files of your blog by running
```bash
hexo generate
```
Go to the cloned repository folder "comments" and install the dependencies by running 
```
npm install
```
From the same directory run 
```
npm run setupDb
```
to setup the database, which will store comments and user sessions

>Tip: sqlite3 is used as a database in this project. It is a very simple and lightweight database, which stores all the data in a .db file.

To start the project just run
```
npm start
```
>Tip: The server will serve your blogs public files as well as manage all the comments, so you don't need to run `hexo start -s`

Open the browser and go to `localhost:4000` and navigate to one of the posts. The comments area should appear, where it was inserted in the post layout file.

## Configuration

Open up config.js file, which is the main configuration file<br>

### Basic configuration:
`port: 4000` - port on which the blog will be served<br>
`securePort: undefined` - port for secure connection. By default set to undefined. To provide the secure connection, ssl key, cert and optionally passphrase should be provided in the ssl section of this file<br>
`database: 'main.db'` - the name of the databse file<br>
`errorLogs: 'error.log'` - the file, which will store the error logs<br>

### Defaults
`defaults: {...}` - holds the default variables used in the templates.<br>
`defaults.name: Guest` - the default name to be displayed for users, who didn't log in.<br>
`defaults.providers: []` - the array of provider names currently available. It should be left as an empty array, it gets populated dynamically, if id and secret values for either google or chrome are provided in the auth object<br>

### SSL config
`ssl: {...}` - holds configuration for secure connection<br>
`key: 'key.pem'` - path to the key file<br>
`cert: 'cert.pem'` - path to the cert file<br>
`passphrase: undefined` - passphrase specified during key creation, if any.<br>
> Tip: to create self signed certificate for 365 days with openssl run `openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365`. Then just copy the files to the projects root directory.

### Authentication
`auth: {...}` - holds the variables used in the auth module for user authentication. After this is set up users will be able to login with google or facebook before leaving their comments<br>
`auth.secret` - string used in session creation. Just create some random string and insert it here<br>
`auth.google: {...}` - object holds the id and secret values for google authentication app. To get those values, you need to configure a new google project. Here\`s a step-by-step guide how to do it [Google Sign-In project](http://andreisbitnev.com/2018/03/23/Google-Sign-In-project/)<br>
>Tip: When creating a google sign in project, specify the <b>"Authorised redirect URIs"</b> as `http://localhost:4000/auth/google/callback`, where 4000 is the server port.

`auth.facebook: {...}` - object holds the id and secret values for facebook authentication app. To get those values, you need to configure a new facebook app. Here\`s a step-by-step guide how to do it [Facebook Sign-In app](http://andreisbitnev.com/2018/03/23/facebook-authentication-app/)<br>
<b>Important:</b> All facebook apps created from March 2018 will have the <b>Enforce HTTPS</b> set. Which means, you will not be able to sign-in with facebook without secure connection. So both <b>SSL</b> and <b>securePort</b> will have to be configured to use this feature.
>Tip: When creating a facebook sign in app, specify the <b>"Valid OAuth Redirect URIs"</b> as `https://localhost:5555/auth/facebook/callback`, where 5555 is the secure server port.

### Templates
`templates: {...}` - holds the names of the templates used to render comments. All the template files should be stored in the ~/templates directory<br>
`templates.container: "container.ejs"` - .ejs template file for the container. It stores the css styles used for comments area styling and inserts the comments.ejs template.<br>
`templates.comments: "comments.ejs"` - .ejs template file for comments. Sets up the comment view and the data to be displayed (name, date, comment text)<br>
`templates.comment: "comment.js"` - comment body [Joi](https://github.com/hapijs/joi) schema. Sets up all the fields needed for the comment object, and validates the data recieved from the front-end.

>Tip: some of the values inside comment.js schema are set to forbidden(), like for example `timestamp`. This means that no timestamp value, should be sent from the fron-end, but it's also a reminder, that it should be created on the back-end
