from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth import authenticate, login, logout
from models import *
import populateShifts
import datetime


def index(request):
    print request.method
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                if user.groups.all()[0].name == "Admin":
                    isAdmin = "True"
                    allInstr = [[i.username, i.first_name + " " + i.last_name]  for i in list(User.objects.all())]
                else:
                    isAdmin = "False"
                    allInstr = [[user.username, user.first_name + " " + user.last_name]]
                                    
                login(request, user)
                request.session['username'] = user.username
                instr = User.objects.get(username = 'admin')
                instr_name = instr.first_name + instr.last_name
                return render_to_response('index.html', {'instructor': request.session['username'],
                                                         'isAdmin': isAdmin,
                                                         'allInstr': allInstr,
                                                         'is_logged_in': "True",
                                                         'error': None},
                                          context_instance=RequestContext(request))
            else:
                return render_to_response('index.html', {'instructor': None,
                                                        'is_logged_in': "False",
                                                        'error': 'Invalid Username'},
                                          context_instance=RequestContext(request))
        else:
            return render_to_response('index.html', {'instructor': None,
                                                     'is_logged_in': "False",
                                                     'error': 'Invalid Password'},
                                      context_instance=RequestContext(request))
    try:
        request.session['username']
        print request.session['username']
    except:
        print "not logged in"
        return render_to_response('index.html', {'instructor': None,
                                                 'is_logged_in': "False",
                                                 'error': 'Please login'},
                                  context_instance=RequestContext(request))

    user = User.objects.get(username = request.session['username'])

    if user.groups.all()[0].name == "Admin":
        isAdmin = "True"
        allInstr = [[i.username, i.first_name + " " + i.last_name]  for i in list(User.objects.all())]
    else:
        isAdmin = "False"
        allInstr = [[user.username, user.first_name + " " + user.last_name]]
            
    return render_to_response('index.html', {'instructor': request.session['username'],
                                         'isAdmin': isAdmin,
                                         'allInstr': allInstr,
                                         'is_logged_in': "True",
                                         'error': None},
                          context_instance=RequestContext(request))

def logout(request):
    #user = User.objects.get(username = request.session['username'])
    #logout(request)
    print 'in logout'
    try:
        del request.session['username']
    except:
        pass
    return render_to_response('index.html', {'instructor': None,
                                             'is_logged_in': "False",
                                             'error': 'Please login'},
                              context_instance=RequestContext(request))


    
        
    

def view_calendar(request, instr=None):
    try:
        logged_in = User.objects.get(username = request.session['username'])
        if instr == None:
            instr = logged_in
        else:
            instr = User.objects.get(username = instr)
    except:
        return render_to_response('index.html', {'instructor': None,
                                                 'is_logged_in': "False",
                                                 'error': 'Please login'},
                                  context_instance=RequestContext(request))

    instr_name = instr.first_name + instr.last_name
    if logged_in.groups.all()[0].name == "Admin":
        isAdmin = "True"
    else:
        isAdmin = "False"
        if request.session['username'] != instr.username:
            print "authError"
            user = User.objects.get(username = request.session['username'])
            allInstr = [[user.username, user.first_name + " " + user.last_name]]
            return render_to_response('index.html', {'instructor': request.session['username'],
                                         'isAdmin': isAdmin,
                                         'allInstr': allInstr,
                                         'is_logged_in': "True",
                                         'error': "authorizationDenied"},
                                      context_instance=RequestContext(request))
    shifts = list(ScheduledShifts.objects.filter(instructor = instr))
    my_shifts = []
    pending_changes = []
    cnt = 0
    for s in shifts:
        shift_status = get_human_readable_status(s.status)
        shift_time = get_human_readable_time(s.shift.all()[0].time)
        shift_discipline = get_human_readable_discipline(s.discipline)
        my_shifts.append([shift_status, s.shift.all()[0].date, shift_time, shift_discipline])
        if s.status == 1 or s.status == 2:
            pending_changes.append([shift_status, s.shift.all()[0].date, shift_time, shift_discipline, cnt])
            cnt += 1
    if len(pending_changes) == 0:
        pending_changes = None
    
	dec_offset_start = []
    jan_offset_start = []
    feb_offset_start = []
    mar_offset_start = []
    dec_offset_end = []
    jan_offset_end = []
    feb_offset_end = []
    mar_offset_end = []
    all_dates = []
    current_year = datetime.datetime.now().year
    if datetime.datetime.now().month > 8:
        current_year += 1
    start_date = datetime.date(current_year, 12, 1)
    end_date = datetime.date(current_year + 1, 3, 31)
    while start_date <= end_date:
        if start_date.day == 1:
            if start_date.month == 12:
                dec_offset_start = range((start_date.weekday() + 1) % 7)
            elif start_date.month == 1:
                dec_offset_end = range(7 - ((start_date.weekday() + 1) % 7))
                jan_offset_start = range((start_date.weekday() + 1) % 7)
            elif start_date.month == 2:
                jan_offset_end = range(7 - ((start_date.weekday() + 1) % 7))
                feb_offset_start = range((start_date.weekday() + 1) % 7)
            elif start_date.month == 3:
                feb_offset_end = range(7 - ((start_date.weekday() + 1) % 7))
                mar_offset_start = range((start_date.weekday() + 1) % 7)
        all_dates.append(start_date)
        start_date += datetime.timedelta(1);
    mar_offset_end = range(7 - ((start_date.weekday() + 1) % 7))
    
    return render_to_response('calendar.html',
                              {'instructor': instr_name,
                               'isAdmin': isAdmin,
                               'shifts': my_shifts,
                              'pending_changes' : pending_changes,
                               'all_dates': all_dates,
                               'dec_offset_start': dec_offset_start,
                               'jan_offset_start': jan_offset_start,
                               'feb_offset_start': feb_offset_start,
                               'mar_offset_start': mar_offset_start,
                               'dec_offset_end': dec_offset_end,
                               'jan_offset_end': jan_offset_end,
                               'feb_offset_end': feb_offset_end,
                               'mar_offset_end': mar_offset_end},
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
    
