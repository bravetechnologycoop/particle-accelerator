#!/bin/bash

# Check if the .env file path is provided as an argument
if [ -z "$1" ]; then
  echo "Usage: $0 path_to_.env_file"
  exit 1
else
    while IFS="=" read -r name value; do
        if [[ "$name" == "REACT_APP_SENSOR_DB_USER" ]]; then
            SENSOR_DB_USER="$value"
        elif [[ "$name" == "REACT_APP_SENSOR_DB_PORT" ]]; then
            SENSOR_DB_PORT="$value"
        elif [[ "$name" == "REACT_APP_SENSOR_DB_PASSWORD" ]]; then
            SENSOR_DB_PASSWORD="$value"
        elif [[ "$name" == "REACT_APP_SENSOR_DB_HOST" ]]; then
            SENSOR_DB_HOST="$value"
        elif [[ "$name" == "REACT_APP_SENSOR_DB_NAME" ]]; then
            SENSOR_DB_NAME="$value"
        elif [[ "$name" == "REACT_APP_PARTICLE_API_TOKEN" ]]; then
            API_TOKEN="$value"
        fi
    done < $1
fi

# Check if necessary variables are loaded
if [ -z "$SENSOR_DB_PASSWORD" ] || [ -z "$SENSOR_DB_USER" ] || [ -z "$SENSOR_DB_HOST" ] || [ -z "$SENSOR_DB_PORT" ] || [ -z "$SENSOR_DB_NAME" ] || [ -z "$API_TOKEN" ]; then
  echo "Missing necessary environment variables in .env file"
  exit 1
fi

# Prompt the user for other required inputs
read -p "Enter Client Display Name: " CLIENT_DISPLAY_NAME
read -p "Enter Function Name: " FUNCTION_NAME
read -p "Enter Argument: " ARGUMENT

# Query to get all device serial numbers for given client name
query="SELECT d.serial_number 
       FROM devices d 
       JOIN clients c ON d.client_id = c.id 
       WHERE c.display_name = '$CLIENT_DISPLAY_NAME';"

# Execute the query and store device serial numbers
device_serial_numbers=$(sudo PGPASSWORD=$SENSOR_DB_PASSWORD psql -U $SENSOR_DB_USER -h $SENSOR_DB_HOST -p $SENSOR_DB_PORT -d $SENSOR_DB_NAME --set=sslmode=require -qtAX -c "$query")

# Loop through the serial numbers and make the API call for each one
for serial_number in $device_serial_numbers
do
  echo "Calling function '$FUNCTION_NAME' on device with serial number: $serial_number"
  
  curl -H "Authorization: Bearer $API_TOKEN" \
       "https://api.particle.io/v1/devices/$serial_number/$FUNCTION_NAME" \
       -d "arg=$ARGUMENT"

  echo ""
done
