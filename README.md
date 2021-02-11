# 12factorapp

An express js Restful api that follows 12 factor app principles.

## The Twelve Factors

### [I. Codebase](https://12factor.net/codebase)

**Definition**

One codebase tracked in revision control, many deploys.

**How we do it**

This code is tracked on github. [Git flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) can be used to manage branches for releases.

### [II. Dependencies](https://12factor.net/dependencies)

Explicitly declare and isolate dependencies.

#### How we do it

[package.json](https://github.com/RahulPol/12factorapp/blob/main/package.json) declare and lock dependencies to specific versions.
[npm](https://www.npmjs.com/) installs modules to a local `node_modules` dir so each
application's dependencies are isolated from the rest of the system.

### [III. Config](https://12factor.net/config)

Store config in the environment.

#### How we do it

In localhost configuration is stored in environment variables and supplied through the .env file (Not available in repo as its git ignored!) using [dotenv](https://www.npmjs.com/package/dotenv) package.

In production configuration is supplied through config vars in deployment environment.

Also, we can make the [config class](https://github.com/RahulPol/12factorapp/blob/3-Config/common/config.js) singleton to ensure we don't create unnecessary instances.

### [IV. Backing services](https://12factor.net/backing-services)

Treat backing services as attached resources.

#### How we do it

We connect to the database via a connection url provided by the
`DATABASE_URI` environment variable. If we needed to setup a new database, we
would simply create a new database and bind the
database to our application.

We use a utility that will initiate either mongo or mysql database based on your
environment variable. The same utility also gives database instance to your controller
using dependency injection.

### [V. Build, release, run](https://12factor.net/build-release-run)

Strictly separate build and run stages.

#### How we do it

`package.json` allows to configure "scripts" so that we can codify various
tasks. `npm run build` is used to build this application and produces minified
javascript and css files to be served as static assets.

For this app we have `npm run dev` script to build the app, `npm start` to run the app and `Procfile` to release the app.

### [VI. Processes](https://12factor.net/processes)

Execute the app as one or more stateless processes.

#### How we do it

The node js app is run as an independent process in v8 runtime environment. By stateless the principle means the process store-nothing and share-nothing between requests. Any data that needs to persist must be stored in a stateful backing service, typically a database.

Some web systems rely on “sticky sessions” – that is, caching user session data in memory of the app’s process and expecting future requests from the same visitor to be routed to the same process. Sticky sessions are a **violation** of twelve-factor and should never be used or relied upon. Session state data is a good candidate for a datastore that offers time-expiration, such as Memcached or Redis.

To ensure this principle, we have not used any express session or any mechanism that stores data in process memory.
