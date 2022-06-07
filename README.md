# Air Farms
# Python version needed is Python 3.10.4
`pip install -f requirements.txt`

# Build containers
`docker compose -f docker-compose-production.yml build`

# Run local server
`docker compose -f docker-compose-production.yml up`

# Build react service
`npm serve -s build`
