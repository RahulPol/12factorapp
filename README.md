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
