Infrastructure to observe the app.

Includes:
1) Prometheus which will scrape app's metrics on port 3001
    - `./promtail.yaml`
2) Loki and Promtail that will load logs from `<project_dir>/logs/*` folder
    - `./loki.yaml`
    - `./promtail.yaml`
3) Grafana to see those logs and metrics
    - `./grafana-datasources.yaml`
4) Script to create test traffic for the app using grafana/k6
    - `./load-test-config.js`
    - `./load-test-run.js`

Docker containers run on host network to allow prometheus to scrape an app running on localhost.

## How to Use
1) Change directory to infrastructure folder with `cd infrastructure`
2) Run `docker compose up -d` to start the containers
3) Run `npm run dev:log-file` to start the application
4) Run `bash load-test-run.sh` to create test traffic for the app
5) Go to Grafana UI on `localhost:3000` -> Menu -> Explore and see logs / metrcis there.

Cleanup:
1) `docker compose down`
2) `rm logs/*`
