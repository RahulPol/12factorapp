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

[package.json][package-json] declare and lock dependencies to specific versions.
[npm][npmjs] installs modules to a local `node_modules` dir so each
application's dependencies are isolated from the rest of the system.
