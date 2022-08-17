import schedule

import datetime

from connection import cur


def handle_solicitudes():
    limit_date = datetime.datetime.now()
    from_date = datetime.datetime.now() - datetime.timedelta(seconds=10)

    cur.execute("SELECT * FROM solicitudes WHERE created_at >= %s AND created_at <= %s",
                [from_date, limit_date])
    solicitudes = cur.fetchall()
    print(solicitudes)


schedule.every(10).seconds.do(handle_solicitudes)

while True:
    schedule.run_pending()
