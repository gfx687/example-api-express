Infrastructure to observe the app.

Includes:

1. PostgreSQL database
2. Prometheus which will scrape app's metrics on port 3001
   - `./promtail.yaml`
3. Loki and Promtail that will load logs from `<project_dir>/logs/*` folder
   - `./loki.yaml`
   - `./promtail.yaml`
4. Grafana to see those logs and metrics
   - `./grafana-datasources.yaml`
5. Script to create test traffic for the app using grafana/k6
   - `./load-test-config.js`
   - `./load-test-run.js`

Docker containers run on host network to allow prometheus to scrape an app running on localhost.

## How to Use

1. Run `npm run infra:up`
2. Run `npm run dev:log-file` to start the application
3. Run `bash infrastructure/load-test-run.sh` to create test traffic for the app
4. Go to Grafana UI on `localhost:3000` -> Menu -> Explore and see logs / metrcis there.

Cleanup:

1. `npm run infra:down`
2. `rm logs/*`
