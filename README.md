# DockerSandBox Api
and API to manage the connexion and the bdd, (users and pictures)

## Prerequisites
- Node.js 20
- wsl2 (for windows users)
- npm 10.2.3
- docker 
## Installation

## Clone the project
```bash
git clone git@git.ascorel.com:iot/remoteaccess/remoteaccessproject.git
```
## first of all 
#### copy the .env.example to .env and replace the variable you need.

## Run in local environment

#### Install the project dependencies

I recommend you to use pnpm to install the project dependencies.

```bash
pnpm install
```
### Run Project dev mod
```bash
pnpm run dev
```

## Run in docker environment

#### Make sure u have docker in your computer

### Make sur u have the network create 
```bash
docker network create --subnet=172.28.0.0/16 mynetwork
```

#### start the container (API and BDD)

```bash
docker compose up -d
```

and that's it, the project is running, enjoy! 🎉