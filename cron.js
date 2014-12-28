var cron    = require('cron'),
    CronJob = cron.CronJob;

var job = new CronJob('*/15 * * * * *', function(){
    // Runs every weekday (Monday through Friday)
    // at 11:30:00 AM. It does not run on Saturday
    // or Sunday.
    console.log('cron executing');
  }, function () {
    // This function is executed when the job stops
    console.log('cron stopping');
  },
  true                  /* Start the job right now */,
  "America/Denver"      /* Time zone of this job. */
);