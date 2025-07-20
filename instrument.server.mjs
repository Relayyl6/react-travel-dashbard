import * as Sentry from "@sentry/react-router";

Sentry.init({
  dsn: "https://a0c70e6da58202dc6345301f9874daa0@o4509669784879104.ingest.de.sentry.io/4509670708281424",

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
  tracesSampleRate: 1.0, // Capture 100% of the transactions
});