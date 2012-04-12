from django.shortcuts import render_to_response
from django.template import RequestContext
from models import *


def index(request):
    return render_to_response('index.html')

def view_calendar(request):
    instr = User.objects.get(username = 'admin')
    instr_name = instr.first_name + instr.last_name
    print instr_name
    shifts = list(ScheduledShifts.objects.filter(instructor = instr))
    print shifts
    my_shifts = []
    for s in shifts:
        shift_status = get_human_readable_status(s.status)
        shift_time = get_human_readable_time(s.shift.all()[0].time)
        shift_discipline = get_human_readable_discipline(s.discipline)
        my_shifts+=[[shift_status, s.shift.all()[0].date, shift_time, shift_discipline]]
    print my_shifts
    return render_to_response('calendar.html',
                              {'instructor': instr_name,
                               'shifts': my_shifts},
                              context_instance=RequestContext(request))

def get_human_readable_time(shift_num):
    if shift_num == 0:
        return "Day"
    elif shift_num == 1:
        return "Evening"
    elif shift_num == 2:
        return "Night"
    else:
        return "Invalid"

def get_human_readable_status(status_num):
    if status_num == 0:
        return "Normal"
    elif status_num == 1:
        return "Pending Add"
    elif status_num == 2:
        return "Pending Delete"
    elif status_num == 3:
        return "Excused"
    elif status_num == 4:
        return "Absent"
    else:
        return "Invalid"

def get_human_readable_discipline(discipline_num):
    if discipline_num == 0:
        return "Adult Ski"
    elif discipline_num == 1:
        return "Adult Board"
    elif discipline_num == 2:
        return "Children's Ski"
    elif discipline_num == 3:
        return "Children's Board"
    elif discipline_num == 4:
        return "Race"
    else:
        return "Invalid"
    
