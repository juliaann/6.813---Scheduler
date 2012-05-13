from models import *
import datetime

def add_shifts():
    current_year = datetime.datetime.now().year
    if datetime.datetime.now().month > 8:
        current_year += 1
    start_date = datetime.date(current_year, 12, 16)
    end_date = datetime.date(current_year + 1, 3, 16)
    all_dates = []
    while start_date <= end_date:
        all_dates.append(start_date)
        start_date += datetime.timedelta(1)
    for d in all_dates:
        if d != datetime.date(current_year, 12, 25):
            s = Shift(date = d, time = 0, hasAdultSki = True, hasAdultBoard = True)
            if d.weekday() == 5:
                s.hasChildrensSki = True
                s.hasChildrensBoard = True
                s.hasRace = True
            elif d.weekday() == 6:
                s.hasChildrensSki = True
                s.hasChildrensBoard = True
                s.hasRace = False
            elif d > datetime.date(current_year, 12, 22) and d < datetime.date(current_year + 1, 1, 4):
                s.hasChildrensSki = True
                s.hasChildrensBoard = True
                s.hasRace = False
            else:
                s.hasChildrensSki = False
                s.hasChildrensBoard = False
                s.hasRace = False
            print s
            s.save()
        if d != datetime.date(current_year, 12, 24):
            s = Shift(date = d, time = 1, hasAdultSki = True, hasAdultBoard = True,
                      hasChildrensSki = False, hasChildrensBoard = False, hasRace = False)
            s.save()
        if d.weekday() == 4 or d.weekday() == 5:
            s = Shift(date = d, time = 2, hasAdultSki = True, hasAdultBoard = True,
                      hasChildrensSki = False, hasChildrensBoard = False, hasRace = False)
            s.save()
        elif d > datetime.date(current_year, 12, 22) and d < datetime.date(current_year + 1, 1, 4):
            s = Shift(date = d, time = 2, hasAdultSki = True, hasAdultBoard = True,
                      hasChildrensSki = False, hasChildrensBoard = False, hasRace = True)
            s.save()
            
