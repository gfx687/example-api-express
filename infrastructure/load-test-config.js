import http from "k6/http";
import { sleep } from "k6";

export const options = {
  vus: 3,
  duration: "5m",
};

export default function () {
  http.get("http://127.0.0.1:3001/api/bugs");
  sleep(1);
}
