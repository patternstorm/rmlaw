import { BrowserApplication } from "@typescene/webapp";
import MainActivity from "./activities/main/activity";

// ... register services here
// new MyService().register();

BrowserApplication.run(
  MainActivity,
  // ... add activities here
);



// uncomment to use the browser history API:
// app.useHistoryAPI();
