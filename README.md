Instructions how to run:

- Prerequisite is running MONGODB
	- install MONGODB locally
	- For Windows there are 2 batch scripts run_mongo_server.bat and run_mongo.bat
	- if MONGODB is not setup to run as a service on startup run it manually (double click scripts on Windows)
	
Create .env file in root folder and specify following environment variables (example values provided):
PORT=3000
CLIENT_INACTIVITY_THRESHOLD_MS=30000
MONGODB_URL=mongodb://127.0.0.1:27017/ubio

run following command to install project dependencies:
- yarn

run following command to run application:
- yarn start
