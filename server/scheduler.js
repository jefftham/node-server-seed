  const later = require('later');
  later.date.localTime();
  const config = require('./config');

  // time for the scheduler task
  // ref https://bunkat.github.io/later/execute.html
  /*
    let dailySummary_time = '08:00';
    let time_up = '09:31';
    let time_down = '16:01';

    let schdule_daily_summary = later.parse.recur().on(dailySummary_time).time().onWeekday();
    let schdule_check_up = later.parse.recur().every(1).minute().after(time_up).time().before(time_down).time().onWeekday();
    const schdule_check_down = later.parse.recur().on(time_down).time().onWeekday();
   */

  if (config.env === 'dev' || config.env === 'debug') {
      /*
            time_up = '00:00';
            time_down = '23:59';
            schdule_check_up = later.parse.recur().every(1).minute().after(time_up).time().before(time_down).time()

            dailySummary_time = '21:26';
            schdule_daily_summary = later.parse.recur().on(dailySummary_time).time();
             */
  }

  // this module called by webapp.js
  module.exports = function () {

      /*
            const schdule_ummary = later.setInterval(
                () => {
                    // tasks
                    console.log(new Date().toLocaleString() + " Schedule job started. sending out daily stocks summary now. ");
                    alert.checker.dailySummary();
                }, schdule_daily_summary);
       */

  };
