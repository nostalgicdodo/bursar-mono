# Bursar

# How to setup:

1. Install NodeJS from [here](https://nodejs.org/en/download/)
2. Install GIT by following this [link](https://git-scm.com/downloads)
3. Run ```git clone```
4. Download and install Redis for [Windows](https://github.com/zkteco-home/redis-windows/releases) or [Linux](https://redis.io/download)
5. Run ```npm i```
6. Setup DB as per below instructions
7. Change APP_NAME and other env credentials on .env files if needed, it should work for localhost without any changes.
8. [Optional] To create all tables run: ```node deploy/migrate.js```
8. Run app using ```npm run dev-server```

# DynamoDB Setup

1. Download and extract DynamoDB zip file of US West Zone from this [link](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html).
2. Install Java runtime by downloading from this [site](https://www.oracle.com/java/technologies/downloads/) and following the wizard.
3. Go to the directory where zip from first step was extracted and type this command: 
    - Windows:
    ```echo java -D"java.library.path=./DynamoDBLocal_lib" -jar DynamoDBLocal.jar >> runDB.bat```
    - Linux/Mac:
    ```echo java -D"java.library.path=./DynamoDBLocal_lib" -jar DynamoDBLocal.jar >> runDB.sh```
4. Now everytime to run the DB just open command on the same directory and run
    - Windows:
    ```./runDB.bat```
    - Linux/Mac:
    ```sh ./runDB.sh```
