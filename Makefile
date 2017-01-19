CC=webpack
DEV_PARAMS=--config webpack.config.js
PROD_PARAMS=--config webpack.config.prod.js

webpack:
	$(CC) $(DEV_PARAMS)

production:
	$(CC) $(PROD_PARAMS)
